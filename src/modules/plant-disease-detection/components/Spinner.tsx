'use client';

import React from 'react';

/**
 * Interface pour les props du composant Spinner
 */
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

/**
 * Composant de spinner/loader animé
 * Utilisé pour indiquer les états de chargement
 */
export function Spinner({ 
  size = 'md', 
  color = 'primary', 
  className = '' 
}: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-3 h-3 sm:w-4 sm:h-4',
    md: 'w-5 h-5 sm:w-6 sm:h-6',
    lg: 'w-6 h-6 sm:w-8 sm:h-8'
  };

  const colorClasses = {
    primary: 'text-green-600',
    secondary: 'text-gray-600',
    white: 'text-white'
  };

  return (
    <div className={`inline-block ${className}`}>
      <svg
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

/**
 * Composant de spinner avec texte de chargement
 */
interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ 
  message = "Chargement...", 
  size = 'md',
  className = ''
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center space-y-2 sm:space-y-3 ${className}`}>
      <Spinner size={size} />
      <p className="text-gray-600 text-xs sm:text-sm text-center px-2">{message}</p>
    </div>
  );
}