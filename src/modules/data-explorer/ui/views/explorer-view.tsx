"use client"
/**
 * Vue principale du module Data Explorer
 * Affiche les données des tables du schéma de base de données
 */
import { useState } from 'react';
import { useDataExplorer } from '@/modules/data-explorer/hooks/useDataExplorer';
import { Loader2, Database, Table } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Liste des tables disponibles dans le schéma
const AVAILABLE_TABLES = [
  { id: 'user', name: 'Utilisateurs', module: 'auth' },
  { id: 'agents', name: 'Agents', module: 'agents' },
  { id: 'meeting', name: 'Réunions', module: 'meetings' },
  { id: 'plantAnalyses', name: 'Analyses de plantes', module: 'plant-disease-detection' }
];

export const ExplorerView = () => {
  // État pour les options de l'explorateur
  const [selectedTable, setSelectedTable] = useState(AVAILABLE_TABLES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Utilisation du hook pour récupérer les données
  const { data, isLoading, error } = useDataExplorer({
    table: selectedTable,
    search: searchQuery,
    page: 1,
    pageSize: 10
  });

  return (
    <div className="flex flex-col h-full w-full p-4 gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Database className="h-6 w-6" />
          Explorateur de données
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sélection de table */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Tables disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {AVAILABLE_TABLES.map((table) => (
                <Button
                  key={table.id}
                  variant={selectedTable === table.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedTable(table.id)}
                >
                  <Table className="h-4 w-4 mr-2" />
                  {table.name}
                  <Badge variant="outline" className="ml-auto">
                    {table.module}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Affichage des données */}
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {AVAILABLE_TABLES.find(t => t.id === selectedTable)?.name || 'Données'}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 text-red-500">
                <p>Une erreur est survenue lors du chargement des données.</p>
              </div>
            ) : !data || data.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p>Aucune donnée disponible pour cette table.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      {Object.keys(data[0]).map(key => (
                        <th key={key} className="p-2 text-left text-sm font-medium">
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row: Record<string, any>, index: number) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        {Object.entries(row).map(([key, value]) => (
                          <td key={key} className="p-2 text-sm">
                            {value === null || value === undefined ? '-' : 
                             typeof value === 'boolean' ? (value ? 'Oui' : 'Non') :
                             value instanceof Date ? value.toLocaleDateString() :
                             typeof value === 'object' ? JSON.stringify(value) :
                             String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};