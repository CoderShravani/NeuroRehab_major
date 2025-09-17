import React, { useState, useEffect, useRef, useCallback } from 'react';
import Button from '../ui/Button';
import * as handpose from "@tensorflow-models/handpose";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs";

interface CameraGameProps {
  gameType: string;
  onExit: () => void;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

type GameState = 'LOADING_MODEL' | 'WAITING_FOR_CAMERA' | 'READY' | 'HOW_TO_PLAY' | 'PLAYING' | 'GAME_OVER';

const GAME_DURATION = 30; // seconds

const BubbleBurstGame: React.FC<CameraGameProps> = ({ gameType, onExit }) => {
  const [gameState, setGameState] = useState<GameState>('LOADING_MODEL');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // For the preview
  const cursorRef = useRef<HTMLDivElement>(null);
  const requestAnimationRef = useRef<number | null>(null);
  const handposeModelRef = useRef<handpose.HandPose | null>(null);
  
  const loadHandposeModel = useCallback(async () => {
    try {
      // FIX: In some versions or bundler configurations of @tensorflow/tfjs, `setBackend` is not exposed on the top-level `tf` namespace.
      // Using `tf.engine().setBackend()` is the correct alternative to access it.
      await tf.engine().setBackend('webgl');
      const model = await handpose.load();
      handposeModelRef.current = model;
      setGameState('WAITING_FOR_CAMERA');
    } catch (e: any) {
      console.error("Failed to load Handpose model:", e);
      setError("Could not load the hand tracking model. Please try again later.");
      setGameState('GAME_OVER');
    }
  }, []);

  const setupCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Your browser does not support camera access.");
      setGameState('GAME_OVER');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadeddata', () => {
          videoRef.current?.play();
          setGameState('READY');
        });
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setError("Camera access is required to play. Please allow camera permissions and refresh.");
      setGameState('GAME_OVER');
    }
  }, []);
  
  const resetGame = () => {
      setScore(0);
      setTimeLeft(GAME_DURATION);
      setBubbles([]);
      if (!handposeModelRef.current) {
        setError("Could not load the hand tracking model. Please try again later.");
      } else {
        setError(null);
      }
      setGameState('READY');
  };

  const predictWebcam = useCallback(async () => {
    if (!videoRef.current || !handposeModelRef.current || gameState !== 'PLAYING') {
      if(requestAnimationRef.current) cancelAnimationFrame(requestAnimationRef.current);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (video.readyState >= 2 && canvas && ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        const predictions = await handposeModelRef.current.estimateHands(video);
        
        if (predictions.length > 0) {
            const landmarks = predictions[0].landmarks;
            const fingerTip = landmarks[8] as [number, number, number];
            
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(fingerTip[0], fingerTip[1], 10, 0, 2 * Math.PI);
            ctx.fill();
            
            if (fingerTip) {
                const [x, y] = fingerTip;
                const scaledX = window.innerWidth - (x / video.videoWidth) * window.innerWidth;
                const scaledY = (y / video.videoHeight) * window.innerHeight;

                if (cursorRef.current) {
                    cursorRef.current.style.transform = `translate(${scaledX}px, ${scaledY}px)`;
                }

                setBubbles(prevBubbles => {
                    const hitBubbleIds = new Set<number>();
                    for (const bubble of prevBubbles) {
                        const distance = Math.sqrt(Math.pow(bubble.x - scaledX, 2) + Math.pow(bubble.y - scaledY, 2));
                        if (distance < bubble.size / 2) {
                            hitBubbleIds.add(bubble.id);
                        }
                    }

                    if (hitBubbleIds.size > 0) {
                        setScore(s => s + hitBubbleIds.size);
                        return prevBubbles.filter(b => !hitBubbleIds.has(b.id));
                    }
                    return prevBubbles;
                });
            }
        }
    }
    
    requestAnimationRef.current = requestAnimationFrame(predictWebcam);
  }, [gameState]);

  useEffect(() => {
    loadHandposeModel();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
      if(requestAnimationRef.current) cancelAnimationFrame(requestAnimationRef.current);
    };
  }, [loadHandposeModel]);

  useEffect(() => {
    if (gameState === 'WAITING_FOR_CAMERA') {
      setupCamera();
    }
  }, [gameState, setupCamera]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameState('GAME_OVER');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);
  
  useEffect(() => {
    if (gameState === 'PLAYING') {
      const bubbleCreator = setInterval(() => {
        const size = Math.random() * 80 + 60; // Increased bubble size
        setBubbles(prev => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + size,
            size,
            speed: Math.random() * 1.5 + 0.5, // Slightly slower speed
          },
        ]);
      }, 900); // Slightly slower spawn rate

      const bubbleMover = setInterval(() => {
        setBubbles(prev => 
          prev.map(b => ({ ...b, y: b.y - b.speed }))
              .filter(b => b.y > -b.size)
        );
      }, 16);

      return () => {
        clearInterval(bubbleCreator);
        clearInterval(bubbleMover);
      };
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      requestAnimationRef.current = requestAnimationFrame(predictWebcam);
    } else {
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current);
        requestAnimationRef.current = null;
      }
    }
    return () => {
      if(requestAnimationRef.current) cancelAnimationFrame(requestAnimationRef.current)
    };
  }, [gameState, predictWebcam]);


  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0f2027] to-[#2c5364] text-white p-4 overflow-hidden relative select-none">
      <h1 className="text-4xl font-bold absolute top-10 left-1/2 -translate-x-1/2 opacity-20" style={{ visibility: gameState === 'PLAYING' ? 'visible' : 'hidden' }}>{gameType}</h1>
      
      <div className="fixed top-4 left-4 text-2xl font-semibold bg-black/30 p-2 rounded-md z-30">Score: {score}</div>
      <div className="fixed top-4 right-4 text-2xl font-semibold bg-black/30 p-2 rounded-md z-30">Time: {timeLeft}</div>

      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute rounded-full bg-[rgba(0,200,255,0.7)]"
          style={{
            left: bubble.x - bubble.size / 2,
            top: bubble.y - bubble.size / 2,
            width: bubble.size,
            height: bubble.size,
          }}
        />
      ))}
      
       <div ref={cursorRef} className="w-6 h-6 bg-red-500 rounded-full absolute top-0 left-0 border-2 border-white pointer-events-none z-50" style={{ opacity: gameState === 'PLAYING' ? 1 : 0 }}></div>

      {gameState !== 'PLAYING' && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
          {gameState === 'LOADING_MODEL' && (
              <>
                 <svg className="animate-spin h-10 w-10 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 <p className="text-xl">Loading Hand Tracking Model...</p>
              </>
          )}
          {gameState === 'WAITING_FOR_CAMERA' && <p className="text-xl">Please allow camera access...</p>}
          {gameState === 'READY' && (
            <div className="text-center p-8 bg-brand-dark/50 rounded-lg">
              <h2 className="text-5xl font-bold mb-4">Ready to Play?</h2>
              <Button onClick={() => setGameState('HOW_TO_PLAY')}>Start Game</Button>
            </div>
          )}
          {gameState === 'HOW_TO_PLAY' && (
             <div className="text-center p-8 bg-brand-dark/50 rounded-lg max-w-lg">
                <h2 className="text-4xl font-bold mb-4">How to Play</h2>
                <p className="text-lg mb-2">1. Allow camera access when prompted.</p>
                <p className="text-lg mb-2">2. Hold your hand up so the camera can see it.</p>
                <p className="text-lg mb-6">3. A <span className="text-red-400 font-bold">red dot</span> will track your index finger. Use it to pop the bubbles!</p>
                <Button onClick={() => setGameState('PLAYING')} variant="secondary">Let's Go!</Button>
             </div>
          )}
          {gameState === 'GAME_OVER' && (
             <div className="text-center bg-brand-dark/80 p-8 rounded-lg shadow-2xl">
              <h2 className="text-5xl font-bold mb-2">🎉 Game Over! 🎉</h2>
              <p className="text-3xl mb-6">Final Score: {score}</p>
              {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
              <div className="flex space-x-4 mt-4">
                  <Button onClick={resetGame} variant="secondary" disabled={!handposeModelRef.current}>Play Again</Button>
                  <Button onClick={onExit} variant="outline">Exit to Dashboard</Button>
              </div>
            </div>
          )}
        </div>
      )}

      <Button
        onClick={onExit}
        variant="primary"
        className="!bg-red-500 hover:!bg-red-600 fixed top-4 right-4 z-30"
        style={{ visibility: gameState === 'PLAYING' ? 'visible' : 'hidden' }}
      >
        Exit Game
      </Button>

      {/* Camera Preview */}
      <div className="fixed bottom-5 right-5 w-48 h-36 border-2 border-white rounded-lg overflow-hidden z-40 bg-black" style={{ visibility: gameState === 'PLAYING' ? 'visible' : 'hidden' }}>
        <video ref={videoRef} className="absolute top-0 left-0 w-full h-full opacity-0" autoPlay playsInline muted></video>
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
      </div>
    </div>
  );
};

export default BubbleBurstGame;