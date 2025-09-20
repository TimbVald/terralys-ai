import React from 'react';

export const NutrientIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M8 3.1c.9-.5 2.1-.5 3 0l5.4 3c.8.5 1.3 1.5 1.3 2.5v6c0 1-.5 2-1.3 2.5L11 20.9c-.9.5-2.1.5-3 0L2.6 18c-.8-.5-1.3-1.5-1.3-2.5v-6c0-1 .5-2 1.3-2.5L8 3.1z" />
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
  </svg>
);