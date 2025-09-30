'use client';

import React, { useState, useMemo } from 'react';
import { useTRPC } from '@/trpc/client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Trash2, 
  Calendar,
  SortAsc,
  SortDesc,
  RefreshCw
} from 'lucide-react';
import { DataFilters } from './DataFilters';
// import { RecordDetailsModal } from './RecordDetailsModal'; // TODO: Créer ce composant
import { useConfirm } from '@/hooks/use-confirm';

/**
 * Interface pour les props du composant DataTable
 */
interface DataTableProps {
  table: 'users' | 'agents' | 'meetings' | 'plantAnalyses';
  title: string;
}

/**
 * Configuration des colonnes pour chaque table
 */
const tableConfigs = {
  users: {
    columns: [
      { key: 'name', label: 'Nom', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'emailVerified', label: 'Email vérifié', sortable: false },
      { key: 'createdAt', label: 'Date création', sortable: true },
    ],
    searchPlaceholder: 'Rechercher par nom ou email...',
  },
  agents: {
    columns: [
      { key: 'name', label: 'Nom', sortable: true },
      { key: 'userName', label: 'Propriétaire', sortable: false },
      { key: 'instruction', label: 'Instructions', sortable: false },
      { key: 'createdAt', label: 'Date création', sortable: true },
    ],
    searchPlaceholder: 'Rechercher par nom ou instructions...',
  },
  meetings: {
    columns: [
      { key: 'name', label: 'Nom', sortable: true },
      { key: 'userName', label: 'Utilisateur', sortable: false },
      { key: 'agentName', label: 'Agent', sortable: false },
      { key: 'status', label: 'Statut', sortable: false },
      { key: 'createdAt', label: 'Date création', sortable: true },
    ],
    searchPlaceholder: 'Rechercher par nom de réunion...',
  },
  plantAnalyses: {
    columns: [
      { key: 'plantName', label: 'Plante', sortable: true },
      { key: 'userName', label: 'Utilisateur', sortable: false },
      { key: 'isHealthy', label: 'Santé', sortable: false },
      { key: 'diseaseName', label: 'Maladie', sortable: false },
      { key: 'confidenceScore', label: 'Confiance', sortable: true },
      { key: 'service', label: 'Service', sortable: false },
      { key: 'createdAt', label: 'Date analyse', sortable: true },
    ],
    searchPlaceholder: 'Rechercher par nom de plante ou maladie...',
  },
};

/**
 * Composant DataTable pour afficher et gérer les données
 */
