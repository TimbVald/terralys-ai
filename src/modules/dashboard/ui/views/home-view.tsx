"use client"

/**
 * Vue principale du dashboard affichant les statistiques de tous les modules
 * Présente une vue d'ensemble complète des métriques clés
 */

import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Leaf, 
  TrendingUp, 
  Activity, 
  AlertCircle,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { MetricCard, MetricGrid } from '../components/MetricCard';
import { 
  TimeSeriesLineChart, 
  TimeSeriesAreaChart, 
  DistributionPieChart,
  SimpleBarChart 
} from '../components/ChartContainer';
import { DataTable, StatusBadge, RelativeDate } from '../components/DataTable';
import type { StatsFilters, TimePeriod } from '../../types';

export const HomeView = () => {
  // État pour les filtres
  const [filters, setFilters] = useState<Partial<StatsFilters>>({
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 jours
      to: new Date()
    },
    modules: ['agents', 'meetings', 'plantDisease'],
    refreshInterval: 10 * 60 * 1000 // 10 minutes
  });

  // Récupération des données
  const stats = useDashboardStats(filters);

  /**
   * Gestion du rafraîchissement des données
   */
  const handleRefresh = () => {
    // Le hook se charge automatiquement du rafraîchissement
    window.location.reload();
  };

  /**
   * Gestion de l'export des données
   */
  const handleExport = () => {
    if (!stats) return;
    
    const dataStr = JSON.stringify(stats, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-stats-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Vérification de la disponibilité des données
  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <p className="text-red-600 mb-4">Aucune donnée disponible</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Actualiser
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Préparation des métriques pour l'affichage
  const globalMetrics = [
    {
      title: "Total Agents",
      data: stats.agents.overview.totalAgents,
      icon: <Users className="w-5 h-5" />,
      format: 'number' as const
    },
    {
      title: "Réunions Totales",
      data: stats.meetings.overview.totalMeetings,
      icon: <Calendar className="w-5 h-5" />,
      format: 'number' as const
    },
    {
      title: "Analyses Plantes",
      data: stats.plantDisease.overview.totalAnalyses,
      icon: <Leaf className="w-5 h-5" />,
      format: 'number' as const
    },
    {
      title: "Durée Moyenne Réunions",
      data: stats.meetings.overview.averageDuration,
      icon: <Activity className="w-5 h-5" />,
      format: 'duration' as const
    }
  ];

  // Préparation des données pour les tableaux
  const recentMeetingsColumns = [
    { key: 'name' as const, title: 'Nom', sortable: true },
    { key: 'agentName' as const, title: 'Agent', sortable: true },
    { 
      key: 'status' as const, 
      title: 'Statut', 
      sortable: true,
      render: (status: string) => (
        <StatusBadge 
          status={status} 
          variant={status === 'completed' ? 'success' : status === 'in_progress' ? 'info' : 'default'} 
        />
      )
    },
    { 
      key: 'duration' as const, 
      title: 'Durée', 
      render: (duration: number) => duration ? `${Math.round(duration)}min` : '-'
    },
    { 
      key: 'createdAt' as const, 
      title: 'Créé', 
      render: (date: string) => <RelativeDate date={date} />
    }
  ];

  const recentAnalysesColumns = [
    { key: 'plantName' as const, title: 'Plante', sortable: true },
    { 
      key: 'isHealthy' as const, 
      title: 'État', 
      render: (isHealthy: boolean) => (
        <StatusBadge 
          status={isHealthy ? 'Saine' : 'Malade'} 
          variant={isHealthy ? 'success' : 'error'} 
        />
      )
    },
    { key: 'diseaseName' as const, title: 'Maladie', render: (name: string) => name || '-' },
    { 
      key: 'confidenceScore' as const, 
      title: 'Confiance', 
      render: (score: number) => `${(score * 100).toFixed(1)}%`
    },
    { key: 'service' as const, title: 'Service', sortable: true },
    { 
      key: 'createdAt' as const, 
      title: 'Analysé', 
      render: (date: string) => <RelativeDate date={date} />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Terralys</h1>
              <p className="text-gray-600">Vue d'ensemble des statistiques des modules</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Actualiser</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                <span>Exporter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Métriques globales */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vue d'ensemble</h2>
          <MetricGrid metrics={globalMetrics} columns={4} />
        </section>

        {/* Graphiques de tendances */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tendances</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TimeSeriesLineChart
              title="Création d'agents"
              data={stats.agents.trends.agentsCreated}
              dataKey="value"
              color="#3B82F6"
            />
            <TimeSeriesAreaChart
              title="Réunions créées"
              data={stats.meetings.trends.meetingsCreated}
              dataKey="value"
              color="#10B981"
            />
            <TimeSeriesLineChart
              title="Analyses de plantes"
              data={stats.plantDisease.trends.analysesPerformed}
              dataKey="value"
              color="#F59E0B"
            />
            <TimeSeriesAreaChart
              title="Ratio de santé des plantes"
              data={stats.plantDisease.trends.healthRatio}
              dataKey="value"
              color="#8B5CF6"
            />
          </div>
        </section>

        {/* Distributions */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Distributions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DistributionPieChart
              title="Statuts des réunions"
              data={stats.meetings.statusDistribution}
              height={250}
            />
            <DistributionPieChart
              title="Services d'analyse"
              data={stats.plantDisease.serviceDistribution}
              height={250}
            />
            <DistributionPieChart
              title="Sévérité des maladies"
              data={stats.plantDisease.severityDistribution}
              height={250}
            />
          </div>
        </section>

        {/* Top performers */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performances</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimpleBarChart
              title="Top Agents (par réunions)"
              data={stats.agents.topAgents.map((agent: any) => ({
                name: agent.name,
                value: agent.meetingCount
              }))}
              dataKey="value"
              nameKey="name"
              color="#3B82F6"
            />
            <SimpleBarChart
              title="Top Plantes (par analyses)"
              data={stats.plantDisease.topPlants.map((plant: any) => ({
                name: plant.plantName,
                value: plant.analysisCount
              }))}
              dataKey="value"
              nameKey="name"
              color="#10B981"
            />
          </div>
        </section>

        {/* Données récentes */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Activité récente</h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <DataTable
              title="Réunions récentes"
              data={stats.meetings.recentMeetings}
              columns={recentMeetingsColumns}
              searchable
              pageSize={5}
            />
            <DataTable
              title="Analyses récentes"
              data={stats.plantDisease.recentAnalyses}
              columns={recentAnalysesColumns}
              searchable
              pageSize={5}
            />
          </div>
        </section>

        {/* Informations de mise à jour */}
        <div className="text-center text-sm text-gray-500">
          Dernière mise à jour : {new Date(stats.lastUpdated).toLocaleString('fr-FR')}
        </div>
      </div>
    </div>
  );
};