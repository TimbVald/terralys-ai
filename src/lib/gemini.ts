/**
 * Ce service gère toutes les interactions avec l'API Google Gemini
 * pour la génération de recommandations.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { TreatmentRecommendation, EnvironmentalData, AnalysisRecord, PestInfo, NutrientInfo } from '@/modules/plant-disease-detection/types';

/**
 * Interface pour la réponse complète de Gemini incluant parasites et carences
 */
export interface EnhancedAnalysisResponse {
  treatment: TreatmentRecommendation;
  pestIdentification?: PestInfo[];
  nutrientDeficiencies?: NutrientInfo[];
}

// 1. Configuration de l'API Gemini
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let gemini: GoogleGenerativeAI | null = null;
if (GEMINI_API_KEY) {
  gemini = new GoogleGenerativeAI(GEMINI_API_KEY);
  console.log("Service Gemini API configuré.");
} else {
  console.warn("GEMINI_API_KEY non trouvée. Le service Gemini est désactivé.");
}

/**
 * Vérifie si l'API Gemini est configurée
 * @returns true si l'API Gemini est configurée, false sinon
 */
export function isGeminiConfigured(): boolean {
    return gemini !== null && GEMINI_API_KEY !== undefined;
}

/**
 * Construit un prompt dynamique en intégrant les données d'environnement
 * @param crop Le nom de la culture
 * @param disease Le nom de la maladie
 * @param confidence Le score de confiance
 * @param environmentalData Les données environnementales optionnelles
 * @returns Le prompt formaté
 */
function buildPrompt(
    crop: string, 
    disease: string, 
    confidence: number, 
    environmentalData?: EnvironmentalData
): string {
    let prompt = `
        En tant qu'expert phytopathologiste, fournis des recommandations complètes pour traiter la maladie "${disease}" affectant la culture "${crop}".
        La confiance du diagnostic est de ${Math.round(confidence * 100)}%.
    `;

    // Intégration des données environnementales
    if (environmentalData) {
        prompt += `\n\nConsidère le contexte environnemental suivant fourni par l'utilisateur :`;
        
        // Données de localisation
        if (environmentalData.location) {
            prompt += `
            - Localisation : ${environmentalData.location}
            - Utilise cette localisation pour inférer les conditions météorologiques locales, les parasites/maladies régionaux communs, et le type de sol. Intègre fortement ces facteurs dans ton diagnostic et tes recommandations.
            `;
        }
        
        // Données environnementales mesurées
        const environmentalFactors = [];
        if (environmentalData.temperature !== undefined) {
            environmentalFactors.push(`Température : ${environmentalData.temperature}°C`);
        }
        if (environmentalData.humidity !== undefined) {
            environmentalFactors.push(`Humidité : ${environmentalData.humidity}%`);
        }
        if (environmentalData.soilMoisture !== undefined) {
            environmentalFactors.push(`Humidité du sol : ${environmentalData.soilMoisture}%`);
        }
        if (environmentalData.lightIntensity !== undefined) {
            environmentalFactors.push(`Intensité lumineuse : ${environmentalData.lightIntensity} lux`);
        }
        if (environmentalData.phLevel !== undefined) {
            environmentalFactors.push(`pH du sol : ${environmentalData.phLevel}`);
        }
        if (environmentalData.soilType) {
            environmentalFactors.push(`Type de sol : ${environmentalData.soilType}`);
        }
        if (environmentalData.lastWatering) {
            environmentalFactors.push(`Dernier arrosage : ${environmentalData.lastWatering}`);
        }
        if (environmentalData.fertilizer) {
            environmentalFactors.push(`Engrais utilisé : ${environmentalData.fertilizer}`);
        }
        
        if (environmentalFactors.length > 0) {
            prompt += `\n\nFacteurs environnementaux mesurés :\n- ${environmentalFactors.join('\n- ')}`;
        }
        
        // Informations supplémentaires de l'interface utilisateur
        const additionalFactors = [];
        if (environmentalData.sunlight) {
            additionalFactors.push(`Exposition au soleil : ${environmentalData.sunlight}`);
        }
        if (environmentalData.watering) {
            additionalFactors.push(`Fréquence d'arrosage : ${environmentalData.watering}`);
        }
        if (environmentalData.notes) {
            additionalFactors.push(`Notes : ${environmentalData.notes}`);
        }
        if (environmentalData.additionalInfo) {
            additionalFactors.push(`Informations supplémentaires : ${environmentalData.additionalInfo}`);
        }
        
        if (additionalFactors.length > 0) {
            prompt += `\n\nInformations complémentaires :\n- ${additionalFactors.join('\n- ')}`;
        }
        
        // Préférence pour les solutions biologiques
        if (environmentalData.organicPreference) {
            prompt += `\n\nL'utilisateur préfère des solutions biologiques et durables. Priorise ces approches dans tes recommandations.`;
        }
        
        prompt += `\n\nIntègre tous ces facteurs environnementaux dans ton analyse pour fournir des recommandations personnalisées et adaptées aux conditions spécifiques de la plante.`;
    }



    prompt += `
        
        Fournis une réponse structurée au format JSON (uniquement l'objet JSON, sans markdown) avec les clés suivantes :
        
        "treatment": {
            "immediate_actions" (array de string), 
            "treatment_options" (objet avec clés "organic", "chemical", "cultural"), 
            "prevention_strategy" (array de string), 
            "monitoring_followup" (array de string), 
            "expected_timeline" (string),
            "confidence_level" (string)
        },
        
        "pestIdentification": array d'objets avec les clés suivantes pour chaque parasite détecté :
            "name" (string), "description" (string), "treatment" (string), "severity" ("low"|"medium"|"high")
        
        "nutrientDeficiencies": array d'objets avec les clés suivantes pour chaque carence détectée :
            "name" (string), "description" (string), "deficiencySymptoms" (string), "sources" (array de string)
        
        Si aucun parasite ou carence n'est détecté, retourne un array vide pour ces champs.
        Sois pratique et concis dans tes recommandations.
    `;

    return prompt;
}

