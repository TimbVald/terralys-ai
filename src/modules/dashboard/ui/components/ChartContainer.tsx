/**
 * Composants de graphiques pour le dashboard
 * Utilise Recharts pour créer des visualisations interactives
 */

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { cn } from '@/lib/utils';
import type { TimeSeriesData, DistributionData } from '../../types';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  height?: number;
  loading?: boolean;
  error?: string;
}

/**
 * Container de base pour tous les graphiques
 */
export function ChartContainer({
  title,
  children,
  className,
  height = 300,
  loading = false,
  error
}: ChartContainerProps) {
  if (loading) {
    return (
      <div className={cn("bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6", className)}>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">{title}</h3>
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6", className)}>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">{title}</h3>
        <div className="flex items-center justify-center text-red-600 text-sm sm:text-base" style={{ height }}>
          <p>Erreur lors du chargement des données</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6", className)}>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">{title}</h3>
      <div style={{ height }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Graphique en ligne pour les tendances temporelles
 */
interface LineChartProps {
  title: string;
  data: TimeSeriesData[];
  dataKey: string;
  color?: string;
  className?: string;
  height?: number;
  loading?: boolean;
  error?: string;
}

export function TimeSeriesLineChart({
  title,
  data,
  dataKey = 'value',
  color = '#3B82F6',
  className,
  height = 300,
  loading,
  error
}: LineChartProps) {
  return (
    <ChartContainer
      title={title}
      className={className}
      height={height}
      loading={loading}
      error={error}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            fontSize={10}
            className="sm:text-xs"
            tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { 
              month: 'short', 
              day: 'numeric' 
            })}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke="#6B7280" 
            fontSize={10}
            className="sm:text-xs"
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontSize: '12px'
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: color, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

/**
 * Graphique en aires pour les tendances avec remplissage
 */
export function TimeSeriesAreaChart({
  title,
  data,
  dataKey = 'value',
  color = '#3B82F6',
  className,
  height = 300,
  loading,
  error
}: LineChartProps) {
  return (
    <ChartContainer
      title={title}
      className={className}
      height={height}
      loading={loading}
      error={error}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            fontSize={10}
            className="sm:text-xs"
            tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { 
              month: 'short', 
              day: 'numeric' 
            })}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke="#6B7280" 
            fontSize={10}
            className="sm:text-xs"
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontSize: '12px'
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill={`${color}20`}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

/**
 * Graphique en barres pour les comparaisons
 */
interface BarChartProps {
  title: string;
  data: any[];
  dataKey: string;
  nameKey?: string;
  color?: string;
  className?: string;
  height?: number;
  loading?: boolean;
  error?: string;
}

export function SimpleBarChart({
  title,
  data,
  dataKey,
  nameKey = 'name',
  color = '#3B82F6',
  className,
  height = 300,
  loading,
  error
}: BarChartProps) {
  return (
    <ChartContainer
      title={title}
      className={className}
      height={height}
      loading={loading}
      error={error}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey={nameKey} 
            stroke="#6B7280" 
            fontSize={10}
            className="sm:text-xs"
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            stroke="#6B7280" 
            fontSize={10}
            className="sm:text-xs"
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontSize: '12px'
            }}
          />
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

/**
 * Graphique en secteurs pour les distributions
 */
interface PieChartProps {
  title: string;
  data: DistributionData[];
  className?: string;
  height?: number;
  loading?: boolean;
  error?: string;
  showLegend?: boolean;
}

export function DistributionPieChart({
  title,
  data,
  className,
  height = 300,
  loading,
  error,
  showLegend = true
}: PieChartProps) {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <ChartContainer
      title={title}
      className={className}
      height={height}
      loading={loading}
      error={error}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ label, percentage }) => `${label}: ${percentage.toFixed(1)}%`}
            outerRadius={Math.min(height * 0.25, 80)}
            fill="#8884d8"
            dataKey="value"
            fontSize={10}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontSize: '12px'
            }}
            formatter={(value: number, name: string) => [
              `${value} (${((value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)`,
              name
            ]}
          />
          {showLegend && (
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconSize={8}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

/**
 * Graphique en donut pour les distributions avec centre personnalisé
 */
export function DonutChart({
  title,
  data,
  className,
  height = 300,
  loading,
  error,
  centerContent
}: PieChartProps & { centerContent?: React.ReactNode }) {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <ChartContainer
      title={title}
      className={className}
      height={height}
      loading={loading}
      error={error}
    >
      <div className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={Math.min(height * 0.15, 60)}
              outerRadius={Math.min(height * 0.25, 100)}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '12px'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
        {centerContent && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              {centerContent}
            </div>
          </div>
        )}
      </div>
    </ChartContainer>
  );
}