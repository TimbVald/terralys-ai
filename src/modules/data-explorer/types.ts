/**
 * Types et interfaces pour le module data-explorer
 * Définit les structures de données pour la visualisation et le filtrage des données
 */

// ========================================
// TYPES GÉNÉRAUX POUR LA VISUALISATION
// ========================================

/**
 * Interface pour les options de filtrage
 */
export interface FilterOptions {
  field: string;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between' | 'in';
  value: any;
  secondValue?: any; // Pour l'opérateur 'between'
}

/**
 * Interface pour les options de tri
 */
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Interface pour les options de pagination
 */
export interface PaginationOptions {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Interface pour les options de visualisation
 */
export interface VisualizationOptions {
  type: 'table' | 'cards' | 'list' | 'chart';
  chartType?: 'bar' | 'line' | 'pie' | 'scatter';
  groupBy?: string[];
  aggregation?: {
    field: string;
    function: 'sum' | 'avg' | 'count' | 'min' | 'max';
  };
}

/**
 * Interface pour les métadonnées des champs
 */
export interface FieldMetadata {
  name: string;
  displayName: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
  filterable: boolean;
  sortable: boolean;
  searchable: boolean;
  visible: boolean;
  width?: number;
  format?: string;
  options?: { label: string; value: any }[];
}

/**
 * Interface pour les métadonnées des modules
 */
export interface ModuleMetadata {
  name: string;
  displayName: string;
  description: string;
  fields: FieldMetadata[];
  defaultSort?: SortOptions;
  defaultFilters?: FilterOptions[];
  defaultVisualization?: VisualizationOptions;
}

/**
 * Interface pour l'état global du data explorer
 */
export interface DataExplorerState {
  selectedModule: string;
  filters: FilterOptions[];
  sort: SortOptions[];
  pagination: PaginationOptions;
  visualization: VisualizationOptions;
  searchQuery: string;
  data: any[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Interface pour les préférences utilisateur
 */
export interface UserPreferences {
  savedViews: {
    id: string;
    name: string;
    module: string;
    filters: FilterOptions[];
    sort: SortOptions[];
    visualization: VisualizationOptions;
  }[];
  defaultPageSize: number;
  defaultVisualization: 'table' | 'cards' | 'list' | 'chart';
  columnVisibility: Record<string, Record<string, boolean>>;
}