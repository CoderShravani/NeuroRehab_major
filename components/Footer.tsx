
import React from 'react';
import { Page } from '../types'; // Assuming Page enum is available for navigation

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">NeuroRehab</h3>
            <p className="text-brand-light">Rehabilitation Made Engaging and Effective.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-accent transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">About</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Sign In</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <p className="text-brand-light">123 Health St, Wellness City</p>
            <p className="text-brand-light">contact@neurorehab.com</p>
          </div>
        </div>
        <div className="mt-12 border-t border-blue-900 pt-6 text-center text-brand-light">
          <p>&copy; {new Date().getFullYear()} NeuroRehab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
