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
// Utilisation de NEXT_PUBLIC_ pour s'assurer que la variable est disponible côté client et serveur
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
let gemini: GoogleGenerativeAI | null = null;

// Fonction pour initialiser Gemini de manière sécurisée
function initGemini() {
  if (!GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY non trouvée dans les variables d'environnement.");
    console.warn("Veuillez ajouter votre clé API Gemini dans le fichier .env.local");
    console.warn("Exemple: NEXT_PUBLIC_GEMINI_API_KEY=votre_cle_api_ici");
    return null;
  }

  try {
    const instance = new GoogleGenerativeAI(GEMINI_API_KEY);
    if (process.env.NODE_ENV === 'development') {
      console.log("Service Gemini API configuré avec succès.");
    }
    return instance;
  } catch (error) {
    console.error("Erreur lors de l'initialisation de Gemini:", error);
    return null;
  }
}

// Initialisation lazy pour éviter les problèmes lors du build sur Vercel
const getGeminiInstance = () => {
  if (!gemini) {
    gemini = initGemini();
  }
  return gemini;
}

/**
 * Vérifie si l'API Gemini est configurée
 * @returns true si l'API Gemini est configurée, false sinon
 */
export function isGeminiConfigured(): boolean {
    return getGeminiInstance() !== null && GEMINI_API_KEY !== undefined;
}

/**
 * Construit un prompt dynamique pour l'analyse des maladies des plantes
 */
