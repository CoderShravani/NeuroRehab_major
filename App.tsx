import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import SignInPage from './components/SignInPage';
import PatientForm from './components/PatientForm';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import GameHost from './components/games/GameHost';
import ChatbotPage from './components/ChatbotPage'; // Import the new chatbot page
import { Page, User, UserRole } from './types';
import { auth, db } from './firebase';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>(Page.Home);
  const [loading, setLoading] = useState(true);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false); // State for chatbot visibility

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = db.collection('users').doc(firebaseUser.uid);
        const userDocSnap = await userDocRef.get();
        if (userDocSnap.exists) {
          const userData = userDocSnap.data();
          setUser({
            uid: firebaseUser.uid,
            role: userData!.role,
            data: userData,
          });
        } else {
          await auth.signOut();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    setPage(Page.Home);
  };
  
  const handlePatientFormSubmitted = async (formData: any) => {
    if (user) {
        if (!user.uid.startsWith('demo-')) {
            const userDocRef = db.collection('users').doc(user.uid);
            await userDocRef.set(formData, { merge: true });
        }
        const updatedUser = { ...user, data: { ...user.data, ...formData } };
        setUser(updatedUser);
    }
  };
  
  const handleDemoSignIn = (role: UserRole) => {
    if (role === UserRole.Patient) {
      setUser({
        uid: 'demo-patient-uid',
        role: UserRole.Patient,
        data: {},
      });
    } else if (role === UserRole.Doctor) {
      setUser({
        uid: 'demo-doctor-uid',
        role: UserRole.Doctor,
        data: {
          fullName: 'Dr. Demo',
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-brand-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h2 className="text-xl font-semibold text-brand-dark mt-4">Loading NeuroRehab...</h2>
        </div>
      </div>
    );
  }

  // Render chatbot page if active
  if (isChatOpen && user) {
    return <ChatbotPage user={user} onExit={() => setIsChatOpen(false)} />;
  }
  
  if (activeGame) {
    // Use the GameHost to render the correct game
    return <GameHost gameType={activeGame} onExit={() => setActiveGame(null)} />;
  }

  if (user) {
    if (user.role === UserRole.Patient) {
      return user.data?.fullName 
        ? <PatientDashboard user={user} onLogout={handleLogout} onPlayGame={setActiveGame} onOpenChat={() => setIsChatOpen(true)} /> 
        : <PatientForm user={user} onFormSubmitted={handlePatientFormSubmitted} />;
    }
    if (user.role === UserRole.Doctor) {
      return <DoctorDashboard user={user} onLogout={handleLogout} />;
    }
  }

  switch (page) {
    case Page.SignIn:
      return <SignInPage onNavigate={setPage} onDemoSignIn={handleDemoSignIn} />;
    case Page.Home:
    default:
      return <HomePage onNavigate={setPage} />;
  }
};

export default App;