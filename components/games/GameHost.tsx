import React from 'react';
import BubbleBurstGame from './BubbleBurstGame';
// Import other games here as they are created
// import BallCatcherGame from './BallCatcherGame';

interface GameHostProps {
  gameType: string;
  onExit: () => void;
}

const GameHost: React.FC<GameHostProps> = ({ gameType, onExit }) => {
  switch (gameType) {
    case 'Bubble Burst Challenge':
      return <BubbleBurstGame onExit={onExit} gameType={gameType} />;
    // case 'Ball Catcher':
    //   return <BallCatcherGame onExit={onExit} />;
    default:
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-brand-dark text-white p-4">
          <h2 className="text-3xl font-bold mb-4">Error</h2>
          <p>The selected game '{gameType}' could not be found.</p>
          <button onClick={onExit} className="mt-6 px-6 py-2 bg-brand-primary rounded-lg">
            Back to Dashboard
          </button>
        </div>
      );
  }
};

export default GameHost;
