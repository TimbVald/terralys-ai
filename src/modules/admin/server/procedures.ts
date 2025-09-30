import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { db } from '@/db';
import { 
  user, 
  session, 
  account, 
  agents, 
  meeting, 
  plantAnalyses, 
  environmentalData, 
  pestIdentifications, 
  nutrientDeficiencies, 
  analysisResponses, 
  TreatmentRecommendations 
} from '@/db/schema';
import { desc, asc, like, and, gte, lte, eq, count, sql } from 'drizzle-orm';

/**
 * Schéma de validation pour les filtres de données
 */
const dataFilterSchema = z.object({
  table: z.enum([
    'users', 
    'sessions', 
    'accounts', 
    'agents', 
    'meetings', 
    'plantAnalyses', 
    'environmentalData', 
    'pestIdentifications', 
    'nutrientDeficiencies', 
    'analysisResponses', 
    'treatmentRecommendations'
  ]),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

/**
 * Schéma pour les statistiques globales
 */
const statsFilterSchema = z.object({
  period: z.enum(['day', 'week', 'month', 'year']).default('month'),
});

export const adminRouter = createTRPCRouter({
  /**
   * Récupère les statistiques globales de l'application
   */
  getGlobalStats: protectedProcedure
    .input(statsFilterSchema)
    .query(async ({ input }) => {
      const { period } = input;
      
      // Calcul de la date de début selon la période
      const now = new Date();
      const startDate = new Date();
      
      switch (period) {
        case 'day':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      // Récupération des statistiques
      const [
        totalUsers,
        totalAgents,
        totalMeetings,
        totalAnalyses,
        recentUsers,
        recentAnalyses,
        activeSessions
      ] = await Promise.all([
        db.select({ count: count() }).from(user),
        db.select({ count: count() }).from(agents),
        db.select({ count: count() }).from(meeting),
        db.select({ count: count() }).from(plantAnalyses),
        db.select({ count: count() }).from(user).where(gte(user.createdAt, startDate)),
        db.select({ count: count() }).from(plantAnalyses).where(gte(plantAnalyses.createdAt, startDate)),
        db.select({ count: count() }).from(session).where(gte(session.expiresAt, now))
      ]);

      return {
        totalUsers: totalUsers[0]?.count || 0,
        totalAgents: totalAgents[0]?.count || 0,
        totalMeetings: totalMeetings[0]?.count || 0,
        totalAnalyses: totalAnalyses[0]?.count || 0,
        recentUsers: recentUsers[0]?.count || 0,
        recentAnalyses: recentAnalyses[0]?.count || 0,
        activeSessions: activeSessions[0]?.count || 0,
        period,
      };
    }),

  /**
   * Récupère les données d'une table spécifique avec filtrage
   */
  getTableData: protectedProcedure
    .input(dataFilterSchema)
    .query(async ({ input }) => {
      const { table, search, dateFrom, dateTo, sortBy, sortOrder, page, limit } = input;
      const offset = (page - 1) * limit;

      let query: any;
      let countQuery: any;
      const searchConditions: any[] = [];
      const dateConditions: any[] = [];

      // Construction des conditions de recherche et de date selon la table
      switch (table) {
        case 'users':
          query = db.select().from(user);
          countQuery = db.select({ count: count() }).from(user);
          
          if (search) {
            searchConditions.push(
              like(user.name, `%${search}%`),
              like(user.email, `%${search}%`)
            );
          }
          
          if (dateFrom) dateConditions.push(gte(user.createdAt, new Date(dateFrom)));
          if (dateTo) dateConditions.push(lte(user.createdAt, new Date(dateTo)));
          
          if (sortBy === 'name') {
            query = query.orderBy(sortOrder === 'asc' ? asc(user.name) : desc(user.name));
          } else if (sortBy === 'email') {
            query = query.orderBy(sortOrder === 'asc' ? asc(user.email) : desc(user.email));
          } else {
            query = query.orderBy(sortOrder === 'asc' ? asc(user.createdAt) : desc(user.createdAt));
          }
          break;

        case 'agents':
          query = db.select({
            id: agents.id,
            name: agents.name,
            userId: agents.userId,
            instruction: agents.instruction,
            createdAt: agents.createdAt,
            updatedAt: agents.updatedAt,
            userName: user.name,
            userEmail: user.email,
          }).from(agents).leftJoin(user, eq(agents.userId, user.id));
          
          countQuery = db.select({ count: count() }).from(agents);
          
          if (search) {
            searchConditions.push(
              like(agents.name, `%${search}%`),
              like(agents.instruction, `%${search}%`)
            );
          }
          
          if (dateFrom) dateConditions.push(gte(agents.createdAt, new Date(dateFrom)));
          if (dateTo) dateConditions.push(lte(agents.createdAt, new Date(dateTo)));
          
          if (sortBy === 'name') {
            query = query.orderBy(sortOrder === 'asc' ? asc(agents.name) : desc(agents.name));
          } else {
            query = query.orderBy(sortOrder === 'asc' ? asc(agents.createdAt) : desc(agents.createdAt));
          }
          break;

        case 'meetings':
          query = db.select({
            id: meeting.id,
            name: meeting.name,
            userId: meeting.userId,
            agentId: meeting.agentId,
            status: meeting.status,
            startedAt: meeting.startedAt,
            endedAt: meeting.endedAt,
            createdAt: meeting.createdAt,
            userName: user.name,
            agentName: agents.name,
          }).from(meeting)
            .leftJoin(user, eq(meeting.userId, user.id))
            .leftJoin(agents, eq(meeting.agentId, agents.id));
          
          countQuery = db.select({ count: count() }).from(meeting);
          
          if (search) {
            searchConditions.push(
              like(meeting.name, `%${search}%`)
            );
          }
          
          if (dateFrom) dateConditions.push(gte(meeting.createdAt, new Date(dateFrom)));
          if (dateTo) dateConditions.push(lte(meeting.createdAt, new Date(dateTo)));
          
          query = query.orderBy(sortOrder === 'asc' ? asc(meeting.createdAt) : desc(meeting.createdAt));
          break;

        case 'plantAnalyses':
          query = db.select({
            id: plantAnalyses.id,
            userId: plantAnalyses.userId,
            plantName: plantAnalyses.plantName,
            isHealthy: plantAnalyses.isHealthy,
            diseaseName: plantAnalyses.diseaseName,
            confidenceScore: plantAnalyses.confidenceScore,
            severity: plantAnalyses.severity,
            service: plantAnalyses.service,
            createdAt: plantAnalyses.createdAt,
            userName: user.name,
            userEmail: user.email,
          }).from(plantAnalyses).leftJoin(user, eq(plantAnalyses.userId, user.id));
          
          countQuery = db.select({ count: count() }).from(plantAnalyses);
          
          if (search) {
            searchConditions.push(
              like(plantAnalyses.plantName, `%${search}%`),
              like(plantAnalyses.diseaseName, `%${search}%`)
            );
          }
          
          if (dateFrom) dateConditions.push(gte(plantAnalyses.createdAt, new Date(dateFrom)));
          if (dateTo) dateConditions.push(lte(plantAnalyses.createdAt, new Date(dateTo)));
          
          query = query.orderBy(sortOrder === 'asc' ? asc(plantAnalyses.createdAt) : desc(plantAnalyses.createdAt));
          break;

        default:
          throw new Error(`Table ${table} non supportée`);
      }

      // Application des conditions de filtrage
      const conditions = [...searchConditions, ...dateConditions];
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
        countQuery = countQuery.where(and(...conditions));
      }

      // Exécution des requêtes
      const [data, totalCount] = await Promise.all([
        query.limit(limit).offset(offset),
        countQuery
      ]);

      return {
        data,
        pagination: {
          page,
          limit,
          total: totalCount[0]?.count || 0,
          totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
        },
      };
    }),

  /**
   * Récupère les détails d'un enregistrement spécifique
   */
  getRecordDetails: protectedProcedure
    .input(z.object({
      table: z.string(),
      id: z.string(),
    }))
    .query(async ({ input }) => {
      const { table, id } = input;

      switch (table) {
        case 'users':
          return await db.select().from(user).where(eq(user.id, id)).limit(1);
        
        case 'agents':
          return await db.select({
            id: agents.id,
            name: agents.name,
            userId: agents.userId,
            instruction: agents.instruction,
            createdAt: agents.createdAt,
            updatedAt: agents.updatedAt,
            userName: user.name,
            userEmail: user.email,
          }).from(agents)
            .leftJoin(user, eq(agents.userId, user.id))
            .where(eq(agents.id, id))
            .limit(1);
        
        case 'plantAnalyses':
          const analysis = await db.select().from(plantAnalyses).where(eq(plantAnalyses.id, id)).limit(1);
          if (analysis.length === 0) return null;

          // Récupération des données associées
          const [envData, pests, nutrients, treatments] = await Promise.all([
            db.select().from(environmentalData).where(eq(environmentalData.analysisId, id)),
            db.select().from(pestIdentifications).where(eq(pestIdentifications.analysisId, id)),
            db.select().from(nutrientDeficiencies).where(eq(nutrientDeficiencies.analysisId, id)),
            db.select().from(TreatmentRecommendations).where(eq(TreatmentRecommendations.analysisId, id))
          ]);

          return {
            ...analysis[0],
            environmentalData: envData,
            pestIdentifications: pests,
            nutrientDeficiencies: nutrients,
            treatmentRecommendations: treatments,
          };
        
        default:
          throw new Error(`Table ${table} non supportée pour les détails`);
      }
    }),

  /**
   * Supprime un enregistrement
   */
  deleteRecord: protectedProcedure
    .input(z.object({
      table: z.string(),
      id: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { table, id } = input;

      switch (table) {
        case 'users':
          await db.delete(user).where(eq(user.id, id));
          break;
        case 'agents':
          await db.delete(agents).where(eq(agents.id, id));
          break;
        case 'meetings':
          await db.delete(meeting).where(eq(meeting.id, id));
          break;
        case 'plantAnalyses':
          await db.delete(plantAnalyses).where(eq(plantAnalyses.id, id));
          break;
        default:
          throw new Error(`Suppression non supportée pour la table ${table}`);
      }

      return { success: true };
    }),
});