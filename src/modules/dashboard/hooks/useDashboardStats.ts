/**
 * Hook principal pour récupérer toutes les statistiques du dashboard
 * Combine les données de tous les modules pour fournir une vue d'ensemble
 */

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTRPC } from '@/trpc/client';
import type { 
  DashboardStats, 
  AgentsStats, 
  MeetingsStats, 
  PlantDiseaseStats,
  StatsFilters,
  TimePeriod 
} from '../types';

/**
 * Hook pour récupérer les statistiques des agents
 * Les données sont automatiquement filtrées par utilisateur connecté via les procédures TRPC
 */
export function useAgentsStats(filters?: Partial<StatsFilters>) {
  const trpc = useTRPC();
  
  // Récupération des agents de l'utilisateur connecté
  const { data: agentsData } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
    page: 1,
    pageSize: 100,
  }));

  return useMemo((): AgentsStats => {
    const agents = agentsData?.items || [];

      // Calcul des métriques de base
      const totalAgents = agents.length;
      const activeAgents = (agents as any[]).filter((agent: any) => 
        new Date(agent.updatedAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 // Actif dans les 30 derniers jours
      ).length;

      // Données mockées pour les tendances (à remplacer par de vraies données quand disponibles)
      const agentsStats: AgentsStats = {
        overview: {
          totalAgents: { total: totalAgents, growth: 8.5, trend: 'up' },
          activeAgents: { total: activeAgents, growth: 12.3, trend: 'up' },
          averageMeetingsPerAgent: { total: 4.2, growth: -2.1, trend: 'down' }
        },
        trends: {
          agentsCreated: [
            { date: '2024-01-01', value: 2 },
            { date: '2024-01-02', value: 3 },
            { date: '2024-01-03', value: 1 },
            { date: '2024-01-04', value: 4 },
            { date: '2024-01-05', value: 2 }
          ],
          agentUsage: [
            { date: '2024-01-01', value: 15 },
            { date: '2024-01-02', value: 23 },
            { date: '2024-01-03', value: 18 },
            { date: '2024-01-04', value: 31 },
            { date: '2024-01-05', value: 27 }
          ]
        },
        topAgents: (agents as any[]).slice(0, 5).map((agent: any, index: number) => ({
          id: agent.id,
          name: agent.name,
          meetingCount: Math.floor(Math.random() * 20), // À remplacer par de vraies données
          lastUsed: agent.updatedAt
        }))
      };
      
    return agentsStats;
  }, [agentsData, filters]);
}

/**
 * Hook pour récupérer les statistiques des réunions
 * Les données sont automatiquement filtrées par utilisateur connecté via les procédures TRPC
 */
