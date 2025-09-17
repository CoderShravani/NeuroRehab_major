import React, { useState } from 'react';
import { User } from '../types';
import Header from './Header';
import Card from './ui/Card';
import MobilityChart from './charts/MobilityChart';
import AccuracyChart from './charts/AccuracyChart';
import GamesPlayedChart from './charts/GamesPlayedChart';
import Button from './ui/Button';
import MedicalHistoryModal from './MedicalHistoryModal'; // Import the new modal
import ReactionTimeChart from './charts/ReactionTimeChart';
import AccuracyTrendChart from './charts/AccuracyTrendChart';
import SessionDurationChart from './charts/SessionDurationChart';
import GameCompletionChart from './charts/GameCompletionChart';

interface PatientDashboardProps {
  user: User;
  onLogout: () => void;
  onPlayGame: (gameTitle: string) => void;
  onOpenChat: () => void;
}

const gamesData = {
  '✋ Fingers & Fine Motor Skills': {
    keywords: ['hand', 'finger', 'fingers', 'motor'],
    games: [
      { title: 'Trace and Train', description: 'Trace patterns/shapes on screen to improve precision.' },
      { title: 'Dot Connector', description: 'Connect dots in sequence (helps with finger dexterity).' },
      { title: 'Typing Quest', description: 'Type words/letters quickly to train finger speed.' },
      { title: 'Pick & Place Puzzle', description: 'Drag and drop small objects into correct positions.' },
      { title: 'Finger Tap Rhythm', description: 'Tap in sync with rhythm (like a mini piano game).' },
    ],
  },
  '🤚 Hand & Wrist Mobility': {
    keywords: ['hand', 'wrist'],
    games: [
      { title: 'Bubble Burst Challenge', description: 'Pop bubbles on screen by moving your hand.', interactive: true },
      { title: 'Ball Catcher', description: 'Catch falling balls by moving the hand/wrist.', interactive: true },
      { title: 'Balance the Tray', description: 'Keep a digital tray steady using wrist movements.' },
      { title: 'Stack Builder', description: 'Drag and stack blocks carefully to strengthen control.' },
      { title: 'Grip & Release', description: 'Virtual objects to grab, hold, and release.' },
    ],
  },
  '💪 Arm & Shoulder Control': {
      keywords: ['arm', 'shoulder'],
      games: [
          { title: 'Reach Quest', description: 'Move arm to “reach” targets placed on screen.' },
          { title: 'Air Painter', description: 'Draw in the air to paint shapes on screen (motion tracked).' },
          { title: 'Fruit Grabber', description: 'Extend arm to grab fruits before timer ends.' },
          { title: 'Obstacle Avoider', description: 'Navigate an object using controlled arm movement.' },
          { title: 'Push & Pull Game', description: 'Virtual resistance exercises for arm strength.' },
      ],
  },
  '🧍 Neck & Upper Body': {
      keywords: ['neck', 'body', 'posture', 'upper body'],
      games: [
          { title: 'Neck Navigator', description: 'Move neck to guide a cursor through a maze.' },
          { title: 'Sky Watcher', description: 'Tilt head up/down to “catch stars” in the sky.' },
          { title: 'Target Tracker', 'description': 'Follow moving targets with controlled head movement.' },
          { title: 'Posture Guardian', description: 'Stay aligned with on-screen posture indicators.' },
      ],
  },
  '🧠 Cognitive & Memory Training': {
      keywords: ['general', 'cognitive', 'memory'],
      games: [
          { title: 'Memory Bridge – The Forgotten River', description: 'Recall and repeat patterns to rebuild a bridge.' },
          { title: 'Shape Sequence', description: 'Remember and repeat sequences of shapes/colors.' },
          { title: 'Word Recall', description: 'Match words after short memory delays.' },
          { title: 'Reaction Speed Test', description: 'Tap/click quickly when signals appear.' },
          { title: 'Attention Focus Game', description: 'Spot the difference or identify target objects.' },
      ],
  },
  '🗣️ Speech & Facial Muscles': {
      keywords: ['speech', 'face', 'facial', 'lip', 'mouth', 'breath', 'eye', 'blink'],
      games: [
          { title: 'Lip Movement Game', description: 'Match lip shapes to given sounds.' },
          { title: 'Speech Repeat Trainer', description: 'Repeat simple words/sentences after audio prompts.' },
          { title: 'Smile Challenge', description: 'Detect and hold a smile for a few seconds.' },
          { title: 'Breath Control Game', description: 'Blow (through mic) to move on-screen objects.' },
          { title: 'Eye Blink Puzzle', description: 'Blink to select or activate simple controls.' },
      ],
  },
};

