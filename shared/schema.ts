import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionStatus: varchar("subscription_status").default("inactive"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Partner connections
export const partnerConnections = pgTable("partner_connections", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  partnerId: varchar("partner_id").references(() => users.id).notNull(),
  status: varchar("status").default("pending"), // pending, accepted, rejected
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Intimacy tracking entries
export const intimacyTracking = pgTable("intimacy_tracking", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  date: timestamp("date").notNull(),
  mood: integer("mood"), // 1-10 scale
  connectionLevel: integer("connection_level"), // 1-10 scale
  notes: text("notes"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI suggestions
export const aiSuggestions = pgTable("ai_suggestions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  category: varchar("category").notNull(), // communication, intimacy, activity, etc.
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  isApplied: boolean("is_applied").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Assessment results
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type").notNull(), // personality, communication_style, intimacy_blueprint, etc.
  results: jsonb("results").notNull(),
  score: decimal("score", { precision: 5, scale: 2 }),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Chat conversations with AI
export const chatConversations = pgTable("chat_conversations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  messages: jsonb("messages").notNull(), // Array of message objects
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertPartnerConnection = typeof partnerConnections.$inferInsert;
export type PartnerConnection = typeof partnerConnections.$inferSelect;
export type InsertIntimacyTracking = typeof intimacyTracking.$inferInsert;
export type IntimacyTracking = typeof intimacyTracking.$inferSelect;
export type InsertAiSuggestion = typeof aiSuggestions.$inferInsert;
export type AiSuggestion = typeof aiSuggestions.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;
export type Assessment = typeof assessments.$inferSelect;
export type InsertChatConversation = typeof chatConversations.$inferInsert;
export type ChatConversation = typeof chatConversations.$inferSelect;

// Zod schemas
export const insertPartnerConnectionSchema = createInsertSchema(partnerConnections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIntimacyTrackingSchema = createInsertSchema(intimacyTracking).omit({
  id: true,
  createdAt: true,
});

export const insertAiSuggestionSchema = createInsertSchema(aiSuggestions).omit({
  id: true,
  createdAt: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  completedAt: true,
});

export const insertChatConversationSchema = createInsertSchema(chatConversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
