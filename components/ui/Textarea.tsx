import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <textarea
        id={id}
        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm cursor-text"
        {...props}
      />
    </div>
  );
};

export default Textarea;