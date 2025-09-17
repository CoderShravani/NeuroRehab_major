
import React from 'react';

// FIX: Extend props with React.HTMLAttributes<HTMLDivElement> to allow passing standard div props like onClick.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow duration-300 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;