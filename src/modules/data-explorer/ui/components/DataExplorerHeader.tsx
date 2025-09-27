"use client"

/**
 * En-tête du module data-explorer
 * Permet de sélectionner le module et le mode de visualisation
 */

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem
} from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import {
  Table,
  BarChart3,
  List,
  Grid3X3,
  RefreshCw,
  Download,
  Save
} from "lucide-react";
import type { ModuleMetadata, VisualizationOptions } from '../../types';

interface DataExplorerHeaderProps {
  modules: ModuleMetadata[];
  selectedModule: string;
  onModuleChange: (module: string) => void;
  visualization: VisualizationOptions;
  onVisualizationChange: (visualization: VisualizationOptions) => void;
  onRefresh: () => void;
  onExport: () => void;
  onSaveView: () => void;
}

export const DataExplorerHeader: React.FC<DataExplorerHeaderProps> = ({
  modules,
  selectedModule,
  onModuleChange,
  visualization,
  onVisualizationChange,
  onRefresh,
  onExport,
  onSaveView
}) => {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">Explorateur de données</h1>
        
        <Select
          value={selectedModule}
          onValueChange={onModuleChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sélectionner un module" />
          </SelectTrigger>
          <SelectContent>
            {modules.map((module) => (
              <SelectItem key={module.name} value={module.name}>
                {module.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <ToggleGroup
          type="single"
          value={visualization.type}
          onValueChange={(value) => {
            if (value) {
              onVisualizationChange({ ...visualization, type: value as any });
            }
          }}
        >
          <ToggleGroupItem value="table" aria-label="Affichage tableau">
            <Table className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="cards" aria-label="Affichage cartes">
            <Grid3X3 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Affichage liste">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="chart" aria-label="Affichage graphique">
            <BarChart3 className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        <Button variant="outline" size="icon" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Rafraîchir</span>
        </Button>
        
        <Button variant="outline" size="icon" onClick={onExport}>
          <Download className="h-4 w-4" />
          <span className="sr-only">Exporter</span>
        </Button>
        
        <Button variant="outline" size="icon" onClick={onSaveView}>
          <Save className="h-4 w-4" />
          <span className="sr-only">Enregistrer la vue</span>
        </Button>
      </div>
    </div>
  );
};