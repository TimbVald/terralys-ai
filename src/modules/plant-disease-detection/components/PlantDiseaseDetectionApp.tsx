'use client';

import React, { useState, useCallback } from 'react';
import { Header } from './Header';
import { ImageUploader } from './ImageUploader';
import { PredictionResult } from './PredictionResult';
import { EnvironmentalForm } from './EnvironmentalForm';
import { AnalysisHistory } from './AnalysisHistory';
import { LoadingSpinner } from './Spinner';
import type { AnalysisRecord, EnvironmentalData, PredictionData } from '../types';
import { analyzeImage } from '../services/analysisService';

/**
 * Interface pour les props du composant principal
 */
interface PlantDiseaseDetectionAppProps {
  className?: string;
}

/**
 * Composant principal de l'application de détection de maladies des plantes
 * Orchestre tous les sous-composants et gère l'état global de l'application
 */
export function PlantDiseaseDetectionApp({ className = '' }: PlantDiseaseDetectionAppProps) {
  const [currentResult, setCurrentResult] = useState<AnalysisRecord | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<string>('');
  const [streamingText, setStreamingText] = useState<string>('');
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [activeTab, setActiveTab] = useState<'analyze' | 'profiles'>('analyze');
  const [currentView, setCurrentView] = useState<'upload' | 'analyzing' | 'result'>('upload');

  /**
   * Gère l'analyse d'une image avec une approche simplifiée similaire au test
   */
  const handleImageAnalysis = useCallback(async (file: File) => {
    console.log('🚀 [DEBUG] Début de l\'analyse pour:', file.name);
    
    setIsAnalyzing(true);
    setCurrentView('analyzing');
    setAnalysisProgress('Préparation de l\'analyse...');
    setCurrentResult(null);
    setStreamingText('');

    try {
      // Générateur asynchrone pour les mises à jour de progression
      const analysisGenerator = analyzeImage(
        file,
        environmentalData || undefined,
        undefined // previousAnalysis
      );

      let fullResponse = "";
      let resultProcessed = false;
      
      for await (const update of analysisGenerator) {
        if (typeof update === 'string') {
          // Mise à jour de progression
          fullResponse += update;
          setStreamingText(prev => prev + update);
          setAnalysisProgress('Analyse en cours...');
        } else {
          // Résultat final - AnalysisRecord complet reçu directement
          console.log('📊 [DEBUG] AnalysisRecord final reçu:', update);
          
          const analysisRecord = update as AnalysisRecord;
          
          console.log('✅ [DEBUG] AnalysisRecord avec données complètes:', analysisRecord);
          
          // Sauvegarder l'analyse dans l'historique
          try {
            const existingHistory = localStorage.getItem('plant-analysis-history');
            const history = existingHistory ? JSON.parse(existingHistory) : [];
            history.unshift(analysisRecord); // Ajouter au début de la liste
            
            // Limiter l'historique à 100 analyses pour éviter de surcharger le localStorage
            if (history.length > 100) {
              history.splice(100);
            }
            
            localStorage.setItem('plant-analysis-history', JSON.stringify(history));
            console.log('💾 [DEBUG] Analyse sauvegardée dans l\'historique');
          } catch (error) {
            console.error('❌ [ERROR] Erreur lors de la sauvegarde:', error);
          }
          
          setCurrentResult(analysisRecord);
          setCurrentView('result');
          setAnalysisProgress('');
          resultProcessed = true;
        }
      }
      
      // Si on arrive ici sans résultat final, parser le streaming text
      if (!resultProcessed && fullResponse) {
        try {
          const parsedData = JSON.parse(fullResponse) as PredictionData;
          console.log('🔄 [DEBUG] Parsing du streaming text:', parsedData);
          
          const analysisRecord: AnalysisRecord = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            imageUrl: URL.createObjectURL(file),
            plantName: parsedData.crop || 'Plante inconnue',
            isHealthy: parsedData.disease === 'Sain' || parsedData.disease === 'Healthy',
            diseaseName: parsedData.disease !== 'Sain' && parsedData.disease !== 'Healthy' ? parsedData.disease : 'Plante saine',
            confidenceScore: Math.round(parsedData.confidence || 0),
            description: parsedData.description || 'Analyse effectuée avec succès',
            treatmentSuggestions: parsedData.treatment ? [parsedData.treatment] : ['Aucun traitement spécifique requis'],
            benefits: ['Diagnostic effectué', 'Informations disponibles'],
            preventativeCareTips: parsedData.prevention ? [parsedData.prevention] : ['Maintenir un arrosage régulier'],
            environmentalData: environmentalData || undefined,
            notes: '',
            severity: parsedData.severity || 'medium',
            service: 'backend',
            preventiveMeasures: parsedData.environmentalFactors || ['Surveillance régulière'],
            recommendations: parsedData.recommendedActions || ['Continuer la surveillance']
          };
          
          setCurrentResult(analysisRecord);
          setCurrentView('result');
        } catch (parseError) {
          console.error('❌ [DEBUG] Erreur de parsing:', parseError);
          throw new Error('Impossible de parser la réponse de l\'analyse');
        }
      }
      
    } catch (error) {
      console.error('❌ [DEBUG] Erreur lors de l\'analyse:', error);
      setCurrentView('result');
      setAnalysisProgress('');
      
      // Créer un résultat d'erreur
      setCurrentResult({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        imageUrl: URL.createObjectURL(file),
        plantName: 'Erreur',
        isHealthy: false,
        diseaseName: 'Échec de l\'analyse',
        confidenceScore: 0,
        description: error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite',
        treatmentSuggestions: ['Veuillez réessayer avec une autre image'],
        benefits: [],
        preventativeCareTips: [],
        recommendations: ['Veuillez réessayer avec une autre image'],
        preventiveMeasures: [],
        severity: 'low',
        service: 'backend'
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [environmentalData]);

  /**
   * Gère la mise à jour des données environnementales
   */
  const handleEnvironmentalDataChange = useCallback((data: EnvironmentalData) => {
    setEnvironmentalData(data);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 ${className}`}>
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <Header />

        {/* Navigation par onglets avec design amélioré */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-1.5 flex">
            <button
              onClick={() => setActiveTab('analyze')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'analyze'
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Analyser
            </button>
            <button
              onClick={() => setActiveTab('profiles')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'profiles'
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Mes Plantes
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        {activeTab === 'analyze' ? (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Formulaire environnemental avec design amélioré */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Données Environnementales</h2>
              </div>
              <EnvironmentalForm
                onDataChange={handleEnvironmentalDataChange}
              />
            </div>

            {/* Uploader d'image avec design amélioré */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Analyse d'Image</h2>
              </div>
              <ImageUploader
                onImageSelect={handleImageAnalysis}
                disabled={isAnalyzing}
                className=""
              />
            </div>

            {/* Indicateur de progression avec design amélioré */}
            {isAnalyzing && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-xl border border-blue-200 p-8 animate-pulse">
                <LoadingSpinner
                  message={analysisProgress || 'Analyse en cours...'}
                  size="lg"
                />
              </div>
            )}

            {/* Résultats avec design amélioré */}
            {(() => {
              console.log('🎯 [DEBUG] Vérification affichage résultats:', {
                currentResult: !!currentResult,
                isAnalyzing,
                shouldDisplay: currentResult && !isAnalyzing
              });
              
              if (currentResult && !isAnalyzing) {
                console.log('✅ [DEBUG] RÉSULTAT AFFICHÉ - Composant PredictionResult rendu');
                return (
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 transition-all duration-300 hover:shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">Résultats de l'Analyse</h2>
                    </div>
                    <PredictionResult
                      result={currentResult}
                      className=""
                    />
                  </div>
                );
              } else {
                return null;
              }
            })()}

            {/* Service backend avec design amélioré */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h3 className="font-semibold text-blue-800 text-lg">
                  Service d'analyse: Serveur Backend
                </h3>
              </div>
              <p className="text-blue-700">
                Analyse avancée via notre serveur haute performance. Nécessite une connexion internet pour des résultats optimaux.
              </p>
            </div>
          </div>
        ) : (
          /* Onglet Historique des analyses avec design amélioré */
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Historique des Analyses</h2>
                  <p className="text-gray-600 mt-1">Consultez vos analyses précédentes et suivez l'évolution de vos plantes</p>
                </div>
              </div>
              <AnalysisHistory />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}