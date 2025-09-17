import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const EyeIcon: React.FC<{ isOpen: boolean; onClick: () => void; }> = ({ isOpen, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700 focus:outline-none"
    aria-label={isOpen ? "Hide password" : "Show password"}
  >
    {isOpen ? (
      // Eye slash icon for "hide"
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m0 0l-3.59-3.59m0 0l-3.59 3.59" />
      </svg>
    ) : (
      // Eye icon for "show"
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
      </svg>
    )}
  </button>
);

const Input: React.FC<InputProps> = ({ label, id, type, className, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  // Combine base classes with any custom classes passed in props, and add padding for the icon if needed
  const baseClasses = "block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm cursor-text";
  const finalClassName = `${baseClasses} ${isPassword ? 'pr-10' : ''} ${className || ''}`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          className={finalClassName}
          {...props}
        />
        {isPassword && (
          <EyeIcon isOpen={showPassword} onClick={togglePasswordVisibility} />
        )}
      </div>
    </div>
  );
};

export default Input;