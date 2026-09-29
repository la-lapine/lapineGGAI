import React from 'react';

interface LalapineLogoProps {
  className?: string;
  size?: number;
}

export const LalapineLogo: React.FC<LalapineLogoProps> = ({
  className = 'w-9 h-9',
  size,
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients matching lalapine-rabbit design */}
        <linearGradient id="earGradientLeft" x1="28" y1="5" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="earGradientRight" x1="72" y1="5" x2="62" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="moonGradient" x1="20" y1="40" x2="65" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="60%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <filter id="moonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#38bdf8" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Main Group with delicate filter */}
      <g filter="url(#moonGlow)">
        {/* Dark Navy Inner Center Circle */}
        <circle cx="52" cy="62" r="23" fill="#071b3d" stroke="#051229" strokeWidth="2.5" />

        {/* Central Sparkling Diamond Stars inside Dark Navy Crescent concave */}
        {/* Main 4-point Diamond Star */}
        <path
          d="M54 53 Q54 62 45 62 Q54 62 54 71 Q54 62 63 62 Q54 62 54 53 Z"
          fill="#ffffff"
        />
        {/* Small Top-Left Diamond Star */}
        <path
          d="M48 55 Q48 57.5 45.5 57.5 Q48 57.5 48 60 Q48 57.5 50.5 57.5 Q48 57.5 48 55 Z"
          fill="#bae6fd"
          opacity="0.9"
        />
        {/* Small Bottom-Right Diamond Star */}
        <path
          d="M58 66 Q58 68 56 68 Q58 68 58 70 Q58 68 60 68 Q58 68 58 66 Z"
          fill="#bae6fd"
          opacity="0.9"
        />

        {/* Crescent Moon Arc Body */}
        <path
          d="M50 40 
             C 42 41, 33 46, 28 54 
             C 21 64, 23 77, 33 85 
             C 42 92, 56 93, 67 87 
             C 72 84, 76 79, 77 75
             C 74 77, 69 77, 66 75
             C 53 79, 41 73, 37 62
             C 33 52, 40 43, 50 40 Z"
          fill="url(#moonGradient)"
          stroke="#051229"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />

        {/* Left Bunny Ear */}
        <path
          d="M34 44 
             C 30 36, 23 20, 24 10 
             C 24 5, 29 4, 34 8 
             C 40 14, 45 30, 44 42 
             Z"
          fill="url(#earGradientLeft)"
          stroke="#051229"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        {/* Left Ear Inner Shadow/Lobe */}
        <path
          d="M33 39 
             C 30 32, 26 21, 27 13 
             C 27 10, 30 9, 33 12 
             C 37 17, 40 28, 40 37 
             Z"
          fill="#0c2552"
          opacity="0.85"
        />

        {/* Right Bunny Ear */}
        <path
          d="M57 42 
             C 56 30, 61 14, 67 8 
             C 72 4, 77 5, 77 10 
             C 78 20, 71 36, 67 44 
             Z"
          fill="url(#earGradientRight)"
          stroke="#051229"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        {/* Right Ear Inner Shadow/Lobe */}
        <path
          d="M61 37 
             C 61 28, 64 17, 68 12 
             C 71 9, 74 10, 74 13 
             C 75 21, 71 32, 68 39 
             Z"
          fill="#0c2552"
          opacity="0.85"
        />
      </g>
    </svg>
  );
};
