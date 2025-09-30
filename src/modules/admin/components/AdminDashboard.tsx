'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Users, 
  Bot, 
  Calendar, 
  Leaf, 
  BarChart3, 
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { DataTable } from './DataTable';
// import { DataFilters } from './DataFilters';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

/**
 * Interface pour les statistiques globales
 */
interface GlobalStats {
  totalUsers: number;
  totalAgents: number;
  totalMeetings: number;
  totalAnalyses: number;
  recentUsers: number;
  recentAnalyses: number;
  activeSessions: number;
  period: 'day' | 'week' | 'month' | 'year';
}

/**
 * Configuration des tables disponibles
 */
const tableConfigs = {
  users: {
    label: 'Utilisateurs',
    icon: Users,
    description: 'Gestion des comptes utilisateurs',
    color: 'bg-blue-500',
  },
  agents: {
    label: 'Agents IA',
    icon: Bot,
    description: 'Agents d\'intelligence artificielle',
    color: 'bg-purple-500',
  },
  meetings: {
    label: 'Réunions',
    icon: Calendar,
    description: 'Sessions et réunions',
    color: 'bg-green-500',
  },
  plantAnalyses: {
    label: 'Analyses de plantes',
    icon: Leaf,
    description: 'Détection des maladies des plantes',
    color: 'bg-emerald-500',
  },
};

/**
 * Filtres par défaut
 */
const defaultFilters = {
  search: '',
  dateFrom: '',
  dateTo: '',
  sortBy: 'createdAt',
  sortOrder: 'desc' as const,
  status: '',
  service: '',
  severity: '',
};

/**
 * Composant principal AdminDashboard
 */
export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>('users');
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');

  // Requêtes tRPC
  const trpc = useTRPC();
  const { data: stats = { 
    totalUsers: 0, 
    totalAgents: 0, 
    totalMeetings: 0, 
    totalAnalyses: 0,
    recentUsers: 0,
    recentAnalyses: 0,
    activeSessions: 0,
    period: 'week'
  } } = useQuery(trpc.admin.getGlobalStats.queryOptions({ period }));

  /**
   * Changement de table active
   */
  const handleTableChange = (table: string) => {
    setActiveTab(table);
  };

  /**
   * Rendu des statistiques globales
   */
  const renderStats = () => {
    if (!stats) {
      return null;
    }

    const statCards = [
      {
        title: 'Utilisateurs',
        value: stats.totalUsers,
        icon: Users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      },
      {
        title: 'Agents IA',
        value: stats.totalAgents,
        icon: Bot,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
      },
      {
        title: 'Réunions',
        value: stats.totalMeetings,
        icon: Calendar,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      },
      {
        title: 'Analyses',
        value: stats.totalAnalyses,
        icon: Leaf,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  /**
   * Rendu de l'indicateur de santé du système
   */
  const renderSystemHealth = () => {
    if (!stats) return null;

    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">État du système</h3>
                <p className="text-sm text-gray-600">Système opérationnel</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total utilisateurs</p>
                <p className="font-semibold">{stats.totalUsers}</p>
              </div>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Database className="h-8 w-8 text-blue-600" />
              Administration
            </h1>
            <p className="text-gray-600 mt-1">
              Gestion et visualisation des données de l'application
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              En temps réel
            </Badge>
          </div>
        </div>

        {/* Statistiques globales */}
        {renderStats()}

        {/* Indicateur de santé du système */}
        {renderSystemHealth()}

        {/* Interface principale */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Filtres */}
          <div className="xl:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Filtres</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Filtres disponibles prochainement</p>
              </CardContent>
            </Card>
          </div>

          {/* Données */}
          <div className="xl:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Données de la base
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <Tabs value={activeTab} onValueChange={handleTableChange}>
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
                    {Object.entries(tableConfigs).map(([key, config]) => (
                      <TabsTrigger 
                        key={key} 
                        value={key}
                        className="flex items-center gap-2 text-xs md:text-sm"
                      >
                        <config.icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{config.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {Object.keys(tableConfigs).map((table) => (
                    <TabsContent key={table} value={table} className="mt-0">
                      <DataTable
                        table={table as keyof typeof tableConfigs}
                        title={tableConfigs[table as keyof typeof tableConfigs].label}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}