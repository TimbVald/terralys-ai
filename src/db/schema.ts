import { boolean, pgEnum, pgTable, text, timestamp, integer, real, json } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";


export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const agents = pgTable("agents", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  instruction: text("instruction").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const meetingStatus = pgEnum("meeting_status", [
  "upcoming",
  "active",
  "completed",
  "processing",
  "cancelled"
])

export const meeting = pgTable("meeting", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id, { onDelete: "cascade" }),
  status: meetingStatus("status").notNull().default("upcoming"),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  transcriptUrl: text("transcript_url"),
  recordingUrl: text("recording_url"),
  summary: text("summary"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});


// ========================================
// TABLE DE SUIVI DES CULTURES
// ========================================

export const cultures = pgTable("cultures", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").$defaultFn(() => /* @__PURE__ */ new Date()),
  endDate: timestamp("end_date"),
  location: text("location"),
  cropType: text("crop_type"),
  notes: text("notes"),
  createdAt: timestamp("created_at").$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
});

// ========================================
// SCHÉMAS POUR LE MODULE PLANT DISEASE DETECTION
// ========================================

/**
 * Enum pour les niveaux de sévérité des maladies et parasites
 */
export const severityLevel = pgEnum("severity_level", [
  "low",
  "medium", 
  "high"
]);

/**
 * Enum pour les services d'analyse disponibles
 */
export const analysisService = pgEnum("analysis_service", [
  "local",
  "backend",
  "gemini"
]);

/**
 * Table des analyses de plantes - stocke chaque analyse effectuée par un utilisateur
 */
export const plantAnalyses = pgTable("plant_analyses", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  cultureId: text("culture_id")
    .references(() => cultures.id, { onDelete: "set null" }),
  imageUrl: text("image_url").notNull(),
  plantName: text("plant_name").notNull(),
  isHealthy: boolean("is_healthy").notNull(),
  diseaseName: text("disease_name"),
  description: text("description").notNull(),
  treatmentSuggestions: json("treatment_suggestions").$type<string[]>().notNull(),
  benefits: json("benefits").$type<string[]>().notNull(),
  confidenceScore: real("confidence_score").notNull(),
  preventativeCareTips: json("preventative_care_tips").$type<string[]>().notNull(),
  progressAssessment: text("progress_assessment"),
  comparativeAnalysis: text("comparative_analysis"),
  notes: text("notes"),
  severity: severityLevel("severity"),
  service: analysisService("service").notNull(),
  preventiveMeasures: json("preventive_measures").$type<string[]>(),
  recommendations: json("recommendations").$type<string[]>(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

/**
 * Table des données environnementales liées aux analyses
 */
export const environmentalData = pgTable("environmental_data", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  analysisId: text("analysis_id")
    .notNull()
    .references(() => plantAnalyses.id, { onDelete: "cascade" }),
  temperature: real("temperature"),
  humidity: real("humidity"),
  soilMoisture: real("soil_moisture"),
  lightIntensity: real("light_intensity"),
  phLevel: real("ph_level"),
  location: text("location"),
  soilType: text("soil_type"),
  lastWatering: text("last_watering"),
  fertilizer: text("fertilizer"),
  additionalInfo: text("additional_info"),
  sunlight: text("sunlight"),
  watering: text("watering"),
  notes: text("notes"),
  organicPreference: boolean("organic_preference"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

/**
 * Table des identifications de parasites pour chaque analyse
 */
export const pestIdentifications = pgTable("pest_identifications", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  analysisId: text("analysis_id")
    .notNull()
    .references(() => plantAnalyses.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  treatment: text("treatment").notNull(),
  severity: severityLevel("severity").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

/**
 * Table des carences nutritionnelles identifiées pour chaque analyse
 */
export const nutrientDeficiencies = pgTable("nutrient_deficiencies", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  analysisId: text("analysis_id")
    .notNull()
    .references(() => plantAnalyses.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  deficiencySymptoms: text("deficiency_symptoms"),
  sources: json("sources").$type<string[]>().notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

/**
 * Table des réponses d'analyse complètes - correspond à AnalysisResponse
 */
export const analysisResponses = pgTable("analysis_responses", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  analysisId: text("analysis_id")
    .notNull()
    .references(() => plantAnalyses.id, { onDelete: "cascade" }),
  success: boolean("success").notNull(),
  analysisTime: real("analysis_time").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  errorMessage: text("error_message"),
  // Classification result
  classificationResult: json("classification_result").$type<string[]>(),
  // Treatment recommendation
  treatmentId: text("treatment_id").references(() => TreatmentRecommendations.id),
  // Pest identification (JSON array)
  pestIdentification: text("pest_identification_id").references(() => pestIdentifications.id),
  // Nutrient deficiencies (JSON array)
  nutrientDeficiencies: text("nutrient_deficiencies_id").references(() => nutrientDeficiencies.id),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

/**
 * Table des recommandations de traitement détaillées - correspond à TreatmentRecommendation
 */
export const TreatmentRecommendations = pgTable("treatment_recommendations", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  analysisId: text("analysis_id")
    .notNull()
    .references(() => plantAnalyses.id, { onDelete: "cascade" }),
  immediateActions: json("immediate_actions").$type<string[]>().notNull(),
  treatmentOptions: json("treatment_options").$type<Record<string, string[]>>().notNull(),
  preventionStrategy: json("prevention_strategy").$type<string[]>().notNull(),
  monitoringFollowup: json("monitoring_followup").$type<string[]>().notNull(),
  expectedTimeline: text("expected_timeline").notNull(),
  confidenceLevel: text("confidence_level").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});