export function useMeetingsStats(filters?: Partial<StatsFilters>) {
  const trpc = useTRPC();
  
  // Récupération des réunions de l'utilisateur connecté
  const { data: meetingsData } = useSuspenseQuery(trpc.meeting.getMany.queryOptions({
    page: 1,
    pageSize: 100,
  }));

  return useMemo((): MeetingsStats => {
    const meetings = meetingsData?.items || [];

      // Calcul des métriques de base
      const totalMeetings = meetings.length;
      const completedMeetings = (meetings as any[]).filter((meeting: any) => meeting.status === 'completed').length;
      const totalDuration = (meetings as any[]).reduce((sum: number, meeting: any) => sum + (meeting.duration || 0), 0);
      const averageDuration = totalMeetings > 0 ? totalDuration / totalMeetings : 0;

      // Distribution des statuts
      const statusCounts = (meetings as any[]).reduce((acc: Record<string, number>, meeting: any) => {
        acc[meeting.status] = (acc[meeting.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statusDistribution = Object.entries(statusCounts).map(([status, count]: [string, number]) => ({
        label: status === 'completed' ? 'Terminé' : 
               status === 'in_progress' ? 'En cours' : 
               status === 'scheduled' ? 'Planifié' : status,
        value: count,
        percentage: (count / totalMeetings) * 100,
        color: getStatusColor(status)
      }));

      // Réunions récentes
      const recentMeetings = (meetings as any[])
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map((meeting: any) => ({
          id: meeting.id,
          name: meeting.name,
          agentName: meeting.agent?.name || 'Agent inconnu',
          status: meeting.status,
          duration: meeting.duration || 0,
          createdAt: meeting.createdAt
        }));

      const meetingsStats: MeetingsStats = {
        overview: {
          totalMeetings: { total: totalMeetings, growth: 15.2, trend: 'up' },
          completedMeetings: { total: completedMeetings, growth: 12.8, trend: 'up' },
          averageDuration: { total: averageDuration, growth: -5.3, trend: 'down' },
          totalDuration: { total: totalDuration, growth: 8.7, trend: 'up' }
        },
        trends: {
          meetingsCreated: [
            { date: '2024-01-01', value: 8 },
            { date: '2024-01-02', value: 12 },
            { date: '2024-01-03', value: 6 },
            { date: '2024-01-04', value: 15 },
            { date: '2024-01-05', value: 4 }
          ],
          meetingDuration: [
            { date: '2024-01-01', value: 28.5 },
            { date: '2024-01-02', value: 35.2 },
            { date: '2024-01-03', value: 31.8 },
            { date: '2024-01-04', value: 29.7 },
            { date: '2024-01-05', value: 33.1 }
          ]
        },
        statusDistribution,
        recentMeetings
      };
      
    return meetingsStats;
  }, [meetingsData, filters]);
}

/**
 * Hook pour récupérer les statistiques de détection des maladies des plantes
 * Les données sont automatiquement filtrées par utilisateur connecté via les procédures TRPC
 */
export function usePlantDiseaseStats(filters?: Partial<StatsFilters>) {
  const trpc = useTRPC();
  
  // Récupération des données via TRPC
  const { data: analysesData } = useSuspenseQuery(trpc.plantDiseaseDetection.getAnalyses.queryOptions({
    page: 1,
    pageSize: 100,
  }));

  return useMemo((): PlantDiseaseStats => {
    const analyses = analysesData?.items || [];

      // Calcul des métriques de base
      const totalAnalyses = analyses.length;
      const healthyPlants = (analyses as any[]).filter((analysis: any) => analysis.isHealthy).length;
      const diseasedPlants = totalAnalyses - healthyPlants;
      const averageConfidence = totalAnalyses > 0 
        ? (analyses as any[]).reduce((sum: number, analysis: any) => sum + analysis.confidenceScore, 0) / totalAnalyses 
        : 0;

      // Distribution par service
      const serviceCounts = (analyses as any[]).reduce((acc: Record<string, number>, analysis: any) => {
        acc[analysis.service] = (acc[analysis.service] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const serviceDistribution = Object.entries(serviceCounts).map(([service, count]: [string, number]) => ({
        label: service,
        value: count,
        percentage: (count / totalAnalyses) * 100,
        color: service === 'api' ? '#10b981' : service === 'web' ? '#3b82f6' : '#f59e0b'
      }));

      // Distribution par sévérité (données mockées car pas dans le schéma actuel)
      const severityDistribution = [
        { label: 'Faible', value: Math.floor(totalAnalyses * 0.3), percentage: 30, color: '#10b981' },
        { label: 'Modérée', value: Math.floor(totalAnalyses * 0.4), percentage: 40, color: '#f59e0b' },
        { label: 'Élevée', value: Math.floor(totalAnalyses * 0.3), percentage: 30, color: '#ef4444' }
      ];

      // Top plantes analysées
      const plantCounts = (analyses as any[]).reduce((acc: Record<string, { count: number; healthy: number }>, analysis: any) => {
        acc[analysis.plantName] = (acc[analysis.plantName] || { count: 0, healthy: 0 });
        acc[analysis.plantName].count++;
        if (analysis.isHealthy) acc[analysis.plantName].healthy++;
        return acc;
      }, {} as Record<string, { count: number; healthy: number }>);

      const topPlants = Object.entries(plantCounts)
        .map(([plantName, data]: [string, { count: number; healthy: number }]) => ({
          plantName,
          analysisCount: data.count,
          healthyPercentage: (data.healthy / data.count) * 100
        }))
        .sort((a: any, b: any) => b.analysisCount - a.analysisCount)
        .slice(0, 5);

      // Analyses récentes
      const recentAnalyses = analyses
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map((analysis: any) => ({
          id: analysis.id,
          plantName: analysis.plantName,
          isHealthy: analysis.isHealthy,
          diseaseName: analysis.diseaseName || undefined,
          confidenceScore: analysis.confidenceScore,
          service: analysis.service,
          createdAt: analysis.createdAt
        }));

      const plantDiseaseStats: PlantDiseaseStats = {
        overview: {
          totalAnalyses: { total: totalAnalyses, growth: 22.4, trend: 'up' },
          healthyPlants: { total: healthyPlants, growth: 18.7, trend: 'up' },
          diseasedPlants: { total: diseasedPlants, growth: 28.9, trend: 'up' },
          averageConfidence: { total: averageConfidence, growth: 3.2, trend: 'up' }
        },
        trends: {
          analysesPerformed: [
            { date: '2024-01-01', value: 12 },
            { date: '2024-01-02', value: 18 },
            { date: '2024-01-03', value: 15 },
            { date: '2024-01-04', value: 22 },
            { date: '2024-01-05', value: 19 }
          ],
          healthRatio: [
            { date: '2024-01-01', value: 66.7 },
            { date: '2024-01-02', value: 61.1 },
            { date: '2024-01-03', value: 60.0 },
            { date: '2024-01-04', value: 63.6 },
            { date: '2024-01-05', value: 63.2 }
          ],
          confidenceScores: [
            { date: '2024-01-01', value: 85.2 },
            { date: '2024-01-02', value: 87.8 },
            { date: '2024-01-03', value: 86.5 },
            { date: '2024-01-04', value: 88.1 },
            { date: '2024-01-05', value: 87.3 }
          ]
        },
        serviceDistribution,
        severityDistribution,
        topPlants,
        recentAnalyses
      };

    return plantDiseaseStats;
  }, [analysesData, filters]);
}

/**
 * Hook principal pour récupérer toutes les statistiques du dashboard
 */
export function useDashboardStats(filters?: Partial<StatsFilters>) {
  const agentsStats = useAgentsStats(filters);
  const meetingsStats = useMeetingsStats(filters);
  const plantDiseaseStats = usePlantDiseaseStats(filters);

  return useMemo(() => {
    const dashboardStats: DashboardStats = {
      agents: agentsStats,
      meetings: meetingsStats,
      plantDisease: plantDiseaseStats,
      lastUpdated: new Date().toISOString()
    };

    return dashboardStats;
  }, [agentsStats, meetingsStats, plantDiseaseStats]);
}

// ========================================
// FONCTIONS UTILITAIRES
// ========================================

/**
 * Retourne la couleur associée à un statut de réunion
 */
function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'completed': '#10B981',
    'in_progress': '#3B82F6',
    'scheduled': '#F59E0B',
    'cancelled': '#EF4444',
    'draft': '#6B7280'
  };
  return colors[status] || '#6B7280';
}

/**
 * Retourne la couleur associée à un service d'analyse
 */
function getServiceColor(service: string): string {
  const colors: Record<string, string> = {
    'openai': '#10B981',
    'gemini': '#3B82F6',
    'claude': '#8B5CF6',
    'local': '#F59E0B'
  };
  return colors[service] || '#6B7280';
}