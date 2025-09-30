'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  X, 
  Calendar, 
  Search, 
  SortAsc, 
  SortDesc,
  RefreshCw
} from 'lucide-react';

/**
 * Interface pour les filtres de données
 */
interface DataFiltersProps {
  table: string;
  filters: {
    search: string;
    dateFrom: string;
    dateTo: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    status?: string;
    service?: string;
    severity?: string;
  };
  onFiltersChange: (filters: any) => void;
  onReset: () => void;
  isLoading?: boolean;
}

/**
 * Configuration des filtres spécifiques par table
 */
const filterConfigs = {
  users: {
    sortOptions: [
      { value: 'name', label: 'Nom' },
      { value: 'email', label: 'Email' },
      { value: 'createdAt', label: 'Date de création' },
    ],
    additionalFilters: [],
  },
  agents: {
    sortOptions: [
      { value: 'name', label: 'Nom' },
      { value: 'createdAt', label: 'Date de création' },
    ],
    additionalFilters: [],
  },
  meetings: {
    sortOptions: [
      { value: 'name', label: 'Nom' },
      { value: 'createdAt', label: 'Date de création' },
      { value: 'startedAt', label: 'Date de début' },
    ],
    additionalFilters: [
      {
        key: 'status',
        label: 'Statut',
        type: 'select',
        options: [
          { value: 'upcoming', label: 'À venir' },
          { value: 'active', label: 'Actif' },
          { value: 'completed', label: 'Terminé' },
          { value: 'processing', label: 'En traitement' },
          { value: 'cancelled', label: 'Annulé' },
        ],
      },
    ],
  },
  plantAnalyses: {
    sortOptions: [
      { value: 'plantName', label: 'Nom de la plante' },
      { value: 'confidenceScore', label: 'Score de confiance' },
      { value: 'createdAt', label: 'Date d\'analyse' },
    ],
    additionalFilters: [
      {
        key: 'service',
        label: 'Service d\'analyse',
        type: 'select',
        options: [
          { value: 'local', label: 'Local' },
          { value: 'backend', label: 'Backend' },
          { value: 'gemini', label: 'Gemini' },
        ],
      },
      {
        key: 'severity',
        label: 'Sévérité',
        type: 'select',
        options: [
          { value: 'low', label: 'Faible' },
          { value: 'medium', label: 'Moyenne' },
          { value: 'high', label: 'Élevée' },
        ],
      },
    ],
  },
};

/**
 * Composant DataFilters pour les filtres avancés
 */
export function DataFilters({ 
  table, 
  filters, 
  onFiltersChange, 
  onReset, 
  isLoading = false 
}: DataFiltersProps) {
  const config = filterConfigs[table as keyof typeof filterConfigs] || filterConfigs.users;

  /**
   * Mise à jour d'un filtre spécifique
   */
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  /**
   * Suppression d'un filtre actif
   */
  const removeFilter = (key: string) => {
    updateFilter(key, '');
  };

  /**
   * Récupération des filtres actifs
   */
  const getActiveFilters = () => {
    const active = [];
    
    if (filters.search) {
      active.push({ key: 'search', label: 'Recherche', value: filters.search });
    }
    
    if (filters.dateFrom) {
      active.push({ 
        key: 'dateFrom', 
        label: 'Date début', 
        value: new Date(filters.dateFrom).toLocaleDateString('fr-FR') 
      });
    }
    
    if (filters.dateTo) {
      active.push({ 
        key: 'dateTo', 
        label: 'Date fin', 
        value: new Date(filters.dateTo).toLocaleDateString('fr-FR') 
      });
    }
    
    if (filters.sortBy) {
      const sortOption = config.sortOptions.find(opt => opt.value === filters.sortBy);
      active.push({ 
        key: 'sortBy', 
        label: 'Tri', 
        value: `${sortOption?.label} (${filters.sortOrder === 'asc' ? 'Croissant' : 'Décroissant'})` 
      });
    }
    
    // Filtres additionnels spécifiques à la table
    config.additionalFilters.forEach(filter => {
      const value = filters[filter.key as keyof typeof filters];
      if (value) {
        const option = filter.options.find(opt => opt.value === value);
        active.push({ 
          key: filter.key, 
          label: filter.label, 
          value: option?.label || value 
        });
      }
    });
    
    return active;
  };

  const activeFilters = getActiveFilters();

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Filtres avancés
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Recherche */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">
            Recherche textuelle
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Rechercher dans les données..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filtres de date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateFrom" className="text-sm font-medium">
              Date de début
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => updateFilter('dateFrom', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateTo" className="text-sm font-medium">
              Date de fin
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => updateFilter('dateTo', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Tri */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Trier par</Label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un critère de tri" />
              </SelectTrigger>
              <SelectContent>
                {config.sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Ordre</Label>
            <Select 
              value={filters.sortOrder} 
              onValueChange={(value: 'asc' | 'desc') => updateFilter('sortOrder', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">
                  <div className="flex items-center gap-2">
                    <SortAsc className="h-4 w-4" />
                    Croissant
                  </div>
                </SelectItem>
                <SelectItem value="desc">
                  <div className="flex items-center gap-2">
                    <SortDesc className="h-4 w-4" />
                    Décroissant
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtres additionnels spécifiques à la table */}
        {config.additionalFilters.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.additionalFilters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <Label className="text-sm font-medium">{filter.label}</Label>
                <Select 
                  value={filters[filter.key as keyof typeof filters] || ''} 
                  onValueChange={(value) => updateFilter(filter.key, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Choisir ${filter.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous</SelectItem>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}

        {/* Filtres actifs */}
        {activeFilters.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Filtres actifs</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Tout réinitialiser
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge 
                  key={filter.key} 
                  variant="secondary" 
                  className="flex items-center gap-1 pr-1"
                >
                  <span className="text-xs">
                    <strong>{filter.label}:</strong> {filter.value}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilter(filter.key)}
                    className="h-4 w-4 p-0 hover:bg-gray-200 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onReset}
            disabled={isLoading}
          >
            Réinitialiser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}