'use client';

import { IPinfoWrapper, LruCache } from 'node-ipinfo';

/**
 * Interface pour les données de géolocalisation IPinfo
 */
export interface IPLocationData {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  loc?: string; // "latitude,longitude"
  postal?: string;
  timezone?: string;
  org?: string;
}

/**
 * Interface pour les coordonnées géographiques
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Service de géolocalisation utilisant IPinfo
 */
class IPinfoService {
  private ipinfoWrapper: IPinfoWrapper | null = null;
  private cache: LruCache;
  private isInitialized = false;

  constructor() {
    // Configuration du cache LRU
    const cacheOptions = {
      max: 1000, // Maximum 1000 entrées en cache
      ttl: 24 * 60 * 60 * 1000 // TTL de 24 heures
    };
    this.cache = new LruCache(cacheOptions);
  }

  /**
   * Initialise le service IPinfo avec un token
   * @param token Token d'API IPinfo
   */
  public initialize(token?: string): void {
    if (!token) {
      console.warn('IPinfo: Aucun token fourni, fonctionnalités limitées');
      return;
    }

    try {
      this.ipinfoWrapper = new IPinfoWrapper(token, this.cache, 10000); // Timeout de 10 secondes
      this.isInitialized = true;
      console.log('IPinfo service initialisé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation d\'IPinfo:', error);
    }
  }

  /**
   * Vérifie si le service est configuré
   */
  public isConfigured(): boolean {
    return this.isInitialized && this.ipinfoWrapper !== null;
  }

  /**
   * Obtient l'IP publique de l'utilisateur
   */
  public async getCurrentIP(): Promise<string | null> {
    try {
      // Utilise un service externe pour obtenir l'IP publique
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'IP:', error);
      return null;
    }
  }

  /**
   * Obtient les informations de géolocalisation pour une IP
   * @param ip Adresse IP (optionnel, utilise l'IP actuelle si non fournie)
   */
  public async getLocationData(ip?: string): Promise<IPLocationData | null> {
    if (!this.isConfigured()) {
      console.warn('IPinfo service non configuré');
      return null;
    }

    try {
      let targetIP: string | null = ip || null;
      
      // Si aucune IP n'est fournie, récupère l'IP actuelle
      if (!targetIP) {
        targetIP = await this.getCurrentIP();
        if (!targetIP) {
          throw new Error('Impossible de récupérer l\'IP actuelle');
        }
      }

      const locationData = await this.ipinfoWrapper!.lookupIp(targetIP);
      return locationData as IPLocationData;
    } catch (error) {
      console.error('Erreur lors de la récupération des données de localisation:', error);
      return null;
    }
  }

  /**
   * Obtient la localisation formatée pour l'affichage
   * @param ip Adresse IP (optionnel)
   */
  public async getFormattedLocation(ip?: string): Promise<string | null> {
    const locationData = await this.getLocationData(ip);
    
    if (!locationData) {
      return null;
    }

    const parts: string[] = [];
    
    if (locationData.city) {
      parts.push(locationData.city);
    }
    
    if (locationData.region) {
      parts.push(locationData.region);
    }
    
    if (locationData.country) {
      parts.push(locationData.country);
    }

    return parts.length > 0 ? parts.join(', ') : null;
  }

  /**
   * Extrait les coordonnées géographiques des données de localisation
   * @param locationData Données de localisation IPinfo
   */
  public extractCoordinates(locationData: IPLocationData): Coordinates | null {
    if (!locationData.loc) {
      return null;
    }

    try {
      const [latitude, longitude] = locationData.loc.split(',').map(Number);
      
      if (isNaN(latitude) || isNaN(longitude)) {
        return null;
      }

      return { latitude, longitude };
    } catch (error) {
      console.error('Erreur lors de l\'extraction des coordonnées:', error);
      return null;
    }
  }

  /**
   * Obtient les coordonnées géographiques pour une IP
   * @param ip Adresse IP (optionnel)
   */
  public async getCoordinates(ip?: string): Promise<Coordinates | null> {
    const locationData = await this.getLocationData(ip);
    
    if (!locationData) {
      return null;
    }

    return this.extractCoordinates(locationData);
  }

  /**
   * Vérifie si l'utilisateur est dans l'Union Européenne
   * @param ip Adresse IP (optionnel)
   */
  public async isInEU(ip?: string): Promise<boolean> {
    const locationData = await this.getLocationData(ip);
    
    if (!locationData || !locationData.countryCode) {
      return false;
    }

    // Liste des codes pays de l'UE
    const euCountries = [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
      'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
    ];

    return euCountries.includes(locationData.countryCode);
  }

  /**
   * Nettoie le cache
   */
  public clearCache(): void {
    // Recrée un nouveau cache vide car LruCache n'a pas de méthode clear()
    const cacheOptions = {
      max: 1000, // Maximum 1000 entrées en cache
      ttl: 24 * 60 * 60 * 1000 // TTL de 24 heures
    };
    this.cache = new LruCache(cacheOptions);
  }
}

// Instance singleton du service
export const ipinfoService = new IPinfoService();

// Export par défaut
export default ipinfoService;