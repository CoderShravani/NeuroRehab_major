import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import { UserRole, Page } from '../types';
// FIX: Switched to v8 compat imports and added firebase for provider and timestamp.
import { auth, db, firebase } from '../firebase';
// import { 
//   createUserWithEmailAndPassword, 
//   signInWithEmailAndPassword, 
//   GoogleAuthProvider, 
//   signInWithPopup,
//   signOut
// } from 'firebase/auth';
// import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';


interface SignInPageProps {
  onNavigate: (page: Page) => void;
  onDemoSignIn: (role: UserRole) => void;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.4 64.5c-24.3-23.6-57.5-38.4-96.5-38.4-83.3 0-151.8 68.5-151.8 152.9s68.5 152.9 151.8 152.9c97.1 0 134.3-70.8 138.6-106.3H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path>
  </svg>
);


const SignInPage: React.FC<SignInPageProps> = ({ onNavigate, onDemoSignIn }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
        setError("Please select a role first.");
        return;
    }
    setLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        // FIX: Use the createUserWithEmailAndPassword method from the auth object (v8 compat syntax).
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        if (user) {
          // FIX: Use collection().doc().set() and firebase.firestore.FieldValue for v8 compat syntax.
          await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            email: user.email,
            role: selectedRole,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        }
      } else {
        // FIX: Use the signInWithEmailAndPassword method from the auth object (v8 compat syntax).
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        if (user) {
          // FIX: Use collection().doc() syntax for Firestore documents (v8 compat syntax).
          const userDocRef = db.collection('users').doc(user.uid);
          // FIX: Use the .get() method on a document reference to fetch it (v8 compat syntax).
          const userDocSnap = await userDocRef.get();

          if (userDocSnap.exists) {
            const userData = userDocSnap.data();
            if (userData?.role !== selectedRole) {
              // FIX: Use the signOut method from the auth object (v8 compat syntax).
              await auth.signOut();
              setError(`This account is registered as a ${userData.role}. Please sign in with the correct role selection.`);
              setLoading(false);
              return;
            }
          } else {
            // FIX: Use the signOut method from the auth object (v8 compat syntax).
            await auth.signOut();
            setError("Account data not found. Please sign up again or contact support.");
            setLoading(false);
            return;
          }
        }
      }
    } catch (err: any) {
      if (isSignUp) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError("An account with this email already exists. Please sign in or use a different email.");
            break;
          case 'auth/weak-password':
            setError("The password is too weak. Please use at least 6 characters.");
            break;
          case 'auth/invalid-email':
            setError("The email address is not valid.");
            break;
          default:
            console.error("Firebase SignUp Error: ", err);
            setError(`Sign-up failed: ${err.message}. This could be a project configuration issue.`);
            break;
        }
      } else { // Sign In
        if (['auth/user-not-found', 'auth/wrong-password', 'auth/invalid-credential'].includes(err.code)) {
          setError("Incorrect email or password. Please check your credentials and try again.");
        } else {
          console.error("Firebase SignIn Error: ", err);
          setError(`Sign-in failed: ${err.message}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    if (!selectedRole) {
        setError("Please select a role first.");
        return;
    }
    setLoading(true);
    setError(null);
    // FIX: Use firebase.auth.GoogleAuthProvider for v8 compat syntax.
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        // FIX: Use the signInWithPopup method from the auth object (v8 compat syntax).
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        if (user) {
            const userDocRef = db.collection('users').doc(user.uid);
            const userDocSnap = await userDocRef.get();
            if (userDocSnap.exists) {
                // Existing user, check if role matches
                const userData = userDocSnap.data();
                if (userData?.role !== selectedRole) {
                    await auth.signOut();
                    setError(`This account is registered as a ${userData.role}. Please sign in with the correct role selection.`);
                    setLoading(false);
                    return;
                }
            } else {
                // It's a new user, create their document in Firestore
                await userDocRef.set({
                    uid: user.uid,
                    email: user.email,
                    role: selectedRole,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    displayName: user.displayName,
                }, { merge: true });
            }
        }
    } catch (err: any) {
        if (err.code === 'auth/invalid-credential') {
            setError("Authentication with Google failed. Please check your Firebase project configuration for Google Sign-In, including API key restrictions and authorized domains.");
        } else if (err.code === 'auth/popup-closed-by-user') {
            // User cancelled, not an error. Don't show a message.
        } else {
            console.error("Google Sign In error:", err);
            setError(err.message.replace('Firebase: ', ''));
        }
    } finally {
        setLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light p-4">
        <Card className="w-full max-w-md text-center">
          <h2 className="text-3xl font-bold text-brand-dark mb-4">Welcome to NeuroRehab</h2>
          <p className="text-slate-600 mb-8">Please select your role to continue.</p>
          <div className="space-y-4">
            <div onClick={() => setSelectedRole(UserRole.Patient)} className="group p-6 border-2 border-slate-200 rounded-lg hover:border-brand-primary hover:bg-brand-light transition-all cursor-pointer">
              <h3 className="text-2xl font-semibold text-brand-dark group-hover:text-brand-primary">👩‍⚕️ I am a Patient</h3>
              <p className="text-slate-500 mt-2">Access your personalized games and track your recovery journey.</p>
            </div>
            <div onClick={() => setSelectedRole(UserRole.Doctor)} className="group p-6 border-2 border-slate-200 rounded-lg hover:border-brand-primary hover:bg-brand-light transition-all cursor-pointer">
              <h3 className="text-2xl font-semibold text-brand-dark group-hover:text-brand-primary">👨‍⚕️ I am a Doctor/Therapist</h3>
              <p className="text-slate-500 mt-2">Monitor your patients' progress and provide expert guidance.</p>
            </div>
             <button onClick={() => onNavigate(Page.Home)} className="text-sm text-slate-600 hover:text-brand-primary mt-4">← Back to Home</button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light p-4">
      <Card className="w-full max-w-sm">
        <button onClick={() => setSelectedRole(null)} className="text-sm text-slate-600 hover:text-brand-primary mb-4">← Change Role</button>
        <h2 className="text-2xl font-bold text-brand-dark mb-6 text-center">{isSignUp ? 'Create Account' : 'Sign In'} as a {selectedRole}</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
        <form onSubmit={handleAuthAction} className="space-y-4">
          <Input id="email" label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          <Input id="password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete={isSignUp ? "new-password" : "current-password"} />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
        </form>
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-300"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-sm">OR</span>
          <div className="flex-grow border-t border-slate-300"></div>
        </div>
        <Button type="button" onClick={handleGoogleSignIn} variant="outline" className="w-full flex items-center justify-center" disabled={loading}>
          <GoogleIcon />
          {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
        </Button>
        <Button
          type="button"
          onClick={() => onDemoSignIn(selectedRole!)}
          variant="secondary"
          className="w-full mt-4"
          disabled={loading}
        >
          Sign In as Demo {selectedRole}
        </Button>
        <p className="text-center text-sm text-slate-600 mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => { setIsSignUp(!isSignUp); setError(null); }} className="font-semibold text-brand-primary hover:underline ml-1">
                {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
        </p>
      </Card>
    </div>
  );
};

export default SignInPage;
