/**
 * Types et interfaces pour le module dashboard
 * Définit les structures de données pour les statistiques des différents modules
 */

// ========================================
// TYPES GÉNÉRAUX POUR LES STATISTIQUES
// ========================================

/**
 * Interface de base pour les métriques de performance
 */
export interface BaseMetrics {
  total: number;
  growth: number; // Pourcentage de croissance par rapport à la période précédente
  trend: 'up' | 'down' | 'stable';
}

/**
 * Interface pour les données temporelles
 */
export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

/**
 * Interface pour les données de distribution
 */
export interface DistributionData {
  label: string;
  value: number;
  percentage: number;
  color?: string;
}

// ========================================
// STATISTIQUES DU MODULE AGENTS
// ========================================

/**
 * Statistiques complètes du module agents
 */
export interface AgentsStats {
  overview: {
    totalAgents: BaseMetrics;
    activeAgents: BaseMetrics;
    averageMeetingsPerAgent: BaseMetrics;
  };
  trends: {
    agentsCreated: TimeSeriesData[];
    agentUsage: TimeSeriesData[];
  };
  topAgents: Array<{
    id: string;
    name: string;
    meetingCount: number;
    lastUsed: string;
  }>;
}

// ========================================
// STATISTIQUES DU MODULE MEETINGS
// ========================================

/**
 * Statistiques complètes du module meetings
 */
export interface MeetingsStats {
  overview: {
    totalMeetings: BaseMetrics;
    completedMeetings: BaseMetrics;
    averageDuration: BaseMetrics;
    totalDuration: BaseMetrics;
  };
  trends: {
    meetingsCreated: TimeSeriesData[];
    meetingDuration: TimeSeriesData[];
  };
  statusDistribution: DistributionData[];
  recentMeetings: Array<{
    id: string;
    name: string;
    agentName: string;
    status: string;
    duration?: number;
    createdAt: string;
  }>;
}

// ========================================
// STATISTIQUES DU MODULE PLANT DISEASE DETECTION
// ========================================

/**
 * Statistiques complètes du module plant disease detection
 */
export interface PlantDiseaseStats {
  overview: {
    totalAnalyses: BaseMetrics;
    healthyPlants: BaseMetrics;
    diseasedPlants: BaseMetrics;
    averageConfidence: BaseMetrics;
  };
  trends: {
    analysesPerformed: TimeSeriesData[];
    healthRatio: TimeSeriesData[];
    confidenceScores: TimeSeriesData[];
  };
  serviceDistribution: DistributionData[];
  severityDistribution: DistributionData[];
  topPlants: Array<{
    plantName: string;
    analysisCount: number;
    healthyPercentage: number;
  }>;
  recentAnalyses: Array<{
    id: string;
    plantName: string;
    isHealthy: boolean;
    diseaseName?: string;
    confidenceScore: number;
    service: string;
    createdAt: string;
  }>;
}

// ========================================
// STATISTIQUES GLOBALES DU DASHBOARD
// ========================================

/**
 * Interface principale pour toutes les statistiques du dashboard
 */
export interface DashboardStats {
  agents: AgentsStats;
  meetings: MeetingsStats;
  plantDisease: PlantDiseaseStats;
  lastUpdated: string;
}

/**
 * Interface pour les métriques de performance globales
 */
export interface GlobalMetrics {
  totalUsers: number;
  totalActivities: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
  uptime: number;
}

/**
 * Interface pour les alertes et notifications
 */
export interface DashboardAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  module: 'agents' | 'meetings' | 'plantDisease' | 'system';
}

/**
 * Interface pour les paramètres de filtrage des statistiques
 */
export interface StatsFilters {
  dateRange: {
    from: Date;
    to: Date;
  };
  modules: Array<'agents' | 'meetings' | 'plantDisease'>;
  refreshInterval: number; // en millisecondes
}

/**
 * Interface pour les données de comparaison temporelle
 */
export interface ComparisonData {
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
  period: string;
}

/**
 * Type pour les périodes de temps disponibles
 */
export type TimePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';

/**
 * Interface pour les données d'export
 */
export interface ExportData {
  format: 'csv' | 'json' | 'pdf';
  data: DashboardStats;
  filters: StatsFilters;
  generatedAt: string;
}