import React from 'react';
import type { AnalysisRecord } from '../types';

/**
 * Interface pour les props du composant PrintableAnalysisReport
 */
interface PrintableAnalysisReportProps {
  result: AnalysisRecord;
}

/**
 * Composant d'impression optimisé pour les rapports d'analyse
 * Conçu spécifiquement pour une mise en page PDF professionnelle
 */
const PrintableAnalysisReport: React.FC<PrintableAnalysisReportProps> = ({ result }) => {
  /**
   * Fonction pour formater la date en français
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Fonction pour obtenir le niveau de confiance en texte
   */
  const getConfidenceLevel = (confidence: number) => {
    const percent = confidence * 100;
    if (percent >= 80) return 'Élevée';
    if (percent >= 60) return 'Moyenne';
    return 'Faible';
  };

  /**
   * Fonction pour obtenir le statut de santé
   */
  const getHealthStatus = () => {
    return result.diseaseName === "Sain" || result.diseaseName === "Healthy" || result.isHealthy
      ? "Plante en bonne santé"
      : `Maladie détectée: ${result.diseaseName}`;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 font-sans text-gray-800 leading-relaxed">
      {/* En-tête du rapport */}
      <div className="border-b-2 border-gray-300 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Rapport d'Analyse Phytosanitaire
        </h1>
        <p className="text-center text-gray-600 text-lg">
          Détection automatisée des maladies des plantes
        </p>
        <div className="text-center mt-4 text-sm text-gray-500">
          Généré le {formatDate(result.timestamp)}
        </div>
      </div>

      {/* Informations générales */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Informations de l'analyse
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Plante analysée:</span>
              <span>{result.plantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date d'analyse:</span>
              <span>{formatDate(result.timestamp)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">ID d'analyse:</span>
              <span className="text-sm text-gray-600">{result.id}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Résultats de diagnostic
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Statut:</span>
              <span className={result.isHealthy ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {getHealthStatus()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Confiance:</span>
              <span>{(result.confidenceScore * 100).toFixed(1)}% ({getConfidenceLevel(result.confidenceScore)})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image analysée */}
      {result.imageUrl && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Image analysée
          </h2>
          <div className="flex justify-center">
            <img 
              src={result.imageUrl} 
              alt="Image analysée"
              className="max-w-md max-h-64 object-contain border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
        </div>
      )}

      {/* Détails de la maladie */}
      {!result.isHealthy && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Détails de la maladie
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Maladie identifiée:</span>
                <p className="text-red-700 font-semibold">{result.diseaseName}</p>
              </div>
              <div>
                <span className="font-medium">Niveau de confiance:</span>
                <p className="text-red-700">{(result.confidenceScore * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Données environnementales */}
      {result.environmentalData && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Conditions environnementales
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {result.environmentalData.temperature && (
              <div className="flex justify-between">
                <span className="font-medium">Température:</span>
                <span>{result.environmentalData.temperature}°C</span>
              </div>
            )}
            {result.environmentalData.humidity && (
              <div className="flex justify-between">
                <span className="font-medium">Humidité:</span>
                <span>{result.environmentalData.humidity}%</span>
              </div>
            )}
            {result.environmentalData.soilMoisture && (
              <div className="flex justify-between">
                <span className="font-medium">Humidité du sol:</span>
                <span>{result.environmentalData.soilMoisture}%</span>
              </div>
            )}
            {result.environmentalData.lightIntensity && (
              <div className="flex justify-between">
                <span className="font-medium">Intensité lumineuse:</span>
                <span>{result.environmentalData.lightIntensity} lux</span>
              </div>
            )}
            {result.environmentalData.location && (
              <div className="flex justify-between">
                <span className="font-medium">Localisation:</span>
                <span>{result.environmentalData.location}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Identification des parasites */}
      {result.pestIdentification && result.pestIdentification.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Parasites identifiés
          </h2>
          <div className="space-y-3">
            {result.pestIdentification.map((pest, index) => (
              <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Type:</span>
                    <p className="text-orange-700">{pest.name}</p>
                  </div>
                  <div>
                    <span className="font-medium">Sévérité:</span>
                    <p className="text-orange-700">{pest.severity}</p>
                  </div>
                </div>
                {pest.description && (
                  <div className="mt-2">
                    <span className="font-medium">Description:</span>
                    <p className="text-gray-700 text-sm">{pest.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Carences nutritionnelles */}
      {result.nutrientDeficiencies && result.nutrientDeficiencies.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Carences nutritionnelles
          </h2>
          <div className="space-y-3">
            {result.nutrientDeficiencies?.map((deficiency, index) => (
              <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="mb-3">
                  <h4 className="font-medium text-gray-800 mb-1">Nutriment</h4>
                  <p className="text-yellow-700 font-semibold">{deficiency.nutrient}</p>
                </div>
                <div className="mb-3">
                  <h4 className="font-medium text-gray-800 mb-1">Symptômes</h4>
                  <p className="text-gray-700 text-sm">{deficiency.symptoms}</p>
                </div>
                <div className="mb-3">
                  <h4 className="font-medium text-gray-800 mb-1">Correction recommandée</h4>
                  <p className="text-gray-700 text-sm">{deficiency.correction}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Délai d'amélioration</h4>
                  <p className="text-gray-700 text-sm">{deficiency.timeline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommandations de traitement */}
      {result.treatmentSuggestions && result.treatmentSuggestions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-green-500 pb-2">
            🌿 Recommandations de traitement
          </h2>
          <div className="space-y-4">
            {result.treatmentSuggestions.map((treatment, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-700">{treatment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pied de page */}
      <div className="border-t-2 border-gray-300 pt-6 mt-8 text-center text-sm text-gray-500">
        <p>Ce rapport a été généré automatiquement par le système d'analyse phytosanitaire.</p>
        <p className="mt-1">Pour toute question, consultez un expert en phytopathologie.</p>
        <div className="mt-4 text-xs">
          <p>© {new Date().getFullYear()} - Système de détection des maladies des plantes</p>
        </div>
      </div>
    </div>
  );
};

export default PrintableAnalysisReport;