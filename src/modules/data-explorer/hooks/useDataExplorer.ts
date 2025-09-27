"use client"
import { useState, useEffect, useMemo } from 'react';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

/**
 * Options pour le data explorer
 */
export interface DataExplorerOptions {
  table: string;
  search?: string;
  page: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: Record<string, string>;
}

/**
 * Hook pour explorer les données des différentes tables
 * Utilise TRPC pour récupérer les données depuis le serveur
 */
export function useDataExplorer(options: DataExplorerOptions) {
  // État local pour les options
  const [currentOptions, setCurrentOptions] = useState<DataExplorerOptions>(options);
  
  // Récupération des tables disponibles
  const trpc = useTRPC();
  const tablesQuery = useQuery({
    queryKey: ['dataExplorer', 'getAvailableTables'],
    queryFn: async () => {
      // Utiliser une approche sécurisée pour contourner les erreurs de typage
      const client = trpc as any;
      return client.dataExplorer.getAvailableTables.query();
    }
  });
  const availableTables = tablesQuery.data || [];
  
  // Récupération des données avec TRPC
  const dataQuery = useQuery({
    queryKey: ['dataExplorer', 'getData', currentOptions],
    queryFn: async () => {
      // Utiliser une approche sécurisée pour contourner les erreurs de typage
      const client = trpc as any;
      return client.dataExplorer.getData.query(currentOptions);
    },
    enabled: !!currentOptions.table,
    staleTime: 5000,
    refetchOnWindowFocus: false
  });
  
  // Mise à jour des options
  useEffect(() => {
    setCurrentOptions(options);
  }, [options]);
  
  // Fonction pour mettre à jour les options
  const updateOptions = (newOptions: Partial<DataExplorerOptions>) => {
    setCurrentOptions(prev => ({
      ...prev,
      ...newOptions,
      // Réinitialiser la page à 1 si on change autre chose que la page
      page: newOptions.page !== undefined || 
            (Object.keys(newOptions).length === 1 && 'page' in newOptions) 
            ? (newOptions.page || prev.page) 
            : 1
    }));
  };
  
  // Fonction pour changer de table
  const changeTable = (table: string) => {
    updateOptions({ table, page: 1 });
  };
  
  // Fonction pour changer la recherche
  const setSearch = (search: string) => {
    updateOptions({ search, page: 1 });
  };
  
  // Fonction pour changer la page
  const setPage = (page: number) => {
    updateOptions({ page });
  };
  
  // Fonction pour changer la taille de page
  const setPageSize = (pageSize: number) => {
    updateOptions({ pageSize, page: 1 });
  };
  
  // Fonction pour changer le tri
  const setSorting = (sortField: string, sortDirection: 'asc' | 'desc' = 'asc') => {
    updateOptions({ sortField, sortDirection, page: 1 });
  };
  
  // Fonction pour ajouter/modifier un filtre
  const setFilter = (key: string, value: string) => {
    updateOptions({
      filters: { ...(currentOptions.filters || {}), [key]: value },
      page: 1
    });
  };
  
  // Fonction pour supprimer un filtre
  const removeFilter = (key: string) => {
    if (!currentOptions.filters) return;
    
    const newFilters = { ...currentOptions.filters };
    delete newFilters[key];
    
    updateOptions({
      filters: Object.keys(newFilters).length > 0 ? newFilters : undefined,
      page: 1
    });
  };
  
  // Fonction pour réinitialiser tous les filtres
  const resetFilters = () => {
    updateOptions({
      search: undefined,
      filters: undefined,
      sortField: undefined,
      sortDirection: undefined,
      page: 1
    });
  };
  
  // Fonction pour exporter les données en CSV
  const exportToCsv = async () => {
    const queryData = dataQuery.data as any;
    if (!queryData?.data) return null;
    
    // Récupérer toutes les données (sans pagination)
    const allDataOptions = {
      ...currentOptions,
      page: 1,
      pageSize: 1000 // Limite arbitraire, à ajuster selon les besoins
    };
    
    try {
      // Utiliser une approche sécurisée pour contourner les erreurs de typage
      const client = trpc as any;
      const result = await client.dataExplorer.getData.query(allDataOptions);
      const data = result.data;
      
      if (!data || data.length === 0) return null;
      
      // Obtenir les en-têtes à partir des clés du premier objet
      const headers = Object.keys(data[0]);
      
      // Créer les lignes CSV
      const csvRows = [
        headers.join(','), // En-têtes
        ...data.map((row: Record<string, any>) =>
          headers.map(header => {
            const value = row[header];
            // Échapper les virgules et les guillemets
            return typeof value === 'string' 
              ? `"${value.replace(/"/g, '""')}"` 
              : value;
          }).join(',')
        )
      ];
      
      // Joindre les lignes avec des sauts de ligne
      const csvContent = csvRows.join('\n');
      
      // Créer un Blob et un lien de téléchargement
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${currentOptions.table}_export.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return url;
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
      return null;
    }
  };
  
  // Données formatées pour l'affichage
  const formattedData = useMemo(() => {
    const queryData = dataQuery.data as any || {};
    return {
      data: queryData.data || [],
      total: queryData.total || 0,
      page: queryData.page || currentOptions.page,
      pageSize: queryData.pageSize || currentOptions.pageSize,
      pageCount: queryData.pageCount || 0,
      isLoading: dataQuery.isLoading,
      isError: dataQuery.isError,
      error: dataQuery.error
    };
  }, [dataQuery, currentOptions]);
  
  return {
    // Données et état
    ...formattedData,
    
    // Options actuelles
    options: currentOptions,
    
    // Métadonnées
    availableTables,
    isTablesLoading: tablesQuery.isLoading,
    
    // Actions
    changeTable,
    setSearch,
    setPage,
    setPageSize,
    setSorting,
    setFilter,
    removeFilter,
    resetFilters,
    exportToCsv
  };
}