'use client';

import React, { useState, useEffect } from 'react';
import type { EnvironmentalData } from '../types';
import { LocationIcon } from './icons';
import { useIPLocation } from '../hooks/useIPLocation';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Interface pour les props du composant EnvironmentalForm
 */
interface EnvironmentalFormProps {
  onDataChange: (data: EnvironmentalData) => void;
  initialData?: Partial<EnvironmentalData>;
  className?: string;
  analysisId?: string; // ID de l'analyse pour enregistrer les données en base
  autoSave?: boolean; // Enregistrement automatique en base de données
}

/**
 * Composant de formulaire pour les données environnementales
 * Permet de saisir les conditions environnementales pour améliorer l'analyse
 * Intègre la géolocalisation automatique via IPinfo
 */
export function EnvironmentalForm({ 
  onDataChange, 
  initialData = {},
  className = '',
  analysisId,
  autoSave = false
}: EnvironmentalFormProps) {
  const [data, setData] = useState<EnvironmentalData>({
    temperature: initialData.temperature || 20,
    humidity: initialData.humidity || 60,
    soilMoisture: initialData.soilMoisture || 50,
    lightIntensity: initialData.lightIntensity || 70,
    phLevel: initialData.phLevel || 7,
    location: initialData.location || '',
    soilType: initialData.soilType || '',
    lastWatering: initialData.lastWatering || '',
    fertilizer: initialData.fertilizer || '',
    ...initialData
  });

  // Hook tRPC pour l'enregistrement des données environnementales
  const trpc = useTRPC();
  const addEnvironmentalDataMutation = useMutation(
    trpc.plantDiseaseDetection.addEnvironmentalData.mutationOptions({
      onSuccess: () => {
        console.log('Données environnementales enregistrées avec succès');
        toast.success('Données environnementales enregistrées avec succès');
      },
      onError: (error) => {
        console.error('Erreur lors de l\'enregistrement des données environnementales:', error);
        toast.error('Erreur lors de l\'enregistrement des données environnementales');
      }
    })
  );

  // Hook pour la géolocalisation IP
  const {
    formattedLocation,
    isLoading: isLoadingLocation,
    error: locationError,
    isConfigured: isIPinfoConfigured,
    fetchCurrentLocation,
    hasData: hasLocationData
  } = useIPLocation({
    token: process.env.NEXT_PUBLIC_IPINFO_TOKEN,
    autoFetch: false // Nous gérerons manuellement le fetch
  });

  /**
   * Met à jour les données et notifie le parent
   * Enregistre automatiquement en base si autoSave est activé et analysisId fourni
   */
  const updateData = (updates: Partial<EnvironmentalData>) => {
    const newData = { ...data, ...updates };
    setData(newData);
    onDataChange(newData);

    // Enregistrement automatique en base de données si configuré
    if (autoSave && analysisId && !addEnvironmentalDataMutation.isPending) {
      const environmentalDataForDB = {
        analysisId,
        temperature: newData.temperature,
        humidity: newData.humidity,
        soilMoisture: newData.soilMoisture,
        lightIntensity: newData.lightIntensity,
        phLevel: newData.phLevel,
        location: newData.location,
        soilType: newData.soilType,
        lastWatering: newData.lastWatering,
        fertilizer: newData.fertilizer,
        additionalInfo: newData.additionalInfo,
        sunlight: newData.sunlight,
        watering: newData.watering,
        notes: newData.notes,
        organicPreference: newData.organicPreference
      };

      addEnvironmentalDataMutation.mutate(environmentalDataForDB);
      toast.info('Enregistrement automatique en cours...');
    }
  };

  /**
   * Gère la détection automatique de la localisation
   */
  const handleAutoDetectLocation = async () => {
    if (!isIPinfoConfigured) {
      console.warn('Service IPinfo non configuré. Ajoutez NEXT_PUBLIC_IPINFO_TOKEN à votre fichier .env');
      toast.warning('Service IPinfo non configuré. Ajoutez NEXT_PUBLIC_IPINFO_TOKEN à votre fichier .env');
      return;
    }

    try {
      await fetchCurrentLocation();
    } catch (error) {
      console.error('Erreur lors de la détection automatique de la localisation:', error);
      toast.error('Erreur lors de la détection automatique de la localisation');
    }
  };

  // Met à jour la localisation quand les données IPinfo sont disponibles
  useEffect(() => {
    if (formattedLocation && !data.location) {
      updateData({ location: formattedLocation });
    }
  }, [formattedLocation, data.location]);

  return (
    <div className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-8 backdrop-blur-sm ${className}`}>
      <div className="flex items-center mb-6">
        <div className="relative mr-4">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-sm opacity-30 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-emerald-100 to-teal-100 p-3 rounded-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Conditions environnementales
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Optimisez l'analyse avec des données précises
          </p>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-8 border border-emerald-200">
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-emerald-700 font-medium text-sm">
            Ces informations aident à améliorer la précision de l'analyse et des recommandations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Température */}
        <div className="group">
          <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-orange-500">
              <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Température (°C)
          </label>
          <div className="relative">
            <input
              type="number"
              min="-10"
              max="50"
              value={data.temperature}
              onChange={(e) => updateData({ temperature: Number(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:border-gray-300"
              placeholder="20"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-400/10 to-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        </div>

        {/* Humidité */}
        <div className="group">
          <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-blue-500">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Humidité (%)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              value={data.humidity}
              onChange={(e) => updateData({ humidity: Number(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:border-gray-300"
              placeholder="60"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        </div>

        {/* Humidité du sol */}
        <div className="group">
          <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-amber-600">
              <path d="M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 22h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Humidité du sol (%)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              value={data.soilMoisture}
              onChange={(e) => updateData({ soilMoisture: Number(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:border-gray-300"
              placeholder="50"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        </div>

        {/* Intensité lumineuse */}
        <div className="group">
          <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Intensité lumineuse (%)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              value={data.lightIntensity}
              onChange={(e) => updateData({ lightIntensity: Number(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:border-gray-300"
              placeholder="70"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        </div>

        {/* pH du sol */}
        <div className="group">
          <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-purple-500">
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-5 0V4.5A2.5 2.5 0 0 1 9.5 2Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M14 6h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M14 10h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M14 14h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            pH du sol
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="14"
              step="0.1"
              value={data.phLevel}
              onChange={(e) => updateData({ phLevel: Number(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:border-gray-300"
              placeholder="7"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        </div>

        {/* Localisation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Localisation
          </label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative group flex-1">
              <input
                type="text"
                value={data.location}
                onChange={(e) => updateData({ location: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 sm:focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:border-gray-300 text-sm sm:text-base"
                placeholder="Douala, Cameroun"
              />
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
            {isIPinfoConfigured && (
              <button
                type="button"
                onClick={handleAutoDetectLocation}
                disabled={isLoadingLocation}
                className={`px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-1 sm:gap-2 min-w-[100px] sm:min-w-[120px] ${
                  isLoadingLocation
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-emerald-200'
                }`}
                title="Détecter automatiquement votre localisation"
              >
                {isLoadingLocation ? (
                  <div className="flex items-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-1"></div>
                    <span className="hidden sm:inline">...</span>
                  </div>
                ) : (
                  <>
                    <LocationIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Détecter</span>
                    <span className="sm:hidden">GPS</span>
                  </>
                )}
              </button>
            )}
          </div>
          {locationError && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
              Erreur de géolocalisation : {locationError}
            </p>
          )}
          {!isIPinfoConfigured && (
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              💡 Ajoutez NEXT_PUBLIC_IPINFO_TOKEN pour la détection automatique
            </p>
          )}
        </div>

        {/* Type de sol */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de sol
          </label>
          <select
            value={data.soilType}
            onChange={(e) => updateData({ soilType: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 sm:focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
          >
            <option value="">Sélectionner...</option>
            <option value="argileux">Argileux</option>
            <option value="sableux">Sableux</option>
            <option value="limoneux">Limoneux</option>
            <option value="humifère">Humifère</option>
            <option value="calcaire">Calcaire</option>
          </select>
        </div>

        {/* Dernier arrosage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dernier arrosage
          </label>
          <input
            type="date"
            value={data.lastWatering}
            onChange={(e) => updateData({ lastWatering: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 sm:focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
          />
        </div>

        {/* Engrais utilisé */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Engrais utilisé
          </label>
          <input
            type="text"
            value={data.fertilizer}
            onChange={(e) => updateData({ fertilizer: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 sm:focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
            placeholder="NPK 10-10-10"
          />
        </div>
      </div>

      {/* Informations supplémentaires */}
      <div className="mt-4 sm:mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Informations supplémentaires
        </label>
        <textarea
          value={data.additionalInfo || ''}
          onChange={(e) => updateData({ additionalInfo: e.target.value })}
          rows={3}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 sm:focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base resize-none"
          placeholder="Symptômes observés, traitements récents, etc."
        />
      </div>

      {/* Informations sur la géolocalisation */}
      {hasLocationData && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-xs sm:text-sm text-green-700">
              Localisation détectée automatiquement
            </span>
          </div>
        </div>
      )}
    </div>
  );
}