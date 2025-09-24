'use client';

import React from 'react';
import { LeafIcon } from './icons';

/**
 * Interface pour les props du composant Header
 */
interface HeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * Composant d'en-tête pour le module de détection de maladies des plantes
 * Affiche le titre principal et une description
 */
export function Header({ 
  title = "Détection de Maladies des Plantes",
  subtitle = "Analysez vos plantes pour détecter les maladies et obtenir des recommandations de traitement",
  className = ''
}: HeaderProps) {
  return (
    <header className={`text-center py-6 sm:py-8 lg:py-12 ${className}`}>
      <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
          <LeafIcon className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-green-600 sm:mr-4 drop-shadow-lg" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h1>
      </div>
      
      <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
        {subtitle}
      </p>
      
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-8 text-xs sm:text-sm px-4">
        <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg border border-white/30 w-full sm:w-auto max-w-xs sm:max-w-none">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full mr-2 sm:mr-3 animate-pulse flex-shrink-0"></div>
          <span className="font-medium text-gray-700">Analyse rapide</span>
        </div>
        <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg border border-white/30 w-full sm:w-auto max-w-xs sm:max-w-none">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mr-2 sm:mr-3 animate-pulse flex-shrink-0"></div>
          <span className="font-medium text-gray-700">IA avancée</span>
        </div>
        <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg border border-white/30 w-full sm:w-auto max-w-xs sm:max-w-none">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mr-2 sm:mr-3 animate-pulse flex-shrink-0"></div>
          <span className="font-medium text-gray-700">Recommandations personnalisées</span>
        </div>
      </div>
    </header>
  );
}