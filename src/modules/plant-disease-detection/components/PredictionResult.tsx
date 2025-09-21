'use client';

import React, { useState, useEffect } from 'react';
import type { AnalysisRecord } from '../types';
import { BugIcon, ShieldIcon } from './icons';
import PrintButton from './PrintButton';
import { FileText } from 'lucide-react';

/**
 * Interface pour les props du composant PredictionResult
 */
interface PredictionResultProps {
  result: AnalysisRecord;
  className?: string;
}

/**
 * Composant d'affichage des résultats de prédiction
 * Affiche les détails de l'analyse de maladie des plantes
 */
export function PredictionResult({ result, className = ''}: PredictionResultProps) {
  const [aiInstruction, setAiInstruction] = useState<string>('');
  const [isLoadingInstruction, setIsLoadingInstruction] = useState(true);

  // Génération de l'instruction par défaut dynamique
  useEffect(() => {
    const generateDefaultInstruction = () => {
      setIsLoadingInstruction(true);

      const confidenceLevel = result.confidenceScore > 0.8 ? "élevée" : result.confidenceScore > 0.6 ? "moyenne" : "faible";
      const isHealthy = result.diseaseName === "Sain" || result.diseaseName === "Healthy" || result.isHealthy;

      let instruction = '';

      if (isHealthy) {
        instruction = `L'analyse de ${result.plantName} indique une plante en bonne santé (confiance ${confidenceLevel}). Maintenez les bonnes pratiques de culture et surveillez régulièrement l'état de votre plante pour prévenir l'apparition de maladies.`;
      } else {
        instruction = `L'analyse de ${result.plantName} révèle ${result.diseaseName} avec une confiance ${confidenceLevel}. Il est recommandé d'appliquer les traitements appropriés et de surveiller l'évolution de la maladie.`;

        if (result.environmentalData?.location) {
          instruction += ` Tenez compte des conditions climatiques de ${result.environmentalData.location} dans vos actions.`;
        }
      }

      setAiInstruction(instruction);
      setIsLoadingInstruction(false);
    };

    generateDefaultInstruction();
  }, [result]);

  console.log('🎨 [DEBUG] PredictionResult - Composant rendu avec:', result);
  console.log('🎨 [DEBUG] PredictionResult - Props reçues:', { result, className});
  console.log('🎨 [DEBUG] PredictionResult - Données clés:', {
    diseaseName: result.diseaseName,
    plantName: result.plantName,
    confidenceScore: result.confidenceScore,
    isHealthy: result.isHealthy
  });

  /**
   * Obtient la couleur de confiance basée sur le score
   */
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  /**
   * Obtient la couleur de fond de confiance basée sur le score
   */
  const getConfidenceBgColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 border-green-200';
    if (confidence >= 0.6) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  /**
   * Obtient la couleur de sévérité
   */
  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'faible':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'moyen':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'élevé':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  /**
   * Génère le nom de fichier pour l'exportation PDF
   */
  const generatePDFFilename = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const plantName = result.plantName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    return `analyse-${plantName}-${timestamp}`;
  };

  /**
   * Contenu principal du composant (réutilisé pour l'affichage et l'impression)
   */
  const renderContent = () => {
    return (
      <div>
        {/* Aperçu de l'image analysée */}
        {result.imageUrl && (
          <div className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 p-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-gray-800 flex items-center">
                <div className="relative mr-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-sm opacity-30 animate-pulse"></div>
                  <div className="relative w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                </div>
                Image analysée
              </h4>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-emerald-500">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {new Date(result.timestamp).toLocaleDateString('fr-FR')}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <img
                  src={result.imageUrl}
                  alt="Image analysée"
                  className="relative max-w-xs max-h-48 object-contain rounded-xl shadow-lg border-2 border-white transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        )}

        <div className="p-8">
          {/* En-tête avec résultat principal */}
          <div className="flex items-center justify-between mb-10 p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 rounded-2xl border border-emerald-200 shadow-lg">
            <div className="flex items-center space-x-6">
              <div className={`relative p-4 rounded-2xl ${result.isHealthy ? 'bg-gradient-to-br from-green-100 to-emerald-100' : 'bg-gradient-to-br from-red-100 to-pink-100'} shadow-lg`}>
                <div className={`absolute inset-0 ${result.isHealthy ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-red-400 to-pink-400'} rounded-2xl blur-lg opacity-20 animate-pulse`}></div>
                {result.isHealthy ? (
                  <ShieldIcon className="relative w-10 h-10 text-green-600" />
                ) : (
                  <BugIcon className="relative w-10 h-10 text-red-600" />
                )}
              </div>
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                  {result.diseaseName || 'Analyse effectuée'}
                </h3>
                <div className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-emerald-500">
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-gray-700 font-semibold text-lg">
                    Culture: <span className="text-emerald-600 font-bold">{result.plantName}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className={`px-6 py-3 rounded-2xl text-sm font-bold border-2 shadow-lg backdrop-blur-sm ${getConfidenceBgColor(result.confidenceScore)}`}>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={getConfidenceColor(result.confidenceScore)}>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={getConfidenceColor(result.confidenceScore)}>
                  {Math.round(result.confidenceScore * 100)}% de confiance
                </span>
              </div>
            </div>
          </div>

          {/* Description de la maladie */}
          {result.description && (
            <div className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Description
              </h4>
              <p className="text-gray-700 leading-relaxed text-justify">
                {result.description}
              </p>
            </div>
          )}

          {/* Instruction pour agent conversationnel AI */}
          <div className="mb-8 p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              Instruction pour l'Agent AI
              <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">
                🤖 Agent IA
              </span>
            </h4>
            {isLoadingInstruction ? (
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-purple-200">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                <span className="text-gray-600 italic">Génération de l'instruction en cours...</span>
              </div>
            ) : (
              <div className="p-4 bg-white rounded-lg border border-purple-200 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                    🤖
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed text-justify font-medium">
                      {aiInstruction}
                    </p>
                    <div className="mt-3 pt-3 border-t border-purple-100">
                      <p className="text-xs text-purple-600 italic">
                        Cette instruction peut être utilisée pour configurer un agent conversationnel AI
                        afin d'assister l'utilisateur dans le suivi de cette analyse.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-sm ${className}`}>
      {/* Bouton d'exportation PDF avec PrintButton */}
      <div className="absolute top-4 right-4 z-10 no-print">
        <PrintButton
          documentName={generatePDFFilename()}
          buttonText="PDF"
          variant="default"
          size="default"
          scale={2}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
          onBeforePrint={() => {
            console.log('Préparation de l\'exportation PDF...');
          }}
          onAfterPrint={() => {
            console.log('Exportation PDF terminée avec succès');
          }}
          onError={(error) => {
            console.error('Erreur lors de l\'exportation PDF:', error);
          }}
        >
          <div className="bg-white p-8 max-w-4xl mx-auto print-content">
            {renderContent()}
          </div>
        </PrintButton>
      </div>

      {/* Contenu principal affiché */}
      <div className="p-8">
        {renderContent()}
      </div>
    </div>
  );
}