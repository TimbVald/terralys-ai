/**
 * API Route pour l'analyse des maladies des plantes
 * 
 * Cette route orchestre l'ensemble du processus d'analyse :
 * 1. Validation et traitement du fichier image
 * 2. Classification via le modèle de vision
 * 3. Génération de recommandations de traitement
 * 4. Retour d'une réponse structurée
 * 
 * @route POST /api/analyze
 * @param {NextRequest} request - Requête contenant le fichier image
 * @returns {NextResponse<AnalysisResponse>} Résultat de l'analyse
 */

import { NextResponse, type NextRequest } from 'next/server';
import { classifyImage } from '@/lib/vision';
import { getEnhancedRemedySuggestions } from '@/lib/gemini';
import { parseLabel, getDetailedDiseaseInfo } from '@/lib/utils';
import type { AnalysisResponse, ClassificationResult } from '@/modules/plant-disease-detection/types';

// Configuration des limites
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MIN_CONFIDENCE_THRESHOLD = 0.1;

/**
 * Valide le fichier image uploadé
 * @param file - Le fichier à valider
 * @throws {Error} Si le fichier ne respecte pas les critères
 */
function validateImageFile(file: File): void {
    if (!file) {
        throw new Error("Aucun fichier fourni");
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`Fichier trop volumineux. Taille maximale autorisée : ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        throw new Error(`Type de fichier non supporté. Types autorisés : ${ALLOWED_MIME_TYPES.join(', ')}`);
    }

    if (file.size === 0) {
        throw new Error("Le fichier est vide");
    }
}

/**
 * Crée une réponse d'erreur standardisée
 * @param message - Message d'erreur
 * @param status - Code de statut HTTP
 * @param analysisTime - Temps d'analyse en secondes
 * @returns Réponse d'erreur formatée
 */
function createErrorResponse(
    message: string, 
    status: number = 500, 
    analysisTime: number = 0
): NextResponse<AnalysisResponse> {
    const errorResponse: AnalysisResponse = {
        success: false,
        error_message: message,
        analysis_time: analysisTime,
        timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(errorResponse, { status });
}

/**
 * Valide les résultats de classification
 * @param classification - Résultats de la classification
 * @throws {Error} Si les résultats ne sont pas valides
 */
function validateClassificationResults(classification: { label: string; score: number }): void {
    if (!classification.label || typeof classification.label !== 'string') {
        throw new Error("Résultat de classification invalide : label manquant");
    }

    if (typeof classification.score !== 'number' || classification.score < 0 || classification.score > 1) {
        throw new Error("Résultat de classification invalide : score invalide");
    }

    if (classification.score < MIN_CONFIDENCE_THRESHOLD) {
        throw new Error(`Confiance trop faible (${Math.round(classification.score * 100)}%). Image probablement non valide.`);
    }
}

/**
 * Endpoint principal pour l'analyse d'images de plantes
 * Traite une image et retourne une analyse complète avec recommandations
 */
export async function POST(request: NextRequest): Promise<NextResponse<AnalysisResponse>> {
    const startTime = Date.now();
    console.log('🚀 [API] Début de l\'analyse - POST /api/analyze');
    
    try {
        // Extraction et validation du fichier et des données d'environnement
        console.log('📁 [API] Extraction du fichier depuis FormData...');
        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        // Extraction des données d'environnement optionnelles
        const environmentalDataStr = formData.get('environmentalData') as string;
        let environmentalData = null;
        if (environmentalDataStr) {
            try {
                environmentalData = JSON.parse(environmentalDataStr);
                console.log('🌍 [API] Données environnementales reçues:', environmentalData);
            } catch (error) {
                console.warn('⚠️ [API] Erreur lors du parsing des données environnementales:', error);
            }
        }
        
        if (!file) {
            console.error('❌ [API] Aucun fichier fourni');
            return createErrorResponse('Aucun fichier fourni', 400, Date.now() - startTime);
        }
        
        console.log('✅ [API] Fichier reçu:', { name: file.name, size: file.size, type: file.type });
        validateImageFile(file);
        console.log('✅ [API] Validation du fichier réussie');
        
        // Classification de l'image
        console.log('🔍 [API] Début de la classification...');
        const classification = await classifyImage(file);
        console.log('📊 [API] Classification reçue:', classification);
        validateClassificationResults(classification);
        console.log('✅ [API] Validation de la classification réussie');
        
        // Traitement des données
        console.log('🔄 [API] Traitement des données...');
        const [crop, disease] = parseLabel(classification.label);
        console.log('🏷️ [API] Label parsé:', { crop, disease, originalLabel: classification.label });
        const diseaseInfo = getDetailedDiseaseInfo(crop, disease);
        console.log('📖 [API] Info maladie:', diseaseInfo);
        
        const classificationResult: ClassificationResult = {
            crop,
            disease,
            confidence: classification.score,
            raw_prediction: classification.label,
            disease_info: diseaseInfo
        };
        console.log('📋 [API] Résultat de classification créé:', classificationResult);
        
        // Génération des recommandations avec données d'environnement
        console.log('💊 [API] Génération des recommandations...');
        const enhancedAnalysis = await getEnhancedRemedySuggestions(
            crop,
            disease,
            environmentalData
        );
        console.log('✅ [API] Recommandations générées:', enhancedAnalysis);
        
        // Construction de la réponse
        const response: AnalysisResponse = {
            success: true,
            classification: classificationResult,
            treatment: enhancedAnalysis.treatment,
            pestIdentification: enhancedAnalysis.pestIdentification,
            nutrientDeficiencies: enhancedAnalysis.nutrientDeficiencies,
            analysis_time: Date.now() - startTime,
            timestamp: new Date().toISOString(),
        };
        
        console.log('🎯 [API] Réponse finale construite:', JSON.stringify(response, null, 2));
        console.log('✅ [API] Envoi de la réponse avec succès');
        return NextResponse.json(response);
        
    } catch (error) {
        console.error('❌ [API] Erreur lors de l\'analyse:', error);
        console.error('❌ [API] Stack trace:', error instanceof Error ? error.stack : 'Pas de stack trace');
        
        if (error instanceof Error) {
            if (error.message.includes('taille')) {
                console.error('❌ [API] Erreur de taille de fichier');
                return createErrorResponse('Fichier trop volumineux (max 10MB)', 413, Date.now() - startTime);
            }
            if (error.message.includes('type')) {
                console.error('❌ [API] Erreur de type de fichier');
                return createErrorResponse('Type de fichier non supporté', 415, Date.now() - startTime);
            }
            if (error.message.includes('confiance')) {
                console.error('❌ [API] Erreur de confiance insuffisante');
                return createErrorResponse('Confiance insuffisante dans la prédiction', 422, Date.now() - startTime);
            }
        }
        
        console.error('❌ [API] Erreur interne du serveur');
        return createErrorResponse('Erreur interne du serveur', 500, Date.now() - startTime);
    }
}

/**
 * Endpoint GET pour vérifier l'état de l'API
 * @returns Informations sur l'API et sa disponibilité
 */
export async function GET(): Promise<NextResponse> {
    try {
        const apiInfo = {
            name: "Plant Disease Analysis API",
            version: "1.0.0",
            status: "operational",
            endpoints: {
                analyze: "POST /api/analyze",
                health: "GET /api/analyze/health"
            },
            limits: {
                max_file_size: `${MAX_FILE_SIZE / (1024 * 1024)}MB`,
                supported_formats: ALLOWED_MIME_TYPES,
                min_confidence: MIN_CONFIDENCE_THRESHOLD
            },
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(apiInfo);
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur lors de la récupération des informations de l'API" }, 
            { status: 500 }
        );
    }
}