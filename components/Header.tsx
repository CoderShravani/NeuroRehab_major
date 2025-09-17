
import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  onLogout?: () => void;
  isLoggedIn?: boolean;
}

const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.75 0 1.45-.09 2.13-.25-.3-.92-.48-1.93-.48-3.03 0-1.4.35-2.73.96-3.91-.93.22-1.92.34-2.95.34-3.51 0-6.42-2.51-7-5.72C5.55 6.07 8.54 4 12 4c1.66 0 3.18.53 4.4 1.41-.35-.58-.59-1.25-.6-1.97C14.86 2.51 13.48 2 12 2zm8.82 9c.12.67.18 1.35.18 2.04 0 3.32-2.1 6.33-5.06 7.42.79-.69 1.43-1.57 1.88-2.58 1.25-.49 2.1-1.7 2.1-3.15 0-.8-.28-1.54-.75-2.13.1-.64.15-1.3.15-1.96 0-1.2-.28-2.32-.79-3.32.7.53 1.27 1.24 1.63 2.08.57 1.34.86 2.77.86 4.19zM12 6c-2.37 0-4.42 1.44-5.26 3.5C7.29 10.92 9.42 12 12 12s4.71-1.08 5.26-2.5C16.42 7.44 14.37 6 12 6z"/>
    </svg>
);


const Header: React.FC<HeaderProps> = ({ onNavigate, onLogout, isLoggedIn = false }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate(Page.Home)}>
          <BrainIcon />
          <span className="text-2xl font-bold text-brand-dark">NeuroRehab</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(Page.Home); }} className="text-slate-600 hover:text-brand-primary font-medium transition-colors">Home</a>
          <a href="#" className="text-slate-600 hover:text-brand-primary font-medium transition-colors">About</a>
          <a href="#" className="text-slate-600 hover:text-brand-primary font-medium transition-colors">Contact</a>
        </nav>
        <div>
          {isLoggedIn && onLogout ? (
             <button onClick={onLogout} className="px-5 py-2 font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                Logout
             </button>
          ) : (
            <button onClick={() => onNavigate(Page.SignIn)} className="px-5 py-2 font-semibold rounded-lg bg-brand-primary text-white hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors">
              Sign In / Sign Up
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