export function DataTable({ table, title }: DataTableProps) {
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [showFilters, setShowFilters] = useState(false);

  const config = tableConfigs[table];
  const [ConfirmDialog, confirm] = useConfirm(
    'Confirmer la suppression',
    'Êtes-vous sûr de vouloir supprimer cet enregistrement ? Cette action est irréversible.'
  );

  // Requêtes tRPC
  const trpc = useTRPC();
  const { data = { 
    data: [], 
    pagination: { 
      page: 1, 
      limit: 20, 
      total: 0, 
      totalPages: 0 
    } 
  } } = useQuery(trpc.admin.getTableData.queryOptions({
    table,
    search: search || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    sortBy: sortBy || undefined,
    sortOrder,
    page,
    limit,
  }));

  // Mutation pour supprimer un enregistrement
  const { mutateAsync: deleteRecord } = useMutation(
    trpc.admin.deleteRecord.mutationOptions(),
  );

  /**
   * Gestion du tri des colonnes
   */
  const handleSort = (columnKey: string) => {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortOrder('asc');
    }
    setPage(1);
  };

  /**
   * Ouverture du modal des détails (TODO: Implémenter)
   */
  // const handleViewDetails = (record: any) => {
  //   setSelectedRecord(record);
  //   setShowDetailsModal(true);
  // };

  /**
   * Gestion de la suppression d'un enregistrement
   */
  const handleDelete = async (id: string) => {
    const confirmed = await confirm();
    if (confirmed) {
      try {
        await deleteRecord({
          table,
          id,
        });
        toast.success('Enregistrement supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  /**
   * Formatage des valeurs de cellules
   */
  const formatCellValue = (value: any, columnKey: string) => {
    if (value === null || value === undefined) return '-';
    
    switch (columnKey) {
      case 'createdAt':
      case 'updatedAt':
      case 'startedAt':
      case 'endedAt':
        return new Date(value).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      
      case 'emailVerified':
      case 'isHealthy':
        return (
          <Badge variant={value ? 'default' : 'secondary'}>
            {value ? 'Oui' : 'Non'}
          </Badge>
        );
      
      case 'status':
        const statusColors = {
          upcoming: 'bg-blue-100 text-blue-800',
          active: 'bg-green-100 text-green-800',
          completed: 'bg-gray-100 text-gray-800',
          processing: 'bg-yellow-100 text-yellow-800',
          cancelled: 'bg-red-100 text-red-800',
        };
        return (
          <Badge className={statusColors[value as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
            {value}
          </Badge>
        );
      
      case 'severity':
        const severityColors = {
          low: 'bg-green-100 text-green-800',
          medium: 'bg-yellow-100 text-yellow-800',
          high: 'bg-red-100 text-red-800',
        };
        return value ? (
          <Badge className={severityColors[value as keyof typeof severityColors]}>
            {value}
          </Badge>
        ) : '-';
      
      case 'service':
        const serviceColors = {
          local: 'bg-blue-100 text-blue-800',
          backend: 'bg-purple-100 text-purple-800',
          gemini: 'bg-orange-100 text-orange-800',
        };
        return (
          <Badge className={serviceColors[value as keyof typeof serviceColors] || 'bg-gray-100 text-gray-800'}>
            {value}
          </Badge>
        );
      
      case 'confidenceScore':
        return typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : '-';
      
      case 'instruction':
        return value ? (
          <span className="truncate max-w-xs block" title={value}>
            {value.length > 50 ? `${value.substring(0, 50)}...` : value}
          </span>
        ) : '-';
      
      default:
        return typeof value === 'string' && value.length > 50 
          ? `${value.substring(0, 50)}...` 
          : value;
    }
  };

  /**
   * Réinitialisation des filtres
   */
  const resetFilters = () => {
    setSearch('');
    setDateFrom('');
    setDateTo('');
    setSortBy('');
    setSortOrder('desc');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <ConfirmDialog />
      
      {/* En-tête avec filtres */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>
                {data?.pagination.total || 0} enregistrement(s) trouvé(s)
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Actualiser
              </Button>
            </div>
          </div>
          
          {/* Barre de recherche */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={config.searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            
            {showFilters && (
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="date"
                  placeholder="Date début"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setPage(1);
                  }}
                  className="w-full sm:w-40"
                />
                <Input
                  type="date"
                  placeholder="Date fin"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setPage(1);
                  }}
                  className="w-full sm:w-40"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="whitespace-nowrap"
                >
                  Réinitialiser
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Tableau des données */}
          {!data?.data.length ? (
            <div className="text-center py-8 text-gray-500">
              Aucun enregistrement trouvé
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {config.columns.map((column) => (
                      <TableHead 
                        key={column.key}
                        className={column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''}
                        onClick={() => column.sortable && handleSort(column.key)}
                      >
                        <div className="flex items-center gap-2">
                          {column.label}
                          {column.sortable && sortBy === column.key && (
                            sortOrder === 'asc' ? 
                              <SortAsc className="h-4 w-4" /> : 
                              <SortDesc className="h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                
                <TableBody>
                  {data.data.map((record: any) => (
                    <TableRow key={record.id} className="hover:bg-gray-50">
                      {config.columns.map((column) => (
                        <TableCell key={column.key}>
                          {formatCellValue(record[column.key], column.key)}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRecord(record)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button> */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(record.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Pagination */}
          {data && data.pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div className="text-sm text-gray-600">
                Page {data.pagination.page} sur {data.pagination.totalPages} 
                ({data.pagination.total} enregistrement(s))
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={limit.toString()} onValueChange={(value) => {
                  setLimit(parseInt(value));
                  setPage(1);
                }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= data.pagination.totalPages}
                  className="flex items-center gap-1"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Modal des détails */}
      {/* {selectedRecord && (
        <RecordDetailsModal
          table={table}
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )} */}
    </div>
  );
}