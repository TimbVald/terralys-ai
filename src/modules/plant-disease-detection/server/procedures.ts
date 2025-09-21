import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { 
  plantAnalyses, 
  environmentalData, 
  pestIdentifications, 
  nutrientDeficiencies,
  analysisResponses,
  TreatmentRecommendations
} from "@/db/schema";
import { and, count, desc, eq, getTableColumns, ilike, gte, lte, sql, asc } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

/**
 * Schémas de validation pour les entrées
 */
const plantAnalysisInsertSchema = z.object({
  imageUrl: z.string().url("URL d'image invalide"),
  plantName: z.string().min(1, "Le nom de la plante est requis"),
  isHealthy: z.boolean(),
  diseaseName: z.string().optional(),
  description: z.string().min(1, "La description est requise"),
  treatmentSuggestions: z.array(z.string()),
  benefits: z.array(z.string()),
  confidenceScore: z.number().min(0).max(1),
  preventativeCareTips: z.array(z.string()),
  progressAssessment: z.string().optional(),
  comparativeAnalysis: z.string().optional(),
  notes: z.string().optional(),
  severity: z.enum(["low", "medium", "high"]).optional(),
  service: z.enum(["local", "backend", "gemini"]),
  preventiveMeasures: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
});

const environmentalDataInsertSchema = z.object({
  analysisId: z.string(),
  temperature: z.number().optional(),
  humidity: z.number().optional(),
  soilMoisture: z.number().optional(),
  lightIntensity: z.number().optional(),
  phLevel: z.number().optional(),
  location: z.string().optional(),
  soilType: z.string().optional(),
  lastWatering: z.string().optional(),
  fertilizer: z.string().optional(),
  additionalInfo: z.string().optional(),
  sunlight: z.string().optional(),
  watering: z.string().optional(),
  notes: z.string().optional(),
  organicPreference: z.boolean().optional(),
});

const pestIdentificationInsertSchema = z.object({
  analysisId: z.string(),
  name: z.string().min(1, "Le nom du parasite est requis"),
  description: z.string().min(1, "La description est requise"),
  treatment: z.string().min(1, "Le traitement est requis"),
  severity: z.enum(["low", "medium", "high"]),
});

const nutrientDeficiencyInsertSchema = z.object({
  analysisId: z.string(),
  name: z.string().min(1, "Le nom de la carence est requis"),
  description: z.string().min(1, "La description est requise"),
  deficiencySymptoms: z.string().optional(),
  sources: z.array(z.string()),
});

const treatmentRecommendationInsertSchema = z.object({
  analysisId: z.string(),
  immediateActions: z.array(z.string()),
  treatmentOptions: z.record(z.string(), z.array(z.string())),
  preventionStrategy: z.array(z.string()),
  monitoringFollowup: z.array(z.string()),
  expectedTimeline: z.string(),
  confidenceLevel: z.string(),
});

/**
 * Routeur principal pour le module plant-disease-detection
 */
