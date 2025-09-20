/**
 * Module de détection des maladies des plantes
 * Point d'entrée principal pour l'exportation des composants et services
 */

// Exportation des composants principaux
export { PlantDiseaseDetectionApp } from './components/PlantDiseaseDetectionApp';
export { ImageUploader } from './components/ImageUploader';
export { PredictionResult } from './components/PredictionResult';
export { EnvironmentalForm } from './components/EnvironmentalForm';
export { AnalysisHistory } from './components/AnalysisHistory';
export { ServiceSelector } from './components/ServiceSelector';
export { Header } from './components/Header';
export { Spinner } from './components/Spinner';

// Exportation des icônes
export * from './components/icons';

// Exportation des hooks
export { usePlantStore } from './hooks/usePlantStore';
export { useIPLocation } from './hooks/useIPLocation';

// Exportation des services
export { analyzeImage } from './services/analysisService';
export { backendService } from './services/backendService';
export { ipinfoService } from './services/ipinfoService';

// Exportation des types
export * from './types';