const getGamesForPatient = (affectedParts?: string[]): Record<string, typeof gamesData[keyof typeof gamesData]> => {
    const patientKeywords = affectedParts?.map(p => p.toLowerCase()) || [];
    
    if (patientKeywords.length === 0) {
        const defaultCategories = ['Fingers', 'Arm', 'Cognitive'];
        const displayedCategories = Object.entries(gamesData).filter(([categoryName]) => 
            defaultCategories.some(defCat => categoryName.includes(defCat))
        );
        return Object.fromEntries(displayedCategories);
    }

    const displayedCategories = Object.entries(gamesData).filter(([categoryName, categoryData]) => {
        if (categoryData.keywords.includes('cognitive') && (patientKeywords.includes('cognitive') || categoryData.keywords.includes('general'))) {
            return true;
        }
        return patientKeywords.some(pk => categoryData.keywords.includes(pk));
    });

    return Object.fromEntries(displayedCategories);
};


const mockData = {
    mobilityData: [
        { week: 'Week 1', score: 2.5 },
        { week: 'Week 2', score: 2.8 },
        { week: 'Week 3', score: 3.2 },
        { week: 'Week 4', score: 3.5 },
    ],
    accuracyData: [
        { day: 'Mon', score: 75 },
        { day: 'Tue', score: 80 },
        { day: 'Wed', score: 82 },
        { day: 'Thu', score: 85 },
        { day: 'Fri', score: 88 },
    ],
    gamesPlayedData: [
        { name: 'Trace & Train', value: 12 },
        { name: 'Memory Bridge', value: 8 },
        { name: 'Bubble Burst', value: 15 },
        { name: 'Ball Catcher', value: 10 },
    ],
    reactionTimeData: [
        { name: 'Week 1', time: 450 },
        { name: 'Week 2', time: 420 },
        { name: 'Week 3', time: 380 },
        { name: 'Week 4', time: 350 },
    ],
    accuracyTrendData: [
        { name: 'Day 1', accuracy: 78 },
        { name: 'Day 2', accuracy: 82 },
        { name: 'Day 3', accuracy: 81 },
        { name: 'Day 4', accuracy: 85 },
        { name: 'Day 5', accuracy: 88 },
    ],
    sessionDurationData: [
        { name: 'Mon', duration: 15 },
        { name: 'Tue', duration: 20 },
        { name: 'Wed', duration: 18 },
        { name: 'Thu', duration: 25 },
        { name: 'Fri', duration: 22 },
    ],
    gameCompletionData: [
        { name: 'Completed', value: 65, fill: '#22c55e' }
    ],
};