function buildPrompt(crop: string, disease: string, environmentalData?: EnvironmentalData): string {
    const basePrompt = `
Vous êtes un expert en phytopathologie, entomologie agricole et nutrition des plantes avec 20 ans d'expérience. Analysez cette situation phytosanitaire et fournissez des recommandations détaillées et scientifiquement fondées.

**CONTEXTE D'ANALYSE :**
- Culture analysée : ${crop}
- Problème identifié : ${disease}`;

    const environmentalSection = environmentalData ? `
- Conditions environnementales actuelles :
  * Température ambiante : ${environmentalData.temperature}°C
  * Taux d'humidité relative : ${environmentalData.humidity}%
  * pH du sol mesuré : ${environmentalData.phLevel}
  * Type de substrat : ${environmentalData.soilType}
  * Dernière fertilisation appliquée : ${environmentalData.fertilizer}
  * Régime d'arrosage actuel : ${environmentalData.watering}` : '';

    return `${basePrompt}${environmentalSection}

**MISSION D'EXPERTISE :**
Effectuez une analyse phytosanitaire complète en tenant compte des conditions environnementales spécifiques. Votre réponse doit être un JSON structuré et détaillé suivant EXACTEMENT ce format :

{
  "treatment": {
    "immediate_actions": [
      "Action urgente 1 avec justification technique",
      "Action urgente 2 avec timing précis",
      "Action urgente 3 avec méthode d'application"
    ],
    "treatment_options": {
      "organic": [
        "Solution biologique 1 : produit + dosage + fréquence",
        "Solution biologique 2 : méthode naturelle + application",
        "Solution biologique 3 : biocontrôle + conditions d'efficacité"
      ],
      "chemical": [
        "Traitement chimique 1 : matière active + concentration + délai",
        "Traitement chimique 2 : fongicide/insecticide + mode d'action",
        "Traitement chimique 3 : systémique/contact + précautions"
      ],
      "cultural": [
        "Pratique culturale 1 : modification environnementale + bénéfices",
        "Pratique culturale 2 : ajustement technique + mise en œuvre",
        "Pratique culturale 3 : prévention intégrée + suivi"
      ]
    },
    "prevention_strategy": [
      "Stratégie préventive 1 : méthode + période d'application",
      "Stratégie préventive 2 : surveillance + indicateurs clés",
      "Stratégie préventive 3 : rotation/résistance + planification"
    ],
    "monitoring_followup": [
      "Suivi 1 : observation + fréquence + critères d'évaluation",
      "Suivi 2 : mesures + outils + seuils d'intervention",
      "Suivi 3 : ajustements + décisions + documentation"
    ],
    "expected_timeline": "Délai détaillé : amélioration visible en X jours, contrôle en Y semaines, résolution complète en Z mois avec conditions de réussite",
    "confidence_level": "élevé/moyen/faible avec justification basée sur les données disponibles"
  },
  "pestIdentification": [
    {
      "name": "Nom scientifique et commun du ravageur/pathogène",
      "description": "Description détaillée des symptômes, cycle de vie, conditions favorables",
      "severity": "élevé/moyen/faible avec impact économique estimé",
      "treatment": "Traitement spécifique : produit + méthode + timing + efficacité attendue"
    }
  ],
  "nutrientDeficiencies": [
     {
       "nutrient": "Nom du nutriment (N, P, K, Ca, Mg, Fe, etc.)",
       "symptoms": "Symptômes visuels détaillés + localisation + évolution",
       "correction": "Méthode de correction : type d'amendement + dosage + mode d'application + absorption",
       "timeline": "Délai de correction : premiers signes en X jours, correction complète en Y semaines"
     }
   ]
}

**DIRECTIVES TECHNIQUES SPÉCIALISÉES :**

1. **Adaptation environnementale** : Intégrez obligatoirement les conditions spécifiques (température, humidité, pH, sol) dans chaque recommandation
2. **Approche IPM** : Privilégiez la lutte intégrée avec hiérarchisation : biologique > cultural > chimique
3. **Spécificité culturale** : Adaptez chaque conseil aux besoins physiologiques et phénologiques de ${crop}
4. **Précision technique** : Incluez dosages, concentrations, délais de carence, conditions d'application
5. **Évaluation des risques** : Considérez résistances, phytotoxicité, impact environnemental
6. **Monitoring scientifique** : Proposez des indicateurs mesurables et des seuils d'intervention
7. **Chronologie réaliste** : Basez les délais sur la biologie des organismes et les conditions actuelles

**CONTRAINTES DE RÉPONSE :**
- Format JSON strict sans markdown ni commentaires
- Toutes les clés obligatoires présentes
- Minimum 3 éléments par array
- Informations techniques précises et applicables
- Cohérence entre les recommandations et les conditions environnementales

Générez uniquement le JSON structuré, sans texte additionnel.`;
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
    
    // Utilisation de getGeminiInstance pour obtenir l'instance Gemini
    const geminiInstance = getGeminiInstance();
    
    if (!geminiInstance || disease === "Sain") {
        return getOfflineRemedySuggestions(crop, disease, confidenceLevel);
    }
    
    // Liste des modèles à essayer par ordre de préférence
    const modelsToTry = [
        "gemini-1.5-pro", // Modèle le plus stable en production
        "gemini-1.5-flash"
    ];
    
    const prompt = buildPrompt(crop, disease, environmentalData);
    let lastError: Error | null = null;

    // Essayer chaque modèle jusqu'à ce qu'un fonctionne
    for (const modelName of modelsToTry) {
        try {
            if (!geminiInstance) {
                throw new Error('Client Gemini non initialisé');
            }
            
            console.log(`Tentative avec le modèle: ${modelName}`);
            const geminiModel = geminiInstance.getGenerativeModel({ model: modelName });
            
            // Ajout d'un timeout pour éviter les blocages en production
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('Timeout de la requête Gemini')), 15000);
            });
            
            const resultPromise = geminiModel.generateContent(prompt);
            const result = await Promise.race([resultPromise, timeoutPromise]) as any;
            
            if (!result || !result.response) {
                throw new Error('Réponse Gemini invalide');
            }
            
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
                console.log(`Succès avec le modèle: ${modelName}`);
                return parsedResponse;
            } catch (parseError) {
                console.error(`Erreur de parsing avec le modèle ${modelName}:`, parseError);
                throw new Error('Format de réponse invalide de Gemini');
            }
        } catch (error) {
            console.error(`Erreur avec le modèle ${modelName}:`, error);
            lastError = error as Error;
            // Continuer avec le modèle suivant
        }
    }
    
    // Si tous les modèles ont échoué, utiliser le fallback
    console.error("Tous les modèles Gemini ont échoué, utilisation du fallback:", lastError);
    return getOfflineRemedySuggestions(crop, disease, confidenceLevel);
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
