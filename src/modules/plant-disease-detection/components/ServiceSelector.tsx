'use client';

import React from 'react';

/**
 * Interface pour les props du composant ServiceSelector
 */
interface ServiceSelectorProps {
  selectedService: 'local' | 'backend' | 'gemini';
  onServiceChange: (service: 'local' | 'backend' | 'gemini') => void;
  className?: string;
}

/**
 * Composant de sélection de service d'analyse
 * Permet à l'utilisateur de choisir entre analyse locale, backend ou Gemini
 */
export function ServiceSelector({ 
  selectedService, 
  onServiceChange, 
  className = '' 
}: ServiceSelectorProps) {
  const services = [
    {
      id: 'local' as const,
      name: 'Analyse Locale',
      description: 'Traitement rapide sur votre appareil',
      icon: '🔧'
    },
    {
      id: 'backend' as const,
      name: 'Serveur Backend',
      description: 'Analyse avancée via notre serveur',
      icon: '🌐'
    },
    {
      id: 'gemini' as const,
      name: 'Gemini AI',
      description: 'Intelligence artificielle avancée',
      icon: '🤖'
    }
  ];

  return (
    <div className={`space-y-3 sm:space-y-4 ${className}`}>
      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800">
        Service d'analyse
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {services.map((service: { id: 'local' | 'backend' | 'gemini'; name: string; description: string; icon: string }) => (
          <button
            key={service.id}
            onClick={() => onServiceChange(service.id)}
            className={`
              p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl border-2 transition-all duration-200 text-left
              ${selectedService === service.id
                ? 'border-green-500 bg-green-50 text-green-800 shadow-md'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
              }
            `}
          >
            <div className="text-xl sm:text-2xl lg:text-3xl mb-2 sm:mb-3">{service.icon}</div>
            <div className="font-medium text-sm sm:text-base lg:text-lg">{service.name}</div>
            <div className="text-xs sm:text-sm lg:text-base opacity-75 mt-1">{service.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}