export const plantDiseaseDetectionRouter = createTRPCRouter({
  
  // ========================================
  // PROCÉDURES POUR LES ANALYSES DE PLANTES
  // ========================================

  /**
   * Créer une nouvelle analyse de plante
   */
  createAnalysis: protectedProcedure
    .input(plantAnalysisInsertSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const [newAnalysis] = await db
          .insert(plantAnalyses)
          .values({
            ...input,
            userId: ctx.auth.user.id,
          })
          .returning();

        return newAnalysis;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la création de l\'analyse',
          cause: error,
        });
      }
    }),

  /**
   * Obtenir une analyse spécifique avec toutes ses données associées
   */
  getAnalysis: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const [analysis] = await db
          .select()
          .from(plantAnalyses)
          .where(
            and(
              eq(plantAnalyses.id, input.id),
              eq(plantAnalyses.userId, ctx.auth.user.id)
            )
          );

        if (!analysis) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Analyse non trouvée',
          });
        }

        // Récupérer les données associées
        const [envData] = await db
          .select()
          .from(environmentalData)
          .where(eq(environmentalData.analysisId, analysis.id));

        const pests = await db
          .select()
          .from(pestIdentifications)
          .where(eq(pestIdentifications.analysisId, analysis.id));

        const deficiencies = await db
          .select()
          .from(nutrientDeficiencies)
          .where(eq(nutrientDeficiencies.analysisId, analysis.id));

        const [treatment] = await db
          .select()
          .from(TreatmentRecommendations)
          .where(eq(TreatmentRecommendations.analysisId, analysis.id));

        return {
          ...analysis,
          environmentalData: envData || null,
          pestIdentifications: pests,
          nutrientDeficiencies: deficiencies,
          treatmentRecommendation: treatment || null,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la récupération de l\'analyse',
          cause: error,
        });
      }
    }),

  /**
   * Obtenir toutes les analyses de l'utilisateur avec pagination et filtres
   */
  getAnalyses: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(DEFAULT_PAGE),
      pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
      search: z.string().optional(),
      isHealthy: z.boolean().optional(),
      severity: z.enum(["low", "medium", "high"]).optional(),
      service: z.enum(["local", "backend", "gemini"]).optional(),
      dateFrom: z.date().optional(),
      dateTo: z.date().optional(),
    }))
    .query(async ({ input, ctx }) => {
      try {
        const { page, pageSize, search, isHealthy, severity, service, dateFrom, dateTo } = input;
        const offset = (page - 1) * pageSize;

        // Construction des conditions de filtrage
        const conditions = [eq(plantAnalyses.userId, ctx.auth.user.id)];

        if (search) {
          conditions.push(
            ilike(plantAnalyses.plantName, `%${search}%`)
          );
        }

        if (isHealthy !== undefined) {
          conditions.push(eq(plantAnalyses.isHealthy, isHealthy));
        }

        if (severity) {
          conditions.push(eq(plantAnalyses.severity, severity));
        }

        if (service) {
          conditions.push(eq(plantAnalyses.service, service));
        }

        if (dateFrom) {
          conditions.push(gte(plantAnalyses.createdAt, dateFrom));
        }

        if (dateTo) {
          conditions.push(lte(plantAnalyses.createdAt, dateTo));
        }

        // Requête pour les données
        const analyses = await db
          .select({
            ...getTableColumns(plantAnalyses),
            pestCount: sql<number>`(
              SELECT COUNT(*) FROM ${pestIdentifications} 
              WHERE ${pestIdentifications.analysisId} = ${plantAnalyses.id}
            )`.as('pestCount'),
            deficiencyCount: sql<number>`(
              SELECT COUNT(*) FROM ${nutrientDeficiencies} 
              WHERE ${nutrientDeficiencies.analysisId} = ${plantAnalyses.id}
            )`.as('deficiencyCount'),
          })
          .from(plantAnalyses)
          .where(and(...conditions))
          .orderBy(desc(plantAnalyses.createdAt))
          .limit(pageSize)
          .offset(offset);

        // Requête pour le total
        const [totalResult] = await db
          .select({ count: count() })
          .from(plantAnalyses)
          .where(and(...conditions));

        return {
          items: analyses,
          total: totalResult.count,
          page,
          pageSize,
          totalPages: Math.ceil(totalResult.count / pageSize),
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la récupération des analyses',
          cause: error,
        });
      }
    }),

  /**
   * Mettre à jour une analyse
   */
  updateAnalysis: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: plantAnalysisInsertSchema.partial(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const [updatedAnalysis] = await db
          .update(plantAnalyses)
          .set({
            ...input.data,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(plantAnalyses.id, input.id),
              eq(plantAnalyses.userId, ctx.auth.user.id)
            )
          )
          .returning();

        if (!updatedAnalysis) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Analyse non trouvée',
          });
        }

        return updatedAnalysis;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la mise à jour de l\'analyse',
          cause: error,
        });
      }
    }),

  /**
   * Supprimer une analyse et toutes ses données associées
   */
  deleteAnalysis: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Vérifier que l'analyse appartient à l'utilisateur
        const [existingAnalysis] = await db
          .select()
          .from(plantAnalyses)
          .where(
            and(
              eq(plantAnalyses.id, input.id),
              eq(plantAnalyses.userId, ctx.auth.user.id)
            )
          );

        if (!existingAnalysis) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Analyse non trouvée',
          });
        }

        // Supprimer l'analyse (les données associées seront supprimées en cascade)
        const [deletedAnalysis] = await db
          .delete(plantAnalyses)
          .where(eq(plantAnalyses.id, input.id))
          .returning();

        return deletedAnalysis;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la suppression de l\'analyse',
          cause: error,
        });
      }
    }),

  // ========================================
  // PROCÉDURES POUR LES DONNÉES ENVIRONNEMENTALES
  // ========================================

  /**
   * Ajouter des données environnementales à une analyse
   */
  addEnvironmentalData: protectedProcedure
    .input(environmentalDataInsertSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Vérifier que l'analyse appartient à l'utilisateur
        const [analysis] = await db
          .select()
          .from(plantAnalyses)
          .where(
            and(
              eq(plantAnalyses.id, input.analysisId),
              eq(plantAnalyses.userId, ctx.auth.user.id)
            )
          );

        if (!analysis) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Analyse non trouvée',
          });
        }

        const [newEnvData] = await db
          .insert(environmentalData)
          .values(input)
          .returning();

        return newEnvData;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de l\'ajout des données environnementales',
          cause: error,
        });
      }
    }),

  /**
   * Mettre à jour les données environnementales
   */
  updateEnvironmentalData: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: environmentalDataInsertSchema.omit({ analysisId: true }).partial(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Vérifier que les données environnementales appartiennent à l'utilisateur
        const [existingEnvData] = await db
          .select({
            envData: environmentalData,
            analysis: plantAnalyses,
          })
          .from(environmentalData)
          .innerJoin(plantAnalyses, eq(environmentalData.analysisId, plantAnalyses.id))
          .where(
            and(
              eq(environmentalData.id, input.id),
              eq(plantAnalyses.userId, ctx.auth.user.id)
            )
          );

        if (!existingEnvData) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Données environnementales non trouvées',
          });
        }

        const [updatedEnvData] = await db
          .update(environmentalData)
          .set(input.data)
          .where(eq(environmentalData.id, input.id))
          .returning();

        return updatedEnvData;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la mise à jour des données environnementales',
          cause: error,
        });
      }
    }),

  // ========================================
  // PROCÉDURES POUR LES PARASITES
  // ========================================

  /**
   * Ajouter une identification de parasite
   */
  addPestIdentification: protectedProcedure
    .input(pestIdentificationInsertSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Vérifier que l'analyse appartient à l'utilisateur
        const [analysis] = await db
          .select()
          .from(plantAnalyses)
          .where(
            and(
              eq(plantAnalyses.id, input.analysisId),
              eq(plantAnalyses.userId, ctx.auth.user.id)
            )
          );

        if (!analysis) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Analyse non trouvée',
          });
        }

        const [newPest] = await db
          .insert(pestIdentifications)
          .values(input)
          .returning();

        return newPest;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de l\'ajout de l\'identification de parasite',
          cause: error,
        });
      }
    }),

  /**
   * Obtenir tous les parasites pour une analyse
   */
  getPestsByAnalysis: protectedProcedure
    .input(z.object({ analysisId: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        // Vérifier que l'analyse appartient à l'utilisateur
        const [analysis] = await db
          .select()
          .from(plantAnalyses)
          .where(
            and(
              eq(plantAnalyses.id, input.analysisId),
              eq(plantAnalyses.userId, ctx.auth.user.id)
            )
          );

        if (!analysis) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Analyse non trouvée',
          });
        }

        const pests = await db
          .select()
          .from(pestIdentifications)
          .where(eq(pestIdentifications.analysisId, input.analysisId))
          .orderBy(desc(pestIdentifications.createdAt));

        return pests;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la récupération des parasites',
          cause: error,
        });
      }
    }),

  // ========================================
  // PROCÉDURES POUR LES CARENCES NUTRITIONNELLES
  // ========================================

  /**
   * Ajouter une carence nutritionnelle
   */
  addNutrientDeficiency: protectedProcedure
    .input(nutrientDeficiencyInsertSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Vérifier que l'analyse appartient à l'utilisateur
        const [analysis] = await db
          .select()
          .from(plantAnalyses)
          .where(
            and(
              eq(plantAnalyses.id, input.analysisId),
              eq(plantAnalyses.userId, ctx.auth.user.id)
            )
          );

        if (!analysis) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Analyse non trouvée',
          });
        }

        const [newDeficiency] = await db
          .insert(nutrientDeficiencies)
          .values(input)
          .returning();

        return newDeficiency;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de l\'ajout de la carence nutritionnelle',
          cause: error,
        });
      }
    }),

  /**
   * Obtenir toutes les carences pour une analyse
   */
  getDeficienciesByAnalysis: protectedProcedure
    .input(z.object({ analysisId: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        // Vérifier que l'analyse appartient à l'utilisateur
        const [analysis] = await db
          .select()
          .from(plantAnalyses)
          .where(
            and(
              eq(plantAnalyses.id, input.analysisId),
              eq(plantAnalyses.userId, ctx.auth.user.id)
            )
          );

        if (!analysis) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Analyse non trouvée',
          });
        }

        const deficiencies = await db
          .select()
          .from(nutrientDeficiencies)
          .where(eq(nutrientDeficiencies.analysisId, input.analysisId))
          .orderBy(desc(nutrientDeficiencies.createdAt));

        return deficiencies;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la récupération des carences',
          cause: error,
        });
      }
    }),

  // ========================================
  // PROCÉDURES POUR LES RECOMMANDATIONS DE TRAITEMENT
  // ========================================

  /**
   * Ajouter une recommandation de traitement
   */
  addTreatmentRecommendation: protectedProcedure
    .input(treatmentRecommendationInsertSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Vérifier que l'analyse appartient à l'utilisateur
        const [analysis] = await db
          .select()
          .from(plantAnalyses)
          .where(
            and(
              eq(plantAnalyses.id, input.analysisId),
              eq(plantAnalyses.userId, ctx.auth.user.id)
            )
          );

        if (!analysis) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Analyse non trouvée',
          });
        }

        const [newTreatment] = await db
          .insert(TreatmentRecommendations)
          .values(input)
          .returning();

        return newTreatment;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de l\'ajout de la recommandation de traitement',
          cause: error,
        });
      }
    }),

  // ========================================
  // PROCÉDURES D'HISTORIQUE ET STATISTIQUES
  // ========================================

  /**
   * Obtenir les statistiques de l'utilisateur
   */
  getUserStats: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        // Statistiques générales
        const [totalAnalyses] = await db
          .select({ count: count() })
          .from(plantAnalyses)
          .where(eq(plantAnalyses.userId, ctx.auth.user.id));

        const [healthyPlants] = await db
          .select({ count: count() })
          .from(plantAnalyses)
          .where(
            and(
              eq(plantAnalyses.userId, ctx.auth.user.id),
              eq(plantAnalyses.isHealthy, true)
            )
          );

        const [diseasedPlants] = await db
          .select({ count: count() })
          .from(plantAnalyses)
          .where(
            and(
              eq(plantAnalyses.userId, ctx.auth.user.id),
              eq(plantAnalyses.isHealthy, false)
            )
          );

        // Statistiques par service
        const serviceStats = await db
          .select({
            service: plantAnalyses.service,
            count: count(),
          })
          .from(plantAnalyses)
          .where(eq(plantAnalyses.userId, ctx.auth.user.id))
          .groupBy(plantAnalyses.service);

        // Statistiques par sévérité
        const severityStats = await db
          .select({
            severity: plantAnalyses.severity,
            count: count(),
          })
          .from(plantAnalyses)
          .where(
            and(
              eq(plantAnalyses.userId, ctx.auth.user.id),
              eq(plantAnalyses.isHealthy, false)
            )
          )
          .groupBy(plantAnalyses.severity);

        // Analyses récentes (30 derniers jours)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [recentAnalyses] = await db
          .select({ count: count() })
          .from(plantAnalyses)
          .where(
            and(
              eq(plantAnalyses.userId, ctx.auth.user.id),
              gte(plantAnalyses.createdAt, thirtyDaysAgo)
            )
          );

        return {
          totalAnalyses: totalAnalyses.count,
          healthyPlants: healthyPlants.count,
          diseasedPlants: diseasedPlants.count,
          recentAnalyses: recentAnalyses.count,
          serviceStats,
          severityStats,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la récupération des statistiques',
          cause: error,
        });
      }
    }),

  /**
   * Obtenir l'historique des analyses avec graphiques temporels
   */
  getAnalysisHistory: protectedProcedure
    .input(z.object({
      period: z.enum(["week", "month", "quarter", "year"]).default("month"),
    }))
    .query(async ({ input, ctx }) => {
      try {
        const { period } = input;
        
        // Calculer la date de début selon la période
        const now = new Date();
        const startDate = new Date();
        
        switch (period) {
          case "week":
            startDate.setDate(now.getDate() - 7);
            break;
          case "month":
            startDate.setMonth(now.getMonth() - 1);
            break;
          case "quarter":
            startDate.setMonth(now.getMonth() - 3);
            break;
          case "year":
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }

        // Requête pour les données temporelles
        const historyData = await db
          .select({
            date: sql<string>`DATE(${plantAnalyses.createdAt})`.as('date'),
            total: count(),
            healthy: sql<number>`SUM(CASE WHEN ${plantAnalyses.isHealthy} = true THEN 1 ELSE 0 END)`.as('healthy'),
            diseased: sql<number>`SUM(CASE WHEN ${plantAnalyses.isHealthy} = false THEN 1 ELSE 0 END)`.as('diseased'),
          })
          .from(plantAnalyses)
          .where(
            and(
              eq(plantAnalyses.userId, ctx.auth.user.id),
              gte(plantAnalyses.createdAt, startDate)
            )
          )
          .groupBy(sql`DATE(${plantAnalyses.createdAt})`)
          .orderBy(asc(sql`DATE(${plantAnalyses.createdAt})`));

        return historyData;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la récupération de l\'historique',
          cause: error,
        });
      }
    }),

  /**
   * Obtenir les plantes les plus analysées
   */
  getTopAnalyzedPlants: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(20).default(10),
    }))
    .query(async ({ input, ctx }) => {
      try {
        const topPlants = await db
          .select({
            plantName: plantAnalyses.plantName,
            count: count(),
            healthyCount: sql<number>`SUM(CASE WHEN ${plantAnalyses.isHealthy} = true THEN 1 ELSE 0 END)`.as('healthyCount'),
            diseasedCount: sql<number>`SUM(CASE WHEN ${plantAnalyses.isHealthy} = false THEN 1 ELSE 0 END)`.as('diseasedCount'),
          })
          .from(plantAnalyses)
          .where(eq(plantAnalyses.userId, ctx.auth.user.id))
          .groupBy(plantAnalyses.plantName)
          .orderBy(desc(count()))
          .limit(input.limit);

        return topPlants;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la récupération des plantes les plus analysées',
          cause: error,
        });
      }
    }),
});