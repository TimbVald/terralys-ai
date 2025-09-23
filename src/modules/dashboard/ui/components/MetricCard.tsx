/**
 * Composant MetricCard pour afficher une métrique avec sa tendance
 * Utilisé pour présenter les statistiques clés de manière visuelle
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BaseMetrics } from '../../types';

interface MetricCardProps {
  title: string;
  metrics: BaseMetrics;
  icon?: React.ReactNode;
  format?: 'number' | 'percentage' | 'duration' | 'currency';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Formate une valeur selon le type spécifié
 */
function formatValue(value: number, format: MetricCardProps['format']): string {
  switch (format) {
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'duration':
      if (value < 60) return `${Math.round(value)}s`;
      if (value < 3600) return `${Math.round(value / 60)}min`;
      return `${Math.round(value / 3600)}h`;
    case 'currency':
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(value);
    case 'number':
    default:
      return new Intl.NumberFormat('fr-FR').format(value);
  }
}

/**
 * Retourne l'icône et la couleur de tendance appropriées
 */
function getTrendIcon(trend: BaseMetrics['trend'], growth: number) {
  const iconClass = "w-4 h-4";
  
  switch (trend) {
    case 'up':
      return {
        icon: <TrendingUp className={iconClass} />,
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      };
    case 'down':
      return {
        icon: <TrendingDown className={iconClass} />,
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      };
    case 'stable':
    default:
      return {
        icon: <Minus className={iconClass} />,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50'
      };
  }
}

export function MetricCard({
  title,
  metrics,
  icon,
  format = 'number',
  className,
  size = 'md'
}: MetricCardProps) {
  const trendInfo = getTrendIcon(metrics.trend, metrics.growth);
  const formattedValue = formatValue(metrics.total, format);
  const formattedGrowth = Math.abs(metrics.growth).toFixed(1);

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const titleSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const valueSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={cn(
      "bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow",
      sizeClasses[size],
      className
    )}>
      {/* En-tête avec titre et icône */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={cn(
          "font-medium text-gray-900",
          titleSizeClasses[size]
        )}>
          {title}
        </h3>
        {icon && (
          <div className="p-2 bg-blue-50 rounded-lg">
            <div className="w-5 h-5 text-blue-600">
              {icon}
            </div>
          </div>
        )}
      </div>

      {/* Valeur principale */}
      <div className="mb-3">
        <div className={cn(
          "font-bold text-gray-900",
          valueSizeClasses[size]
        )}>
          {formattedValue}
        </div>
      </div>

      {/* Indicateur de tendance */}
      <div className="flex items-center space-x-2">
        <div className={cn(
          "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
          trendInfo.color,
          trendInfo.bgColor
        )}>
          {trendInfo.icon}
          <span>
            {metrics.growth > 0 ? '+' : ''}{formattedGrowth}%
          </span>
        </div>
        <span className="text-xs text-gray-500">
          vs période précédente
        </span>
      </div>
    </div>
  );
}

/**
 * Composant pour afficher plusieurs métriques dans une grille
 */
interface MetricGridProps {
  metrics: Array<{
    title: string;
    data: BaseMetrics;
    icon?: React.ReactNode;
    format?: MetricCardProps['format'];
  }>;
  columns?: 2 | 3 | 4;
  size?: MetricCardProps['size'];
  className?: string;
}

export function MetricGrid({
  metrics,
  columns = 3,
  size = 'md',
  className
}: MetricGridProps) {
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={cn(
      "grid gap-4",
      gridClasses[columns],
      className
    )}>
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          metrics={metric.data}
          icon={metric.icon}
          format={metric.format}
          size={size}
        />
      ))}
    </div>
  );
}