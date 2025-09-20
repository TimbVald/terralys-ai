/**
 * Service principal d'analyse des maladies des plantes
 * Utilise uniquement l'API backend analyze
 */

import type { PredictionData, AnalysisRecord, EnvironmentalData, AnalysisResponse } from '../types';

/**
 * Analyse une image de plante en utilisant l'API backend analyze
 * @param imageFile Le fichier image à analyser
 * @param environmentalData Données environnementales optionnelles
 * @param previousAnalysis Analyse précédente pour comparaison (non utilisé)
 * @returns Générateur asynchrone pour les mises à jour de statut
 */
export async function* analyzeImage(
    imageFile: File,
    environmentalData?: EnvironmentalData,
    previousAnalysis?: AnalysisRecord
): AsyncGenerator<string | PredictionData, PredictionData, unknown> {
    yield "Initialisation de l'analyse...";
    
    try {
        yield "Connexion à l'API d'analyse...";
        
        // Vérifier la santé de l'API
        const healthResponse = await fetch('/api/analyze');
        if (!healthResponse.ok) {
            throw new Error('API d\'analyse non disponible');
        }
        
        yield "Traitement de l'image...";
        
        // Préparer les données pour l'upload
        const formData = new FormData();
        formData.append('file', imageFile);
        
        // Ajouter les données d'environnement si disponibles
        if (environmentalData) {
            formData.append('environmentalData', JSON.stringify(environmentalData));
            console.log('🌍 [DEBUG] Données environnementales envoyées:', environmentalData);
        }
        
        // Appeler l'API d'analyse
        const analysisResponse = await fetch('/api/analyze', {
            method: 'POST',
            body: formData,
        });
        
        if (!analysisResponse.ok) {
            throw new Error('Échec de l\'analyse de l\'image');
        }
        
        const analysisResult: AnalysisResponse = await analysisResponse.json();
        console.log('🔍 [DEBUG] Réponse complète de l\'API:', analysisResult);
        
        if (!analysisResult.success) {
            throw new Error(analysisResult.error_message || 'Échec de l\'analyse');
        }
        
        if (!analysisResult.classification) {
            throw new Error('Données de classification manquantes dans la réponse');
        }
        
        yield "Formatage des résultats...";
        
        // Extraire les données de l'API avec vérification de type
        const classificationResult = analysisResult.classification;
        const treatmentData = analysisResult.treatment;
        console.log('📊 [DEBUG] Classification:', classificationResult);
        console.log('💊 [DEBUG] Treatment:', treatmentData);
        
        // Convertir le résultat au format attendu
        const result: PredictionData = {
            confidence: classificationResult.confidence,
            disease: classificationResult.disease,
            crop: classificationResult.crop,
            description: classificationResult.disease_info || "Analyse effectuée avec succès.",
            treatment: treatmentData?.immediate_actions?.join('. ') || "Consultez un expert pour des recommandations spécifiques.",
            prevention: treatmentData?.prevention_strategy?.join('. ') || "Maintenez de bonnes pratiques culturales.",
            severity: classificationResult.confidence > 0.8 ? "high" : 
                     classificationResult.confidence > 0.5 ? "medium" : "low" as const,
            environmentalFactors: environmentalData ? [
                `Température: ${environmentalData.temperature}°C`,
                `Humidité: ${environmentalData.humidity}%`
            ] : [],
            recommendedActions: treatmentData?.treatment_options ? 
                Object.values(treatmentData.treatment_options).flat() : [
                "Surveiller régulièrement l'évolution"
            ]
        };
        
        console.log('🚀 [DEBUG] AnalysisService - Résultat créé:', result);
        yield "Analyse terminée avec succès !";
        console.log('📤 [DEBUG] AnalysisService - Retour du résultat final');
        yield result;
        return result;
        
    } catch (error) {
        console.error('❌ [ERROR] Erreur lors de l\'analyse:', error);
        throw new Error('Échec de l\'analyse de l\'image. Veuillez réessayer.');
    }
}

/**
 * Récupère les informations sur le service backend
 * @returns Informations sur le service backend
 */
export async function getServiceInfo() {
    try {
        const response = await fetch('/api/analyze');
        if (response.ok) {
            return {
                service: 'backend',
                model_name: 'analyze-api',
                status: 'available',
                description: 'API analyze intégrée'
            };
        } else {
            return {
                service: 'backend',
                status: 'unavailable',
                description: 'API analyze non disponible'
            };
        }
    } catch (error) {
        console.error('Error getting service info:', error);
        return {
            service: 'backend',
            status: 'error',
            description: 'Erreur de connexion à l\'API analyze'
        };
    }
}

/**
 * Vérifie la disponibilité du service backend
 * @returns Statut de disponibilité
 */
export async function checkServiceAvailability(): Promise<boolean> {
    try {
        const response = await fetch('/api/analyze');
        return response.ok;
    } catch (error) {
        return false;
    }
}