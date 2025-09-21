'use client';

import React, { useState, useEffect } from 'react';
import type { AnalysisRecord } from '../types';
import { BugIcon, ShieldIcon } from './icons';
import { usePDFExport } from '../../../hooks/use-pdf-export';
import { Download, FileText, Loader2 } from 'lucide-react';
import '../../../styles/pdf-export.css';

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
  
  // Hook pour l'exportation PDF
  const { isExporting, exportToPDF, error: exportError } = usePDFExport();

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

  // Fonction pour gérer l'exportation PDF
  const handleExportPDF = async () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const plantName = result.plantName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const filename = `analyse-${plantName}-${timestamp}.pdf`;
    
    await exportToPDF('prediction-result-content', {
      filename,
      quality: 0.95,
      scale: 2
    });
  };

  console.log('🎨 [DEBUG] PredictionResult - Composant rendu avec:', result);
  console.log('🎨 [DEBUG] PredictionResult - Props reçues:', { result, className});
  console.log('🎨 [DEBUG] PredictionResult - Données clés:', {
    diseaseName: result.diseaseName,
    plantName: result.plantName,
    confidenceScore: result.confidenceScore,
    isHealthy: result.isHealthy
  });


  const getConfidenceColor = (confidence: number) => {
    const confident = confidence * 100; // Correction: conversion en pourcentage
    if (confident >= 80) return 'text-green-600';
    if (confident >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBgColor = (confidence: number) => {
    const confident = confidence * 100; // Correction: conversion en pourcentage
    if (confident >= 80) return 'bg-green-100 border-green-200';
    if (confident >= 60) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

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

  return (
    <div className={`relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-sm ${className}`}>
      {/* Bouton d'exportation PDF */}
      <div className="absolute top-4 right-4 z-10 pdf-export-button">
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed"
          title="Exporter en PDF"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {isExporting ? 'Export...' : 'PDF'}
          </span>
        </button>
        {exportError && (
          <div className="absolute top-full right-0 mt-2 p-2 bg-red-100 border border-red-200 text-red-700 text-xs rounded-lg shadow-lg max-w-xs">
            {exportError}
          </div>
        )}
      </div>

      {/* Contenu principal avec ID pour l'exportation */}
      <div id="prediction-result-content">
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
        {/* En-tête avec résultat principal - Amélioré visuellement */}
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

        {/* Description de la maladie - Améliorée visuellement */}
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

        {/* Identification des parasites */}
        {result.pestIdentification && result.pestIdentification.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              Parasites identifiés
              <span className="ml-2 text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full">
                {result.pestIdentification.length} parasite{result.pestIdentification.length > 1 ? 's' : ''}
              </span>
            </h4>
            <div className="space-y-4">
              {result.pestIdentification.map((pest, index) => (
                <div key={index} className="p-5 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-colors">
                  <div className="flex items-start space-x-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center text-lg shadow-md">
                      🐛
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-gray-800">{pest.name}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${pest.severity === 'high' ? 'bg-red-200 text-red-800' :
                            pest.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                              'bg-green-200 text-green-800'
                          }`}>
                          {pest.severity === 'high' ? 'Élevée' : pest.severity === 'medium' ? 'Moyenne' : 'Faible'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3 leading-relaxed">{pest.description}</p>
                      <div className="p-3 bg-white rounded-lg border border-red-200">
                        <h6 className="font-medium text-gray-800 mb-1">Traitement recommandé :</h6>
                        <p className="text-gray-700 text-sm">{pest.treatment}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Carences nutritionnelles */}
        {result.nutrientDeficiencies && result.nutrientDeficiencies.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
              Carences nutritionnelles
              <span className="ml-2 text-sm bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                {result.nutrientDeficiencies.length} carence{result.nutrientDeficiencies.length > 1 ? 's' : ''}
              </span>
            </h4>
            <div className="space-y-4">
              {result.nutrientDeficiencies.map((nutrient, index) => (
                <div key={index} className="p-5 bg-yellow-50 rounded-xl border border-yellow-100 hover:bg-yellow-100 transition-colors">
                  <div className="flex items-start space-x-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center text-lg shadow-md">
                      🌱
                    </span>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-800 mb-2">{nutrient.nutrient}</h5>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-white rounded-lg border border-yellow-200">
                          <h6 className="font-medium text-gray-800 mb-1">Symptômes observés :</h6>
                          <p className="text-gray-700 text-sm">{nutrient.symptoms}</p>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-yellow-200">
                          <h6 className="font-medium text-gray-800 mb-1">Correction recommandée :</h6>
                          <p className="text-gray-700 text-sm">{nutrient.correction}</p>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-yellow-200">
                          <h6 className="font-medium text-gray-800 mb-1">Délai de récupération :</h6>
                          <p className="text-gray-700 text-sm">{nutrient.timeline}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions immédiates - Utilise TreatmentRecommendation.immediate_actions */}
        {result.treatment?.immediate_actions && result.treatment.immediate_actions.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              Actions immédiates
              <span className="ml-2 text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full">
                {result.treatment.immediate_actions.length} action{result.treatment.immediate_actions.length > 1 ? 's' : ''}
              </span>
            </h4>
            <div className="space-y-3">
              {result.treatment.immediate_actions.map((action: string, index: number) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-colors">
                  <span className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 leading-relaxed pt-1">{action}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Options de traitement - Utilise TreatmentRecommendation.treatment_options */}
        {result.treatment?.treatment_options && Object.keys(result.treatment.treatment_options).length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Options de traitement
            </h4>
            <div className="space-y-4">
              {Object.entries(result.treatment.treatment_options).map(([category, treatments], categoryIndex) => (
                <div key={categoryIndex} className="bg-blue-50 rounded-xl border border-blue-100 p-4">
                  <h5 className="font-semibold text-blue-800 mb-3 capitalize">{category}</h5>
                  <div className="space-y-2">
                    {treatments.map((treatment: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <p className="text-gray-700 leading-relaxed">{treatment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions de traitement - Fallback pour compatibilité */}
        {!result.treatment?.immediate_actions && result.treatmentSuggestions && result.treatmentSuggestions.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Suggestions de traitement
              <span className="ml-2 text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                {result.treatmentSuggestions.length} suggestion{result.treatmentSuggestions.length > 1 ? 's' : ''}
              </span>
            </h4>
            <div className="space-y-3">
              {result.treatmentSuggestions.map((suggestion: string, index: number) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 leading-relaxed pt-1">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stratégie de prévention - Utilise TreatmentRecommendation.prevention_strategy */}
        {result.treatment?.prevention_strategy && result.treatment.prevention_strategy.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Stratégie de prévention
              <span className="ml-2 text-sm bg-green-100 text-green-600 px-2 py-1 rounded-full">
                {result.treatment.prevention_strategy.length} stratégie{result.treatment.prevention_strategy.length > 1 ? 's' : ''}
              </span>
            </h4>
            <div className="space-y-3">
              {result.treatment.prevention_strategy.map((strategy: string, index: number) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed pt-1">{strategy}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conseils de soins préventifs - Fallback pour compatibilité */}
        {/* {!result.treatment?.prevention_strategy && result.preventativeCareTips && result.preventativeCareTips.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Conseils de soins préventifs
              <span className="ml-2 text-sm bg-green-100 text-green-600 px-2 py-1 rounded-full">
                {result.preventativeCareTips.length} conseil{result.preventativeCareTips.length > 1 ? 's' : ''}
              </span>
            </h4>
            <div className="space-y-3">
              {result.preventativeCareTips.map((tip: string, index: number) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed pt-1">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Niveau de sévérité - Amélioré visuellement */}
        {result.severity && (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 mb-8">
            <span className="text-gray-700 font-semibold flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
              Niveau de sévérité:
            </span>
            <span className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 ${getSeverityColor(result.severity)}`}>
              {result.severity}
            </span>
          </div>
        )}

        {/* Évaluation du progrès et analyse comparative - Améliorée visuellement */}
        {/* {(result.progressAssessment || result.comparativeAnalysis) && (
          <div className="mb-8 p-5 bg-purple-50 rounded-xl border border-purple-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              Analyse comparative
            </h4>
            {result.progressAssessment && result.progressAssessment !== 'N/A' && (
              <div className="mb-4 p-3 bg-white rounded-lg border border-purple-200">
                <span className="text-gray-700 font-semibold">Évolution: </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ml-2 ${
                  result.progressAssessment === 'Amélioré' ? 'bg-green-100 text-green-800 border border-green-200' :
                  result.progressAssessment === 'Dégradé' ? 'bg-red-100 text-red-800 border border-red-200' :
                  'bg-gray-100 text-gray-800 border border-gray-200'
                }`}>
                  {result.progressAssessment}
                </span>
              </div>
            )}
            {result.comparativeAnalysis && result.comparativeAnalysis !== 'N/A' && (
              <p className="text-gray-700 leading-relaxed text-justify">{result.comparativeAnalysis}</p>
            )}
          </div>
        )} */}

        {/* Suivi et surveillance - Utilise TreatmentRecommendation.monitoring_followup */}
        {result.treatment?.monitoring_followup && result.treatment.monitoring_followup.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              Suivi et surveillance
              <span className="ml-2 text-sm bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                {result.treatment.monitoring_followup.length} point{result.treatment.monitoring_followup.length > 1 ? 's' : ''}
              </span>
            </h4>
            <div className="space-y-3">
              {result.treatment.monitoring_followup.map((followup: string, index: number) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 transition-colors">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg shadow-md">
                    📊
                  </span>
                  <p className="text-gray-700 leading-relaxed pt-1">{followup}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Délai prévu - Utilise TreatmentRecommendation.expected_timeline */}
        {result.treatment?.expected_timeline && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
              Délai prévu
            </h4>
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="flex items-center space-x-3">
                <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-lg shadow-md">
                  ⏱️
                </span>
                <p className="text-gray-700 leading-relaxed">{result.treatment.expected_timeline}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recommandations générales - Fallback pour compatibilité */}
        {!result.treatment?.monitoring_followup && result.recommendations && result.recommendations.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
              Recommandations générales
            </h4>
            <div className="space-y-3">
              {result.recommendations.map((recommendation: string, index: number) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors">
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-lg shadow-md">
                    💡
                  </span>
                  <p className="text-gray-700 leading-relaxed pt-1">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mesures préventives - Améliorées visuellement */}
        {result.preventiveMeasures && result.preventiveMeasures.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Mesures préventives
            </h4>
            <div className="space-y-3">
              {result.preventiveMeasures.map((measure: string, index: number) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md">
                    <ShieldIcon className="w-4 h-4" />
                  </div>
                  <p className="text-gray-700 leading-relaxed pt-1">{measure}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Données environnementales - Améliorées visuellement */}
        {result.environmentalData && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
              Conditions environnementales
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-teal-50 rounded-xl border border-teal-200">
              {result.environmentalData.temperature && (
                <div className="bg-white p-3 rounded-lg border border-teal-200">
                  <span className="text-sm font-semibold text-teal-800 block">🌡️ Température:</span>
                  <span className="text-teal-700 font-bold text-lg">{result.environmentalData.temperature}°C</span>
                </div>
              )}
              {result.environmentalData.humidity && (
                <div className="bg-white p-3 rounded-lg border border-teal-200">
                  <span className="text-sm font-semibold text-teal-800 block">💧 Humidité:</span>
                  <span className="text-teal-700 font-bold text-lg">{result.environmentalData.humidity}%</span>
                </div>
              )}
              {result.environmentalData.soilMoisture && (
                <div className="bg-white p-3 rounded-lg border border-teal-200">
                  <span className="text-sm font-semibold text-teal-800 block">🌱 Humidité du sol:</span>
                  <span className="text-teal-700 font-bold text-lg">{result.environmentalData.soilMoisture}%</span>
                </div>
              )}
              {result.environmentalData.phLevel && (
                <div className="bg-white p-3 rounded-lg border border-teal-200">
                  <span className="text-sm font-semibold text-teal-800 block">⚗️ pH du sol:</span>
                  <span className="text-teal-700 font-bold text-lg">{result.environmentalData.phLevel}</span>
                </div>
              )}
              {result.environmentalData.location && (
                <div className="col-span-1 md:col-span-2 bg-white p-3 rounded-lg border border-teal-200">
                  <span className="text-sm font-semibold text-teal-800 block">📍 Localisation:</span>
                  <span className="text-teal-700 font-medium">{result.environmentalData.location}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Métadonnées - Améliorées visuellement */}
        <div className="mt-6 pt-6 border-t-2 border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 text-sm">
            <div className="flex items-center text-gray-600">
              <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
              <span className="font-medium">Analysé le:</span>
              <span className="ml-2 bg-gray-100 px-2 py-1 rounded font-semibold">
                {new Date(result.timestamp).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="font-medium">Service:</span>
              <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">
                {result.service}
              </span>
            </div>
          </div>
        </div>



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
      </div> {/* Fermeture de prediction-result-content */}
    </div>
  );
}