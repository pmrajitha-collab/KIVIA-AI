
import React from 'react';

const Logo: React.FC<{ className?: string, onClick?: () => void }> = ({ className = "w-10 h-10", onClick }) => (
  <div className={`relative flex items-center justify-center cursor-pointer ${className}`} onClick={onClick}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Outer Skin/Green */}
      <circle cx="50" cy="50" r="48" fill="#A2D149" />
      {/* Inner Flesh (Lighter Green/Yellow) */}
      <circle cx="50" cy="50" r="18" fill="#F9E99A" />
      {/* Radiant Teardrop Seeds */}
      {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 50 50)`}>
          <path 
            d="M50 25 Q50 20 52 25 T50 32 T48 25 Q50 20 50 25" 
            fill="#333333" 
            transform="translate(0, 5)"
          />
        </g>
      ))}
    </svg>
  </div>
);

export default Logo;
