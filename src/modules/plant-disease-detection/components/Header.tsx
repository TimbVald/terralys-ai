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
    <header className={`text-center py-12 ${className}`}>
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
          <LeafIcon className="relative w-16 h-16 text-green-600 mr-4 drop-shadow-lg" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h1>
      </div>
      
      <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
        {subtitle}
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
        <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/30">
          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full mr-3 animate-pulse"></div>
          <span className="font-medium text-gray-700">Analyse rapide</span>
        </div>
        <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/30">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mr-3 animate-pulse"></div>
          <span className="font-medium text-gray-700">IA avancée</span>
        </div>
        <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/30">
          <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mr-3 animate-pulse"></div>
          <span className="font-medium text-gray-700">Recommandations personnalisées</span>
        </div>
      </div>
    </header>
  );
}