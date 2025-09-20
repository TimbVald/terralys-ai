'use client';

import { useState, useEffect, useCallback } from 'react';
import { ipinfoService, type IPLocationData, type Coordinates } from '../services/ipinfoService';

/**
 * Interface pour l'état du hook useIPLocation
 */
interface UseIPLocationState {
  locationData: IPLocationData | null;
  formattedLocation: string | null;
  coordinates: Coordinates | null;
  isLoading: boolean;
  error: string | null;
  isConfigured: boolean;
}

/**
 * Interface pour les options du hook
 */
interface UseIPLocationOptions {
  autoFetch?: boolean; // Récupère automatiquement la localisation au montage
  token?: string; // Token IPinfo
}

/**
 * Hook personnalisé pour la géolocalisation IP
 */
export function useIPLocation(options: UseIPLocationOptions = {}) {
  const { autoFetch = false, token } = options;

  const [state, setState] = useState<UseIPLocationState>({
    locationData: null,
    formattedLocation: null,
    coordinates: null,
    isLoading: false,
    error: null,
    isConfigured: false
  });

  // Initialise le service IPinfo
  useEffect(() => {
    if (token) {
      ipinfoService.initialize(token);
    }
    
    setState(prev => ({
      ...prev,
      isConfigured: ipinfoService.isConfigured()
    }));
  }, [token]);

  /**
   * Récupère les données de localisation
   */
  const fetchLocation = useCallback(async (ip?: string) => {
    if (!ipinfoService.isConfigured()) {
      setState(prev => ({
        ...prev,
        error: 'Service IPinfo non configuré. Veuillez fournir un token valide.'
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      // Récupère les données de localisation
      const locationData = await ipinfoService.getLocationData(ip);
      
      if (!locationData) {
        throw new Error('Impossible de récupérer les données de localisation');
      }

      // Formate la localisation pour l'affichage
      const formattedLocation = await ipinfoService.getFormattedLocation(ip);
      
      // Extrait les coordonnées
      const coordinates = ipinfoService.extractCoordinates(locationData);

      setState(prev => ({
        ...prev,
        locationData,
        formattedLocation,
        coordinates,
        isLoading: false,
        error: null
      }));

      return locationData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      console.error('Erreur lors de la récupération de la localisation:', error);
      return null;
    }
  }, []);

  /**
   * Récupère la localisation actuelle de l'utilisateur
   */
  const fetchCurrentLocation = useCallback(() => {
    return fetchLocation();
  }, [fetchLocation]);

  /**
   * Remet à zéro l'état
   */
  const reset = useCallback(() => {
    setState({
      locationData: null,
      formattedLocation: null,
      coordinates: null,
      isLoading: false,
      error: null,
      isConfigured: ipinfoService.isConfigured()
    });
  }, []);

  /**
   * Nettoie le cache
   */
  const clearCache = useCallback(() => {
    ipinfoService.clearCache();
  }, []);

  // Récupération automatique au montage si activée
  useEffect(() => {
    if (autoFetch && ipinfoService.isConfigured()) {
      fetchCurrentLocation();
    }
  }, [autoFetch, fetchCurrentLocation]);

  return {
    // État
    ...state,
    
    // Actions
    fetchLocation,
    fetchCurrentLocation,
    reset,
    clearCache,
    
    // Utilitaires
    isReady: state.isConfigured && !state.isLoading,
    hasData: !!state.locationData,
    hasError: !!state.error
  };
}

export default useIPLocation;