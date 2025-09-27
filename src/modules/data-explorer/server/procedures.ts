/**
 * Procédures TRPC pour le module data-explorer
 * Permet d'accéder aux données des tables du schéma de base de données
 */
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { db } from '@/db';
import { 
  user, session, account, verification, agents, meeting
} from '@/db/schema';
import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

// Schéma pour les options de filtrage, tri et pagination
const dataExplorerOptionsSchema = z.object({
  table: z.string(),
  search: z.string().optional(),
  page: z.number().default(1),
  pageSize: z.number().default(10),
  sortField: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  filters: z.record(z.string(), z.string()).optional(),
});

// Liste des tables disponibles
const availableTables = [
  { name: 'user', label: 'Utilisateurs' },
  { name: 'agents', label: 'Agents' },
  { name: 'meeting', label: 'Réunions' },
  { name: 'session', label: 'Sessions' },
  { name: 'account', label: 'Comptes' },
  { name: 'verification', label: 'Vérifications' },
];

// Fonction pour obtenir la table en fonction du nom
const getTable = (tableName: string) => {
  switch (tableName) {
    case 'user':
      return user;
    case 'agents':
      return agents;
    case 'meeting':
      return meeting;
    case 'session':
      return session;
    case 'account':
      return account;
    case 'verification':
      return verification;
    default:
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Table ${tableName} non disponible`,
      });
  }
};

// Fonction pour créer des conditions de recherche
const createSearchConditions = (table: any, searchQuery: string) => {
  if (!searchQuery) return undefined;
  
  // Récupérer les colonnes de la table
  const columns = Object.entries(table)
    .filter(([_, value]: [string, any]) => 
      typeof value === 'object' && value !== null && 'name' in value
    )
    .map(([_, value]: [string, any]) => value);
  
  // Créer des conditions pour chaque colonne de type texte
  const conditions = columns
    .filter((column: any) => 
      column.dataType === 'string' || 
      column.dataType === 'text' || 
      column.dataType === 'varchar'
    )
    .map((column: any) => ilike(column, `%${searchQuery}%`));
  
  return conditions.length > 0 ? or(...conditions) : undefined;
};

// Fonction pour créer des conditions de filtrage
const createFilterConditions = (table: any, filters: Record<string, string>) => {
  if (!filters || Object.keys(filters).length === 0) return undefined;
  
  const conditions = Object.entries(filters).map(([key, value]) => {
    if (!(key in table)) return undefined;
    return ilike(table[key], `%${value}%`);
  }).filter(Boolean);
  
  return conditions.length > 0 ? and(...conditions) : undefined;
};

export const dataExplorerRouter = createTRPCRouter({
  // Procédure pour obtenir la liste des tables disponibles
  getAvailableTables: protectedProcedure.query(() => {
    return availableTables;
  }),
  
  // Procédure pour obtenir les données d'une table
  getData: protectedProcedure
    .input(dataExplorerOptionsSchema)
    .query(async ({ input }: { input: z.infer<typeof dataExplorerOptionsSchema> }) => {
      const { 
        table: tableName, 
        search, 
        page, 
        pageSize, 
        sortField, 
        sortDirection,
        filters 
      } = input;
      
      try {
        const table = getTable(tableName);
        const offset = (page - 1) * pageSize;
        
        // Créer les conditions de recherche et de filtrage
        const searchCondition = createSearchConditions(table, search || '');
        const filterCondition = createFilterConditions(table, filters || {});
        
        // Combiner les conditions
        const whereCondition = searchCondition && filterCondition
          ? and(searchCondition, filterCondition)
          : searchCondition || filterCondition;
        
        // Construire la requête de base
        let query = db.select().from(table);
        
        // Ajouter les conditions si nécessaire
        if (whereCondition) {
          // Utiliser une approche sécurisée pour les conditions
          const safeQuery = query as any;
          safeQuery.where(whereCondition);
          query = safeQuery;
        }
        
        // Ajouter le tri si nécessaire
        if (sortField && sortField in table) {
          // Utiliser une approche sécurisée pour le tri
          if (table[sortField as keyof typeof table]) {
            const sortColumn = table[sortField as keyof typeof table];
            const safeQuery = query as any;
            safeQuery.orderBy(
              sortDirection === 'desc' 
                ? desc(sortColumn as any) 
                : asc(sortColumn as any)
            );
            query = safeQuery;
          }
        }
        
        // Compter le nombre total d'enregistrements
        const countQuery = db
          .select({ count: sql<number>`count(*)` })
          .from(table);
        
        if (whereCondition) {
          countQuery.where(whereCondition);
        }
        
        const [countResult] = await countQuery;
        const total = countResult?.count || 0;
        
        // Appliquer la pagination
        const paginatedQuery = query
          .limit(pageSize)
          .offset(offset);
        
        // Exécuter la requête
        const data = await paginatedQuery;
        
        return {
          data,
          total,
          pageCount: Math.ceil(total / pageSize),
        };
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la récupération des données',
          cause: error,
        });
      }
    }),
});