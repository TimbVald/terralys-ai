/**
 * Service d'analyse des maladies des plantes utilisant l'API interne /api/analyze
 * Remplace l'ancien service backend pour utiliser l'API locale optimisée
 */

import type { PredictionData, BackendHealthResponse, BackendModelInfo, BackendErrorResponse } from '../types';

// URL de base de l'API interne
const API_BASE_URL = '/api/analyze';

/**
 * Mappe les données de l'API analyze vers le format PredictionData attendu par le module
 * @param analysisResponse Réponse de l'API analyze
 * @returns Données formatées pour le module
 */
function mapAnalysisResponseToPredictionData(analysisResponse: any): PredictionData {
    const classification = analysisResponse.classification;
    const treatment = analysisResponse.treatment;
    
    // Déterminer la sévérité basée sur la confiance et le type de maladie
    let severity: 'low' | 'medium' | 'high' = 'medium';
    if (classification?.confidence > 0.8) {
        severity = classification.disease === 'Sain' ? 'low' : 'high';
    } else if (classification?.confidence < 0.5) {
        severity = 'low';
    }

    return {
        confidence: classification?.confidence || 0,
        disease: classification?.disease || 'Inconnu',
        crop: classification?.crop || 'Plante inconnue',
        description: classification?.disease_info || 'Aucune description disponible',
        treatment: treatment?.immediate_actions?.join('. ') || 'Consultez un expert pour des recommandations spécifiques.',
        prevention: treatment?.prevention_strategy?.join('. ') || 'Maintenez de bonnes pratiques culturales.',
        severity,
        environmentalFactors: [],
        recommendedActions: [
            ...(treatment?.immediate_actions || []),
            ...(treatment?.treatment_options?.organic || []),
            ...(treatment?.treatment_options?.cultural || [])
        ].filter(Boolean)
    };
}

/**
 * Analyse une image de plante avec l'API interne /api/analyze
 * @param imageFile Fichier image à analyser
 * @returns Générateur asynchrone pour les mises à jour de statut
 */
export async function* analyzeWithBackend(imageFile: File): AsyncGenerator<string, PredictionData, unknown> {
    try {
        yield "Préparation de l'image pour l'analyse...";
        
        // Validation du fichier
        if (!imageFile) {
            throw new Error('Aucun fichier fourni');
        }

        if (imageFile.size > 10 * 1024 * 1024) { // 10MB
            throw new Error('Fichier trop volumineux (max 10MB)');
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(imageFile.type)) {
            throw new Error(`Type de fichier non supporté. Types autorisés : ${allowedTypes.join(', ')}`);
        }

        yield "Envoi de la requête au serveur d'analyse...";
        
        // Préparer les données FormData
        const formData = new FormData();
        formData.append('file', imageFile);

        // Appeler l'API d'analyse
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            let errorMessage = `Erreur HTTP ${response.status}: ${response.statusText}`;
            
            try {
                const errorData = await response.json();
                errorMessage = errorData.error_message || errorMessage;
            } catch {
                // Ignore les erreurs de parsing JSON
            }
            
            throw new Error(errorMessage);
        }

        yield "Traitement de la réponse du serveur...";

        const analysisResponse = await response.json();
        
        if (!analysisResponse.success) {
            throw new Error(analysisResponse.error_message || 'Échec de l\'analyse');
        }

        yield "Formatage des résultats...";

        // Mapper la réponse vers le format attendu
        const predictionData = mapAnalysisResponseToPredictionData(analysisResponse);

        yield "Analyse terminée avec succès !";
        
        return predictionData;

    } catch (error) {
        console.error('Erreur lors de l\'analyse avec l\'API interne:', error);
        
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Impossible de se connecter à l\'API d\'analyse. Veuillez vérifier que le serveur fonctionne.');
        }
        
        if (error instanceof Error) {
            throw error;
        }
        
        throw new Error('Une erreur inattendue s\'est produite lors de l\'analyse.');
    }
}

/**
 * Fonction utilitaire pour vérifier si l'API d'analyse est disponible
 * @returns Promise<boolean> true si l'API est disponible
 */
export async function checkBackendHealth(): Promise<boolean> {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Fonction pour obtenir les informations sur l'API d'analyse
 * @returns Informations sur l'API et ses capacités
 */
export async function getModelInfo(): Promise<BackendModelInfo> {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error('Échec de la récupération des informations de l\'API');
        }
        
        const apiInfo = await response.json();
        
        // Mapper les informations de l'API vers le format BackendModelInfo
        return {
            modelName: apiInfo.name || 'Plant Disease Analysis API',
            version: apiInfo.version || '1.0.0',
            accuracy: 0.85, // Valeur par défaut, pourrait être dynamique
            supportedCrops: [
                'Pomme de terre', 'Tomate', 'Maïs', 'Blé', 'Riz', 
            ] // Liste par défaut, pourrait être récupérée de l'API
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des informations du modèle:', error);
        throw error;
    }
}

/**
 * Fonction pour obtenir l'état de santé détaillé de l'API
 * @returns Informations détaillées sur l'état de l'API
 */
export async function getDetailedHealth(): Promise<BackendHealthResponse> {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
        
        if (!response.ok) {
            return {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                version: 'unknown'
            };
        }
        
        const apiInfo = await response.json();
        
        return {
            status: 'healthy',
            timestamp: apiInfo.timestamp || new Date().toISOString(),
            version: apiInfo.version || '1.0.0'
        };
    } catch {
        return {
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            version: 'unknown'
        };
    }
}

// Export par défaut du service avec toutes les fonctions
export const backendService = {
    analyzeWithBackend,
    checkBackendHealth,
    getModelInfo,
    getDetailedHealth
};

// Export par défaut
export default backendService;