interface GameCardProps {
    title: string;
    description: string;
    interactive?: boolean;
    onPlayGame: (gameTitle: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ title, description, interactive, onPlayGame }) => (
    <Card className="flex flex-col transform transition-transform duration-300 hover:-translate-y-1">
        <h4 className="text-lg font-bold text-brand-dark">{title}</h4>
        <p className="text-slate-600 mt-2 flex-grow">{description}</p>
        <Button 
            variant={interactive ? 'secondary' : 'primary'} 
            className={`mt-4 w-full ${!interactive ? 'bg-slate-300 hover:bg-slate-400 cursor-not-allowed' : ''}`}
            onClick={() => interactive && onPlayGame(title)}
            disabled={!interactive}
        >
            {interactive ? 'Play Now' : 'Coming Soon'}
        </Button>
    </Card>
);

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user, onLogout, onPlayGame, onOpenChat }) => {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const patientName = user.data?.fullName || 'Patient';
  const affectedParts: string[] | undefined = user.data?.affectedParts;
  const displayedGames = getGamesForPatient(affectedParts);

  const aiInsight = (affectedParts && affectedParts.length > 0)
    ? `Based on your focus on '${affectedParts.join(', ')}', we've prioritized games to strengthen those areas.`
    : `Your hand coordination improved by 20% this week! Fill in your medical history for more personalized insights.`;

  return (
    <>
      <div className="bg-slate-100 min-h-screen">
        <Header onNavigate={() => {}} onLogout={onLogout} isLoggedIn={true} />
        <main className="container mx-auto p-6">
          <h1 className="text-3xl font-bold text-brand-dark mb-2">Welcome back, {patientName}!</h1>
          <p className="text-slate-600 mb-8">Here's a summary of your progress. Keep up the great work!</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <h3 className="text-xl font-bold text-brand-dark mb-4">Progress & Analysis</h3>
                <p className="bg-brand-light text-brand-dark p-3 rounded-lg mb-6">
                  💡 <span className="font-semibold">AI Insight:</span> {aiInsight}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-center">Mobility Improvement</h4>
                    <MobilityChart data={mockData.mobilityData} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-center">Accuracy Scores</h4>
                    <AccuracyChart data={mockData.accuracyData} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-center">Reaction Time Progress</h4>
                    <ReactionTimeChart data={mockData.reactionTimeData} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-center">Movement Accuracy Trend</h4>
                    <AccuracyTrendChart data={mockData.accuracyTrendData} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-center">Session Duration</h4>
                    <SessionDurationChart data={mockData.sessionDurationData} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-center">Game Completion</h4>
                    <GameCompletionChart data={mockData.gameCompletionData} />
                  </div>
                </div>
              </Card>

              <Card>
                  <h3 className="text-xl font-bold text-brand-dark mb-4">Your Recommended Games</h3>
                   {Object.keys(displayedGames).length > 0 ? (
                      Object.entries(displayedGames).map(([categoryName, categoryData]) => (
                          <div key={categoryName} className="mb-8 last:mb-0">
                              <h4 className="text-lg font-bold text-brand-dark mb-4 border-b border-slate-200 pb-2">{categoryName}</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {categoryData.games.map((game) => (
                                      <GameCard 
                                        key={game.title} 
                                        title={game.title} 
                                        description={game.description} 
                                        interactive={(game as any).interactive}
                                        onPlayGame={onPlayGame}
                                      />
                                  ))}
                              </div>
                          </div>
                      ))
                  ) : (
                      <p className="text-slate-600">No specific games recommended. Please update your medical history for a personalized plan.</p>
                  )}
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                  <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                      <p className="font-bold">Keep going! 🎉</p>
                      <p>You completed 3 sessions this week.</p>
                  </div>
              </Card>
              <Card>
                <h3 className="text-xl font-bold text-brand-dark mb-4">Games Played</h3>
                <GamesPlayedChart data={mockData.gamesPlayedData} />
              </Card>
              <Card>
                <h3 className="text-xl font-bold text-brand-dark mb-4">AI Assistant</h3>
                <div className="space-y-2 text-sm text-slate-500">
                  <p>Need some motivation or have a question about your exercises?</p>
                  <p className="p-2 bg-brand-light rounded-md text-slate-700 font-medium">"What's a good warm-up for my hands?"</p>
                </div>
                <Button variant="secondary" className="w-full mt-4" onClick={onOpenChat}>Chat with Assistant</Button>
              </Card>
              <Card>
                <h3 className="text-xl font-bold text-brand-dark mb-4">Medical History</h3>
                <p className="text-slate-600">Your information is up-to-date.</p>
                <Button variant="outline" className="w-full mt-4" onClick={() => setIsHistoryModalOpen(true)}>View and Update</Button>
              </Card>
            </div>
          </div>
        </main>
      </div>
      {isHistoryModalOpen && <MedicalHistoryModal user={user} onClose={() => setIsHistoryModalOpen(false)} />}
    </>
  );
};

export default PatientDashboard;