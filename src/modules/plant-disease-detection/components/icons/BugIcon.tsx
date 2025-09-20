import React from 'react';

export const BugIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M12 20h-4a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4" />
    <path d="m18 16 4-4" />
    <path d="m18 12 4 4" />
    <path d="M12 15a3 3 0 0 1-6 0" />
    <path d="M20 8h-4" />
    <path d="M4 8h4" />
    <path d="M12 4V2" />
    <path d="m4.929 4.929-.707.707" />
    <path d="m19.071 4.929.707.707" />
  </svg>
);