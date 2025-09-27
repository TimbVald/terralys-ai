/**
 * Composant de tableau de données pour l'explorateur de données
 */
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

type DataTableProps = {
  data: Record<string, any>[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort: (field: string) => void;
};

export const DataTable = ({
  data,
  isLoading,
  isError,
  error,
  sortField,
  sortDirection,
  onSort
}: DataTableProps) => {
  // Formater les noms des colonnes pour l'affichage
  const formatColumnName = (key: string) => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <p>Une erreur est survenue lors du chargement des données.</p>
        <p className="text-sm">{error?.message}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p>Aucune donnée disponible pour cette table.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            {Object.keys(data[0]).map(key => (
              <th key={key} className="p-2 text-left text-sm font-medium">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 p-0 font-medium"
                  onClick={() => onSort(key)}
                >
                  {formatColumnName(key)}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                  {sortField === key && (
                    <Badge variant="secondary" className="ml-2">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </Badge>
                  )}
                </Button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b hover:bg-muted/50">
              {Object.entries(row).map(([key, value]) => (
                <td key={key} className="p-2 text-sm">
                  {value === null || value === undefined ? '-' : 
                   typeof value === 'boolean' ? (value ? 'Oui' : 'Non') :
                   value instanceof Date ? new Date(value).toLocaleDateString() :
                   typeof value === 'object' ? JSON.stringify(value) :
                   String(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};