/**
 * Génère des recommandations de traitement à l'aide de l'API Gemini.
 * @param crop Le nom de la culture.
 * @param disease Le nom de la maladie.
 * @param confidence Le score de confiance de la classification.
 * @param environmentalData Les données environnementales optionnelles.
 * @returns Un objet de recommandation de traitement.
 */
export async function getEnhancedRemedySuggestions(
    crop: string, 
    disease: string, 
    confidence: number, 
    environmentalData?: EnvironmentalData
): Promise<EnhancedAnalysisResponse> {
    const confidenceLevel = confidence > 0.8 ? "Élevée" : confidence > 0.6 ? "Moyenne" : "Faible";
    
    if (!gemini || disease === "Sain") {
        return getOfflineRemedySuggestions(crop, disease, confidenceLevel);
    }
    
    const geminiModel = gemini.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const prompt = buildPrompt(crop, disease, confidence, environmentalData);

    try {
        const result = await geminiModel.generateContent(prompt);
        const responseText = result.response.text();
        
        // Nettoyer la réponse en supprimant les markdown code blocks si présents
        let cleanedResponse = responseText.trim();
        if (cleanedResponse.startsWith('```json')) {
            cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanedResponse.startsWith('```')) {
            cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        try {
            const parsedResponse = JSON.parse(cleanedResponse) as EnhancedAnalysisResponse;
            console.log('Réponse parsée:', parsedResponse);
            return parsedResponse;
        } catch (parseError) {
            console.error('Erreur lors du parsing JSON:', parseError);
            console.log('Réponse à parser:', cleanedResponse);
            throw new Error('Format de réponse invalide de Gemini');
        }
    } catch (error) {
        console.error("Erreur avec l'API Gemini, utilisation du fallback:", error);
        
        // Fallback avec des recommandations génériques
        return {
            treatment: {
                immediate_actions: [
                    "Isoler la plante affectée",
                    "Retirer les parties malades visibles",
                    "Améliorer la circulation d'air"
                ],
                treatment_options: {
                    organic: ["Traitement biologique adapté", "Renforcement naturel des défenses"],
                    chemical: ["Fongicide approprié selon les recommandations locales"],
                    cultural: ["Ajustement des pratiques de culture", "Modification de l'arrosage"]
                },
                prevention_strategy: [
                    "Surveillance régulière",
                    "Maintien de bonnes conditions de culture",
                    "Rotation des cultures si applicable"
                ],
                monitoring_followup: [
                    "Vérifier l'évolution dans 7-10 jours",
                    "Surveiller l'apparition de nouveaux symptômes",
                    "Ajuster le traitement si nécessaire"
                ],
                expected_timeline: "Amélioration attendue dans 2-3 semaines avec un traitement approprié",
                confidence_level: confidenceLevel
            },
            pestIdentification: [],
            nutrientDeficiencies: []
        };
    }
}



/**
 * Fournit des suggestions de remèdes hors ligne en cas d'échec de l'API Gemini ou si elle est désactivée.
 */
function getOfflineRemedySuggestions(crop: string, disease: string, confidenceLevel: string): EnhancedAnalysisResponse {
    if (disease === "Sain") {
        return {
            treatment: {
                immediate_actions: ["Maintenir les bonnes pratiques de culture.", "Surveiller régulièrement."],
                treatment_options: { organic: ["Aucun traitement nécessaire."], chemical: ["Aucun traitement nécessaire."], cultural: ["Assurer un arrosage et une fertilisation adéquats."], },
                prevention_strategy: ["Continuer la rotation des cultures.", "Utiliser des variétés résistantes à l'avenir."],
                monitoring_followup: ["Surveiller l'apparition de tout signe de stress ou de maladie."],
                expected_timeline: "N/A",
                confidence_level: confidenceLevel,
            },
            pestIdentification: [],
            nutrientDeficiencies: []
        };
    }
    return {
        treatment: {
            immediate_actions: ["Isoler les plantes affectées.", "Retirer et détruire les parties infectées."],
            treatment_options: { organic: ["Appliquer de l'huile de neem ou des fongicides à base de cuivre."], chemical: ["Consulter un expert local pour des fongicides systémiques."], cultural: ["Améliorer la circulation de l'air et réduire l'humidité."], },
            prevention_strategy: ["Pratiquer la rotation des cultures.", "Assurer un espacement adéquat.", "Éviter l'arrosage par le dessus."],
            monitoring_followup: ["Inspecter les plantes chaque semaine pour de nouveaux symptômes."],
            expected_timeline: "Amélioration visible sous 2-4 semaines avec un traitement constant.",
            confidence_level: confidenceLevel,
        },
        pestIdentification: [],
        nutrientDeficiencies: []
    };
}
