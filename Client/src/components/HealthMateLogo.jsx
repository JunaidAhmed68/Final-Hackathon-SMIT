// components/HealthMateLogo.jsx
import React from 'react';

const HealthMateLogo = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 64 64" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="64" height="64" rx="12" fill="url(#gradient)"/>
    <path d="M24 32C24 28 28 24 32 24C36 24 40 28 40 32C40 36 36 40 32 40C28 40 24 36 24 32Z" fill="white"/>
    <path d="M44 28L48 32L44 36" stroke="white" stroke-width="2"/>
    <path d="M20 28L16 32L20 36" stroke="white" stroke-width="2"/>
    <path d="M32 20L32 44" stroke="white" stroke-width="2"/>
    <defs>
      <linearGradient id="gradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563eb"/>
        <stop offset="1" stopColor="#7c3aed"/>
      </linearGradient>
    </defs>
  </svg>
);

export default HealthMateLogo;