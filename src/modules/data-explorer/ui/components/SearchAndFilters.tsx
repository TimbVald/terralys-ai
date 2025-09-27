/**
 * Composant de recherche et filtres pour l'explorateur de données
 */
import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SearchAndFiltersProps = {
  search: string;
  filters: Record<string, string>;
  availableColumns: string[];
  onSearchChange: (value: string) => void;
  onAddFilter: (key: string, value: string) => void;
  onRemoveFilter: (key: string) => void;
  onResetFilters: () => void;
};

export const SearchAndFilters = ({
  search,
  filters,
  availableColumns,
  onSearchChange,
  onAddFilter,
  onRemoveFilter,
  onResetFilters
}: SearchAndFiltersProps) => {
  const [filterKey, setFilterKey] = useState('');
  const [filterValue, setFilterValue] = useState('');
  
  const handleAddFilter = () => {
    if (filterKey && filterValue) {
      onAddFilter(filterKey, filterValue);
      setFilterKey('');
      setFilterValue('');
    }
  };
  
  // Formater les noms des colonnes pour l'affichage
  const formatColumnName = (key: string) => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Recherche et filtres</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-8"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  Filtres
                  {Object.keys(filters).length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {Object.keys(filters).length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Filtres avancés</h4>
                  
                  {/* Filtres actifs */}
                  {Object.keys(filters).length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Filtres actifs</div>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(filters).map(([key, value]) => (
                          <Badge key={key} variant="secondary" className="gap-1">
                            {formatColumnName(key)}: {value}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 ml-1"
                              onClick={() => onRemoveFilter(key)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs"
                        onClick={onResetFilters}
                      >
                        Réinitialiser tous les filtres
                      </Button>
                    </div>
                  )}
                  
                  {/* Ajouter un filtre */}
                  <div className="grid gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="filter-key">Colonne</Label>
                        <Select value={filterKey} onValueChange={setFilterKey}>
                          <SelectTrigger id="filter-key">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableColumns.map(col => (
                              <SelectItem key={col} value={col}>
                                {formatColumnName(col)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="filter-value">Valeur</Label>
                        <Input
                          id="filter-value"
                          placeholder="Valeur..."
                          value={filterValue}
                          onChange={(e) => setFilterValue(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={handleAddFilter}
                      disabled={!filterKey || !filterValue}
                    >
                      Ajouter le filtre
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};