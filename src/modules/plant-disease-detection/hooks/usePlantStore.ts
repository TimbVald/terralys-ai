/**
 * Hook personnalisé pour gérer le stockage et la gestion des profils de plantes
 * Utilise localStorage pour la persistance des données
 */

import { useState, useEffect, useCallback } from 'react';
import type { PlantProfile, AnalysisRecord } from '../types';

const STORAGE_KEY = 'terralys-plant-disease-profiles';

/**
 * Hook pour gérer les profils de plantes et leur historique d'analyse
 * @returns Objet contenant les profils et les fonctions de gestion
 */
export const usePlantStore = () => {
  const [plantProfiles, setPlantProfiles] = useState<PlantProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Charge les profils depuis localStorage au montage du composant
   */
  useEffect(() => {
    try {
      const storedProfiles = localStorage.getItem(STORAGE_KEY);
      if (storedProfiles) {
        const profiles = JSON.parse(storedProfiles);
        setPlantProfiles(profiles);
      }
    } catch (error) {
      console.error("Échec du chargement des profils de plantes depuis localStorage", error);
      setPlantProfiles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Sauvegarde les profils dans localStorage
   * @param profiles Liste des profils à sauvegarder
   */
  const saveProfiles = useCallback((profiles: PlantProfile[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
      setPlantProfiles(profiles);
    } catch (error) {
      console.error("Échec de la sauvegarde des profils de plantes dans localStorage", error);
    }
  }, []);

  /**
   * Ajoute un nouveau profil de plante
   * @param plantData Données de la plante (nom requis, autres propriétés optionnelles)
   * @returns Le nouveau profil créé
   */
  const addPlant = useCallback((plantData: string | Omit<PlantProfile, 'id' | 'analysisHistory'>): PlantProfile => {
    // Support pour l'ancienne signature (string) et la nouvelle (objet)
    const data = typeof plantData === 'string' 
      ? { name: plantData } 
      : plantData;
    
    if (!data.name.trim()) {
      throw new Error("Le nom de la plante ne peut pas être vide.");
    }
    
    const newPlant: PlantProfile = {
      id: `plant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: data.name.trim(),
      analysisHistory: [],
      species: data.species,
      location: data.location,
      plantingDate: data.plantingDate,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };
    
    const updatedProfiles = [...plantProfiles, newPlant];
    saveProfiles(updatedProfiles);
    return newPlant;
  }, [plantProfiles, saveProfiles]);

  /**
   * Ajoute une analyse à un profil de plante existant
   * @param plantId ID du profil de plante
   * @param analysis Enregistrement d'analyse à ajouter
   */
  const addAnalysisToPlant = useCallback((plantId: string, analysis: AnalysisRecord) => {
    const updatedProfiles = plantProfiles.map(plant => {
      if (plant.id === plantId) {
        return {
          ...plant,
          analysisHistory: [...plant.analysisHistory, analysis],
          lastAnalysis: analysis.timestamp,
        };
      }
      return plant;
    });
    saveProfiles(updatedProfiles);
  }, [plantProfiles, saveProfiles]);

  /**
   * Supprime un profil de plante
   * @param plantId ID du profil à supprimer
   */
  const deletePlant = useCallback((plantId: string) => {
    const updatedProfiles = plantProfiles.filter(plant => plant.id !== plantId);
    saveProfiles(updatedProfiles);
  }, [plantProfiles, saveProfiles]);

  /**
   * Met à jour le nom d'un profil de plante
   * @param plantId ID du profil à modifier
   * @param newName Nouveau nom de la plante
   */
  const updatePlantName = useCallback((plantId: string, newName: string) => {
    if (!newName.trim()) {
      throw new Error("Le nom de la plante ne peut pas être vide.");
    }
    
    const updatedProfiles = plantProfiles.map(plant => {
      if (plant.id === plantId) {
        return { ...plant, name: newName.trim() };
      }
      return plant;
    });
    saveProfiles(updatedProfiles);
  }, [plantProfiles, saveProfiles]);

  /**
   * Obtient un profil de plante par son ID
   * @param plantId ID du profil recherché
   * @returns Le profil trouvé ou undefined
   */
  const getPlantById = useCallback((plantId: string): PlantProfile | undefined => {
    return plantProfiles.find(plant => plant.id === plantId);
  }, [plantProfiles]);

  /**
   * Supprime un profil de plante (alias pour deletePlant)
   * @param plantId ID du profil à supprimer
   */
  const removePlant = useCallback((plantId: string) => {
    deletePlant(plantId);
  }, [deletePlant]);

  /**
   * Met à jour un profil de plante
   * @param plantId ID du profil à mettre à jour
   * @param updates Mises à jour partielles du profil
   */
  const updatePlant = useCallback((plantId: string, updates: Partial<PlantProfile>) => {
    const updatedProfiles = plantProfiles.map(plant => 
      plant.id === plantId 
        ? { ...plant, ...updates }
        : plant
    );
    saveProfiles(updatedProfiles);
  }, [plantProfiles, saveProfiles]);

  /**
   * Recherche des profils par nom ou espèce
   * @param searchTerm Terme de recherche
   * @returns Profils filtrés
   */
  const searchProfiles = useCallback((searchTerm: string): PlantProfile[] => {
    if (!searchTerm.trim()) {
      return plantProfiles;
    }
    
    return plantProfiles.filter(plant => 
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (plant.species && plant.species.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [plantProfiles]);

  return {
    plantProfiles,
    isLoading,
    addPlant,
    addAnalysisToPlant,
    deletePlant,
    removePlant,
    updatePlantName,
    updatePlant,
    getPlantById,
    searchProfiles,
  };
};