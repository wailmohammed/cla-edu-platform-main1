import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  json,
  date,
  datetime,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  passwordHash: varchar("passwordHash", { length: 255 }),
  emailVerified: boolean("emailVerified").default(false),
  emailVerifyTokenHash: varchar("emailVerifyTokenHash", { length: 128 }),
  emailVerifyExpires: timestamp("emailVerifyExpires"),
  resetPasswordTokenHash: varchar("resetPasswordTokenHash", { length: 128 }),
  resetPasswordExpires: timestamp("resetPasswordExpires"),
  role: mysqlEnum("role", ["user", "admin", "super_admin"]).default("user").notNull(),
  isSuperAdmin: boolean("isSuperAdmin").default(false),
  
  // Subscription & Premium
  subscriptionTier: mysqlEnum("subscriptionTier", ["free", "premium"]).default("free").notNull(),
  subscriptionStatus: mysqlEnum("subscriptionStatus", ["active", "cancelled", "expired", "trial"]).default("active"),
  
  // Payment provider IDs (support multiple providers)
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  paypalCustomerId: varchar("paypalCustomerId", { length: 255 }),
  paypalSubscriptionId: varchar("paypalSubscriptionId", { length: 255 }),
  paddleCustomerId: varchar("paddleCustomerId", { length: 255 }),
  paddleSubscriptionId: varchar("paddleSubscriptionId", { length: 255 }),
  
  subscriptionStartDate: timestamp("subscriptionStartDate"),
  subscriptionEndDate: timestamp("subscriptionEndDate"),
  
  // Onboarding & Preferences
  learningGoal: varchar("learningGoal", { length: 255 }), // e.g., "web-development", "data-science", "general"
  recommendedPath: varchar("recommendedPath", { length: 255 }), // recommended course path ID
  onboardingCompleted: boolean("onboardingCompleted").default(false),
  
  // Gamification
  totalXP: int("totalXP").default(0),
  level: int("level").default(1),
  currentStreakDays: int("currentStreakDays").default(0),
  longestStreakDays: int("longestStreakDays").default(0),
  lastActivityDate: date("lastActivityDate"),
  freezeDaysRemaining: int("freezeDaysRemaining").default(2), // 2 freeze days per month
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Courses - Main course entities
 */
export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 255 }), // emoji or icon name
  category: mysqlEnum("category", [
    "programming",
    "web-development",
    "data-science",
    "mathematics",
    "algorithms",
    "databases",
    "devops",
    "ai-ml",
    "other",
  ]).notNull(),
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced"]).notNull(),
  language: varchar("language", { length: 64 }), // e.g., "python", "javascript"
  
  // Course metadata
  totalLessons: int("totalLessons").default(0),
  estimatedHours: decimal("estimatedHours", { precision: 5, scale: 1 }),
  enrollmentCount: int("enrollmentCount").default(0),
  
  // Premium flag
  isPremium: boolean("isPremium").default(false),
  
  // Ordering
  displayOrder: int("displayOrder").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

/**
 * Lessons - Individual lessons within courses
 */
