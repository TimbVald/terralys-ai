/**
 * Types et interfaces pour le module de détection des maladies des plantes
 */

export interface PestInfo {
  name: string;
  description: string;
  treatment: string;
  severity: 'low' | 'medium' | 'high';
}

export interface NutrientInfo {
  name: string;
  description: string;
  deficiencySymptoms: string;
  sources: string[];
}

export interface EnvironmentalData {
  temperature?: number;
  humidity?: number;
  soilMoisture?: number;
  lightIntensity?: number;
  phLevel?: number;
  location?: string;
  soilType?: string;
  lastWatering?: string;
  fertilizer?: string;
  additionalInfo?: string;
  // Champs supplémentaires pour compatibilité avec l'interface utilisateur
  sunlight?: string;
  watering?: string;
  notes?: string;
  organicPreference?: boolean;
}

export interface PredictionData {
  confidence: number;
  disease: string;
  crop: string;
  description: string;
  treatment: string;
  prevention: string;
  severity: 'low' | 'medium' | 'high';
  environmentalFactors?: string[];
  recommendedActions?: string[];
}

export interface AnalysisRecord {
  id: string;
  timestamp: string;
  imageUrl: string;
  plantName: string;
  isHealthy: boolean;
  diseaseName?: string;
  description: string;
  treatmentSuggestions: string[];
  benefits: string[];
  confidenceScore: number;
  preventativeCareTips: string[];
  progressAssessment?: string;
  comparativeAnalysis?: string;
  pestIdentification?: PestInfo[];
  nutrientDeficiencies?: NutrientInfo[];
  environmentalData?: EnvironmentalData;
  notes?: string;
  severity?: 'low' | 'medium' | 'high';
  service?: AnalysisService;
  preventiveMeasures?: string[];
  recommendations?: string[];
  treatment?: TreatmentRecommendation;
}

export interface PlantProfile {
  id: string;
  name: string;
  species?: string;
  location?: string;
  plantingDate?: string;
  notes?: string;
  analysisHistory: AnalysisRecord[];
  createdAt?: string;
  lastAnalysis?: string;
}

export interface BackendHealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version?: string;
}

export interface BackendModelInfo {
  modelName: string;
  version: string;
  accuracy: number;
  supportedCrops: string[];
}

export interface BackendErrorResponse {
  error: string;
  message: string;
  timestamp: string;
}

export type AnalysisService = 'local' | 'backend' | 'gemini';

// Types pour l'API backend (consolidés depuis lib/types.ts)
export interface ClassificationResult {
    crop: string;
    disease: string;
    confidence: number;
    raw_prediction: string;
    disease_info: string;
}

export interface TreatmentRecommendation {
    immediate_actions: string[];
    treatment_options: Record<string, string[]>;
    prevention_strategy: string[];
    monitoring_followup: string[];
    expected_timeline: string;
    confidence_level: string;
}

export interface AnalysisResponse {
    success: boolean;
    classification?: ClassificationResult;
    treatment?: TreatmentRecommendation;
    pestIdentification?: PestInfo[];
    nutrientDeficiencies?: NutrientInfo[];
    analysis_time: number;
    timestamp: string;
    error_message?: string;
}