
import React from 'react';

const Logo: React.FC<{ className?: string, onClick?: () => void }> = ({ className = "w-10 h-10", onClick }) => (
  <div className={`relative flex items-center justify-center cursor-pointer ${className}`} onClick={onClick}>
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="currentColor" fillOpacity="0.05" />
      <path d="M30 30V70M30 50L70 30M30 50L70 70" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

export default Logo;