export const lessons = mysqlTable("lessons", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  
  // Content
  theoryContent: text("theoryContent"), // markdown content
  exampleCode: text("exampleCode"),
  
  // Lesson type
  lessonType: mysqlEnum("lessonType", ["theory", "challenge", "quiz", "project"]).notNull(),
  
  // Ordering
  displayOrder: int("displayOrder").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;

/**
 * Exercises - Code exercises within lessons
 */
export const exercises = mysqlTable("exercises", {
  id: int("id").autoincrement().primaryKey(),
  lessonId: int("lessonId").notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  
  // Code setup
  language: varchar("language", { length: 64 }).notNull(), // e.g., "python", "javascript"
  starterCode: text("starterCode"),
  solution: text("solution"),
  
  // Test cases
  testCases: json("testCases"), // Array of test cases
  
  // XP reward
  xpReward: int("xpReward").default(10),
  
  // Difficulty
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).default("easy"),
  
  // Ordering
  displayOrder: int("displayOrder").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = typeof exercises.$inferInsert;

/**
 * User Progress - Track user progress through courses and lessons
 */
export const userProgress = mysqlTable("userProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  
  // Progress tracking
  completedLessons: int("completedLessons").default(0),
  totalLessons: int("totalLessons").default(0),
  progressPercentage: decimal("progressPercentage", { precision: 5, scale: 2 }).default("0.00"),
  
  // Status
  status: mysqlEnum("status", ["not-started", "in-progress", "completed"]).default("not-started"),
  
  // Dates
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;

/**
 * Lesson Completion - Track individual lesson completions
 */
export const lessonCompletion = mysqlTable("lessonCompletion", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lessonId: int("lessonId").notNull(),
  
  // Completion data
  completed: boolean("completed").default(false),
  xpEarned: int("xpEarned").default(0),
  
  // Dates
  completedAt: timestamp("completedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LessonCompletion = typeof lessonCompletion.$inferSelect;
export type InsertLessonCompletion = typeof lessonCompletion.$inferInsert;

/**
 * Exercise Submissions - Track user exercise submissions
 */
export const exerciseSubmissions = mysqlTable("exerciseSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  exerciseId: int("exerciseId").notNull(),
  
  // Submission data
  code: text("code"),
  passed: boolean("passed").default(false),
  testResults: json("testResults"), // Array of test results
  xpEarned: int("xpEarned").default(0),
  
  // Dates
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ExerciseSubmission = typeof exerciseSubmissions.$inferSelect;
export type InsertExerciseSubmission = typeof exerciseSubmissions.$inferInsert;

/**
 * Streaks - Track user daily streaks
 */
export const streaks = mysqlTable("streaks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  // Streak data
  currentStreak: int("currentStreak").default(0),
  longestStreak: int("longestStreak").default(0),
  freezeDaysUsed: int("freezeDaysUsed").default(0),
  
  // Dates
  lastActivityDate: date("lastActivityDate"),
  streakStartDate: date("streakStartDate"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Streak = typeof streaks.$inferSelect;
export type InsertStreak = typeof streaks.$inferInsert;

/**
 * Badges - Achievements/badges earned by users
 */
export const badges = mysqlTable("badges", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 255 }), // emoji or icon name
  
  // Badge type
  badgeType: mysqlEnum("badgeType", [
    "streak",
    "completion",
    "achievement",
    "milestone",
    "special",
  ]).notNull(),
  
  // Criteria
  criteria: json("criteria"), // e.g., { type: "streak", days: 7 }
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;

/**
 * User Badges - Track badges earned by users
 */
export const userBadges = mysqlTable("userBadges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  badgeId: int("badgeId").notNull(),
  
  // Earned date
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = typeof userBadges.$inferInsert;

/**
 * Certificates - Course completion certificates
 */
export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  
  // Certificate data
  certificateNumber: varchar("certificateNumber", { length: 255 }).notNull().unique(),
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;

/**
 * Leaderboard - User rankings
 */
export const leaderboard = mysqlTable("leaderboard", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Ranking data
  rank: int("rank"),
  weeklyXP: int("weeklyXP").default(0),
  totalXP: int("totalXP").default(0),
  
  // Period
  period: mysqlEnum("period", ["weekly", "monthly", "all-time"]).notNull(),
  
  // Dates
  weekStartDate: date("weekStartDate"),
  monthStartDate: date("monthStartDate"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Leaderboard = typeof leaderboard.$inferSelect;
export type InsertLeaderboard = typeof leaderboard.$inferInsert;

/**
 * Friends - User friendships for challenges
 */
export const friends = mysqlTable("friends", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  friendId: int("friendId").notNull(),
  
  // Status
  status: mysqlEnum("status", ["pending", "accepted", "blocked"]).default("pending"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Friend = typeof friends.$inferSelect;
export type InsertFriend = typeof friends.$inferInsert;

/**
 * Challenges - Friend challenges
 */
export const challenges = mysqlTable("challenges", {
  id: int("id").autoincrement().primaryKey(),
  challengerId: int("challengerId").notNull(),
  challengedId: int("challengedId").notNull(),
  
  // Challenge data
  exerciseId: int("exerciseId"),
  courseId: int("courseId"),
  
  // Status
  status: mysqlEnum("status", ["pending", "accepted", "completed", "declined"]).default("pending"),
  
  // Results
  challengerScore: int("challengerScore"),
  challengedScore: int("challengedScore"),
  winner: int("winner"), // user ID of winner
  
  // Dates
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = typeof challenges.$inferInsert;
export const tickets = mysqlTable("tickets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["open", "closed", "escalated"]).default("open").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  closedAt: timestamp("closedAt"),
});

export const ticketsRelations = relations(tickets, ({ one }) => ({
  user: one(users, { fields: [tickets.userId], references: [users.id] }),
}));

/**
 * Payment Providers - Configuration for payment providers (Stripe, PayPal, Paddle)
 */
export const paymentProviders = mysqlTable("paymentProviders", {
  id: int("id").autoincrement().primaryKey(),
  provider: mysqlEnum("provider", ["stripe", "paypal", "paddle"]).notNull(),
  
  // Configuration
  isActive: boolean("isActive").default(false),
  isDefault: boolean("isDefault").default(false),
  
  // API credentials (encrypted in production)
  apiKey: varchar("apiKey", { length: 512 }),
  apiSecret: varchar("apiSecret", { length: 512 }),
  webhookSecret: varchar("webhookSecret", { length: 512 }),
  
  // Provider-specific config
  clientId: varchar("clientId", { length: 255 }),
  clientSecret: varchar("clientSecret", { length: 512 }),
  
  // Environment
  environment: mysqlEnum("environment", ["sandbox", "production"]).default("sandbox"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PaymentProvider = typeof paymentProviders.$inferSelect;
export type InsertPaymentProvider = typeof paymentProviders.$inferInsert;

/**
 * Payments - Payment transaction records
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Payment details
  provider: mysqlEnum("provider", ["stripe", "paypal", "paddle"]).notNull(),
  providerTransactionId: varchar("providerTransactionId", { length: 255 }),
  
  // Amount
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  
  // Type
  paymentType: mysqlEnum("paymentType", ["course", "subscription", "mentorship", "other"]).notNull(),
  itemId: int("itemId"), // courseId, subscriptionId, etc.
  
  // Status
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending"),
  
  // Metadata
  metadata: json("metadata"),
  
  // Dates
  completedAt: timestamp("completedAt"),
  refundedAt: timestamp("refundedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Subscriptions - Subscription records for audit trail
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Subscription data
  provider: mysqlEnum("provider", ["stripe", "paypal", "paddle"]).notNull(),
  providerSubscriptionId: varchar("providerSubscriptionId", { length: 255 }),
  providerCustomerId: varchar("providerCustomerId", { length: 255 }),
  
  plan: mysqlEnum("plan", ["free", "basic", "pro", "enterprise"]).notNull(),
  
  // Status
  status: mysqlEnum("status", ["active", "cancelled", "expired", "trial"]).default("active"),
  
  // Dates
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate"),
  renewalDate: timestamp("renewalDate"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Relations
 */
export const coursesRelations = relations(courses, ({ many }) => ({
  lessons: many(lessons),
  userProgress: many(userProgress),
  certificates: many(certificates),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
  }),
  exercises: many(exercises),
  completions: many(lessonCompletion),
}));

export const lessonCompletionRelations = relations(lessonCompletion, ({ one }) => ({
  user: one(users, {
    fields: [lessonCompletion.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [lessonCompletion.lessonId],
    references: [lessons.id],
  }),
}));

export const exerciseSubmissionsRelations = relations(exerciseSubmissions, ({ one }) => ({
  user: one(users, {
    fields: [exerciseSubmissions.userId],
    references: [users.id],
  }),
  exercise: one(exercises, {
    fields: [exerciseSubmissions.exerciseId],
    references: [exercises.id],
  }),
}));

export const streaksRelations = relations(streaks, ({ one }) => ({
  user: one(users, {
    fields: [streaks.userId],
    references: [users.id],
  }),
}));

export const friendsRelations = relations(friends, ({ one }) => ({
  user: one(users, {
    fields: [friends.userId],
    references: [users.id],
  }),
  friend: one(users, {
    fields: [friends.friendId],
    references: [users.id],
  }),
}));

export const challengesRelations = relations(challenges, ({ one }) => ({
  challenger: one(users, {
    fields: [challenges.challengerId],
    references: [users.id],
  }),
  challenged: one(users, {
    fields: [challenges.challengedId],
    references: [users.id],
  }),
  exercise: one(exercises, {
    fields: [challenges.exerciseId],
    references: [exercises.id],
  }),
  course: one(courses, {
    fields: [challenges.courseId],
    references: [courses.id],
  }),
}));

export const leaderboardRelations = relations(leaderboard, ({ one }) => ({
  user: one(users, {
    fields: [leaderboard.userId],
    references: [users.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

/**
 * Education Oracle — Pythia-inspired learning intelligence layer.
 */

export const learningEvents = mysqlTable("learningEvents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  category: varchar("category", { length: 64 }).notNull(),
  source: varchar("source", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  summary: text("summary"),
  lat: decimal("lat", { precision: 9, scale: 6 }),
  lng: decimal("lng", { precision: 9, scale: 6 }),
  salience: decimal("salience", { precision: 3, scale: 2 }).default("0.50"),
  ts: timestamp("ts").defaultNow().notNull(),
  raw: json("raw"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LearningEvent = typeof learningEvents.$inferSelect;
export type InsertLearningEvent = typeof learningEvents.$inferInsert;

export const learningBriefs = mysqlTable("learningBriefs", {
  id: varchar("id", { length: 64 }).notNull().primaryKey(),
  ts: timestamp("ts").defaultNow().notNull(),
  eventCount: int("eventCount").default(0),
  domains: json("domains"),
  text: text("text"),
  topEvents: json("topEvents"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LearningBrief = typeof learningBriefs.$inferSelect;
export type InsertLearningBrief = typeof learningBriefs.$inferInsert;

export const predictions = mysqlTable("predictions", {
  id: varchar("id", { length: 64 }).notNull().primaryKey(),
  userId: int("userId"),
  statement: text("statement").notNull(),
  horizon: varchar("horizon", { length: 16 }).notNull(),
  probability: decimal("probability", { precision: 5, scale: 2 }).notNull(),
  reasoning: text("reasoning"),
  drivers: json("drivers"),
  location: varchar("location", { length: 255 }),
  lat: decimal("lat", { precision: 9, scale: 6 }),
  lng: decimal("lng", { precision: 9, scale: 6 }),
  agents: json("agents"),
  baseProbability: decimal("baseProbability", { precision: 5, scale: 2 }),
  prevProbability: decimal("prevProbability", { precision: 5, scale: 2 }),
  split: boolean("split").default(false),
  briefId: varchar("briefId", { length: 64 }),
  ts: timestamp("ts").defaultNow().notNull(),
  resolved: boolean("resolved").default(false),
  verdict: varchar("verdict", { length: 16 }),
  resolvedAt: timestamp("resolvedAt"),
});

export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = typeof predictions.$inferInsert;

export const personas = mysqlTable("personas", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 64 }).notNull().unique(),
  lens: text("lens").notNull(),
  systemPrompt: text("systemPrompt").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Persona = typeof personas.$inferSelect;
export type InsertPersona = typeof personas.$inferInsert;

export const userPersonaPrefs = mysqlTable("userPersonaPrefs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  personaId: int("personaId").notNull(),
  model: varchar("model", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPersonaPref = typeof userPersonaPrefs.$inferSelect;
export type InsertUserPersonaPref = typeof userPersonaPrefs.$inferInsert;

export const alertRules = mysqlTable("alertRules", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  kind: varchar("kind", { length: 32 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  params: json("params").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AlertRule = typeof alertRules.$inferSelect;
export type InsertAlertRule = typeof alertRules.$inferInsert;

export const alertFeed = mysqlTable("alertFeed", {
  id: int("id").autoincrement().primaryKey(),
  ruleId: int("ruleId"),
  userId: int("userId").notNull(),
  kind: varchar("kind", { length: 32 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body"),
  ts: timestamp("ts").defaultNow().notNull(),
  read: boolean("read").default(false).notNull(),
});

export type AlertFeedItem = typeof alertFeed.$inferSelect;
export type InsertAlertFeedItem = typeof alertFeed.$inferInsert;

export const morningBriefs = mysqlTable("morningBriefs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  text: text("text").notNull(),
  eventCount: int("eventCount").default(0),
  domains: json("domains"),
  ts: timestamp("ts").defaultNow().notNull(),
  read: boolean("read").default(false).notNull(),
});

export type MorningBrief = typeof morningBriefs.$inferSelect;
export type InsertMorningBrief = typeof morningBriefs.$inferInsert;

export const predictionResolutions = mysqlTable("predictionResolutions", {
  id: int("id").autoincrement().primaryKey(),
  predictionId: varchar("predictionId", { length: 64 }).notNull(),
  verdict: varchar("verdict", { length: 16 }).notNull(),
  evidence: text("evidence"),
  model: varchar("model", { length: 128 }),
  judgedAt: timestamp("judgedAt").defaultNow().notNull(),
});

export type PredictionResolution = typeof predictionResolutions.$inferSelect;
export type InsertPredictionResolution = typeof predictionResolutions.$inferInsert;

export const paymentProvidersRelations = relations(paymentProviders, ({ many }) => ({
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));



export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [exercises.lessonId],
    references: [lessons.id],
  }),
  submissions: many(exerciseSubmissions),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [userProgress.courseId],
    references: [courses.id],
  }),
}));

export const certificatesRelations = relations(certificates, ({ one }) => ({
  user: one(users, {
    fields: [certificates.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [certificates.courseId],
    references: [courses.id],
  }),
}));

export const learningEventsRelations = relations(learningEvents, ({ one }) => ({
  user: one(users, {
    fields: [learningEvents.userId],
    references: [users.id],
  }),
}));

export const predictionsRelations = relations(predictions, ({ one }) => ({
  user: one(users, {
    fields: [predictions.userId],
    references: [users.id],
  }),
}));

export const userPersonaPrefsRelations = relations(userPersonaPrefs, ({ one }) => ({
  user: one(users, {
    fields: [userPersonaPrefs.userId],
    references: [users.id],
  }),
  persona: one(personas, {
    fields: [userPersonaPrefs.personaId],
    references: [personas.id],
  }),
}));

export const alertRulesRelations = relations(alertRules, ({ one }) => ({
  user: one(users, {
    fields: [alertRules.userId],
    references: [users.id],
  }),
}));

export const alertFeedRelations = relations(alertFeed, ({ one }) => ({
  user: one(users, {
    fields: [alertFeed.userId],
    references: [users.id],
  }),
}));

export const morningBriefsRelations = relations(morningBriefs, ({ one }) => ({
  user: one(users, {
    fields: [morningBriefs.userId],
    references: [users.id],
  }),
}));
