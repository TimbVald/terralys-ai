'use client';

import React, { useState, useEffect } from 'react';
import type { AnalysisRecord } from '../types';
import { PredictionResult } from './PredictionResult';
import { HistoryIcon } from './icons';
import {TrashIcon, SearchIcon, CalendarIcon} from 'lucide-react'

/**
 * Interface pour les props du composant AnalysisHistory
 */
interface AnalysisHistoryProps {
  className?: string;
}

/**
 * Composant d'historique des analyses de plantes
 * Affiche et gère l'historique des analyses effectuées
 */
export function AnalysisHistory({ className = '' }: AnalysisHistoryProps) {
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisRecord[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<AnalysisRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisRecord | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'plant' | 'health'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'healthy' | 'diseased'>('all');

  /**
   * Charge l'historique des analyses depuis le localStorage
   */
  useEffect(() => {
    const loadHistory = () => {
      try {
        const savedHistory = localStorage.getItem('plant-analysis-history');
        if (savedHistory) {
          const history = JSON.parse(savedHistory) as AnalysisRecord[];
          setAnalysisHistory(history);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
      }
    };

    loadHistory();
    
    // Écouter les changements dans le localStorage
    const handleStorageChange = () => {
      loadHistory();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Filtre et trie l'historique selon les critères sélectionnés
   */
  useEffect(() => {
    let filtered = [...analysisHistory];

    // Filtrage par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(analysis =>
        analysis.plantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (analysis.diseaseName && analysis.diseaseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        analysis.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par état de santé
    if (filterBy !== 'all') {
      filtered = filtered.filter(analysis =>
        filterBy === 'healthy' ? analysis.isHealthy : !analysis.isHealthy
      );
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'plant':
          return a.plantName.localeCompare(b.plantName);
        case 'health':
          return Number(b.isHealthy) - Number(a.isHealthy);
        default:
          return 0;
      }
    });

    setFilteredHistory(filtered);
  }, [analysisHistory, searchTerm, sortBy, filterBy]);

  /**
   * Supprime une analyse de l'historique
   */
  const handleDeleteAnalysis = (analysisId: string) => {
    const updatedHistory = analysisHistory.filter(analysis => analysis.id !== analysisId);
    setAnalysisHistory(updatedHistory);
    localStorage.setItem('plant-analysis-history', JSON.stringify(updatedHistory));
    
    if (selectedAnalysis?.id === analysisId) {
      setSelectedAnalysis(null);
    }
  };

  /**
   * Vide complètement l'historique
   */
  const handleClearHistory = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer tout l\'historique ?')) {
      setAnalysisHistory([]);
      setSelectedAnalysis(null);
      localStorage.removeItem('plant-analysis-history');
    }
  };

  /**
   * Formate la date pour l'affichage
   */
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 transition-all duration-300 hover:shadow-2xl ${className}`}>
      {/* En-tête avec design moderne */}
      <div className="p-6 lg:p-8 border-b border-gray-200/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl mr-4">
              <HistoryIcon className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Historique des Analyses
              </h2>
              <p className="text-gray-600 text-sm mt-1">Consultez et gérez vos analyses précédentes</p>
            </div>
            <span className="ml-4 px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-sm font-semibold rounded-full border border-indigo-200">
              {analysisHistory.length}
            </span>
          </div>
          {analysisHistory.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center px-4 py-2.5 text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Vider l'historique</span>
              <span className="sm:hidden">Vider</span>
            </button>
          )}
        </div>

        {/* Contrôles de recherche et filtrage avec design amélioré */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Barre de recherche */}
          <div className="relative group">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-gray-300"
            />
          </div>

          {/* Filtre par état */}
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as 'all' | 'healthy' | 'diseased')}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-gray-300 cursor-pointer"
          >
            <option value="all">Toutes les analyses</option>
            <option value="healthy">Plantes saines</option>
            <option value="diseased">Plantes malades</option>
          </select>

          {/* Tri */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'plant' | 'health')}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-gray-300 cursor-pointer"
          >
            <option value="date">Trier par date</option>
            <option value="plant">Trier par plante</option>
            <option value="health">Trier par état</option>
          </select>

          {/* Statistiques rapides */}
          <div className="flex items-center justify-center lg:justify-start px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <span className="text-sm font-medium text-gray-700">
              {filteredHistory.length} résultat{filteredHistory.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Liste des analyses avec design moderne */}
        <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-200/50 max-h-96 lg:max-h-[600px] overflow-y-auto">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <HistoryIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {searchTerm || filterBy !== 'all' 
                  ? 'Aucune analyse trouvée' 
                  : 'Aucune analyse effectuée'
                }
              </h3>
              <p className="text-gray-500 text-sm">
                {searchTerm || filterBy !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche' 
                  : 'Commencez par analyser une plante'
                }
              </p>
            </div>
          ) : (
            <div className="p-4 lg:p-6 space-y-3">
              {filteredHistory.map((analysis) => (
                <div
                  key={analysis.id}
                  onClick={() => setSelectedAnalysis(analysis)}
                  className={`group p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 hover:shadow-lg ${
                    selectedAnalysis?.id === analysis.id
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-md'
                      : 'bg-white/80 hover:bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate text-base group-hover:text-indigo-700 transition-colors">
                        {analysis.plantName}
                      </h3>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        <span>{formatDate(analysis.timestamp)}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAnalysis(analysis.id);
                      }}
                      className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      analysis.isHealthy 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {analysis.isHealthy ? '✓ Saine' : '⚠ Problème détecté'}
                    </span>
                  </div>
                  
                  {!analysis.isHealthy && analysis.diseaseName && (
                    <p className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded-lg truncate">
                      {analysis.diseaseName}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Détails de l'analyse sélectionnée avec design moderne */}
        <div className="flex-1 p-6 lg:p-8">
          {selectedAnalysis ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-indigo-800">
                      Détails de l'analyse
                    </h3>
                    <p className="text-sm text-indigo-600">
                      Analysée le {formatDate(selectedAnalysis.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
              
              <PredictionResult
                result={selectedAnalysis}
                className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              />
            </div>
          ) : (
            <div className="text-center py-16 lg:py-24">
              <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl w-24 h-24 mx-auto mb-8 flex items-center justify-center">
                <HistoryIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                Sélectionnez une analyse
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Choisissez une analyse dans la liste pour voir ses détails complets et les recommandations associées
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}