import {
  users,
  partnerConnections,
  intimacyTracking,
  aiSuggestions,
  assessments,
  chatConversations,
  type User,
  type UpsertUser,
  type PartnerConnection,
  type InsertPartnerConnection,
  type IntimacyTracking,
  type InsertIntimacyTracking,
  type AiSuggestion,
  type InsertAiSuggestion,
  type Assessment,
  type InsertAssessment,
  type ChatConversation,
  type InsertChatConversation,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User>;
  
  // Partner connections
  createPartnerConnection(connection: InsertPartnerConnection): Promise<PartnerConnection>;
  getPartnerConnections(userId: string): Promise<PartnerConnection[]>;
  updatePartnerConnectionStatus(id: number, status: string): Promise<PartnerConnection>;
  
  // Intimacy tracking
  createIntimacyEntry(entry: InsertIntimacyTracking): Promise<IntimacyTracking>;
  getIntimacyEntries(userId: string): Promise<IntimacyTracking[]>;
  getIntimacyStats(userId: string): Promise<any>;
  
  // AI suggestions
  createAiSuggestion(suggestion: InsertAiSuggestion): Promise<AiSuggestion>;
  getUserSuggestions(userId: string): Promise<AiSuggestion[]>;
  markSuggestionRead(id: number): Promise<AiSuggestion>;
  markSuggestionApplied(id: number): Promise<AiSuggestion>;
  
  // Assessments
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getUserAssessments(userId: string): Promise<Assessment[]>;
  
  // Chat conversations
  createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation>;
  updateChatConversation(id: number, messages: any[]): Promise<ChatConversation>;
  getUserChatConversations(userId: string): Promise<ChatConversation[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        subscriptionStatus: "active",
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Partner connections
  async createPartnerConnection(connection: InsertPartnerConnection): Promise<PartnerConnection> {
    const [newConnection] = await db
      .insert(partnerConnections)
      .values(connection)
      .returning();
    return newConnection;
  }

  async getPartnerConnections(userId: string): Promise<PartnerConnection[]> {
    return await db
      .select()
      .from(partnerConnections)
      .where(or(eq(partnerConnections.userId, userId), eq(partnerConnections.partnerId, userId)));
  }

  async updatePartnerConnectionStatus(id: number, status: string): Promise<PartnerConnection> {
    const [connection] = await db
      .update(partnerConnections)
      .set({ status, updatedAt: new Date() })
      .where(eq(partnerConnections.id, id))
      .returning();
    return connection;
  }

  // Intimacy tracking
  async createIntimacyEntry(entry: InsertIntimacyTracking): Promise<IntimacyTracking> {
    const [newEntry] = await db
      .insert(intimacyTracking)
      .values(entry)
      .returning();
    return newEntry;
  }

  async getIntimacyEntries(userId: string): Promise<IntimacyTracking[]> {
    return await db
      .select()
      .from(intimacyTracking)
      .where(eq(intimacyTracking.userId, userId))
      .orderBy(desc(intimacyTracking.date));
  }

  async getIntimacyStats(userId: string): Promise<any> {
    const entries = await this.getIntimacyEntries(userId);
    const recentEntries = entries.slice(0, 7); // Last 7 entries
    
    if (recentEntries.length === 0) {
      return { averageMood: 0, averageConnection: 0, totalEntries: 0 };
    }
    
    const avgMood = recentEntries.reduce((sum, entry) => sum + (entry.mood || 0), 0) / recentEntries.length;
    const avgConnection = recentEntries.reduce((sum, entry) => sum + (entry.connectionLevel || 0), 0) / recentEntries.length;
    
    return {
      averageMood: Math.round(avgMood * 10) / 10,
      averageConnection: Math.round(avgConnection * 10) / 10,
      totalEntries: entries.length,
    };
  }

  // AI suggestions
  async createAiSuggestion(suggestion: InsertAiSuggestion): Promise<AiSuggestion> {
    const [newSuggestion] = await db
      .insert(aiSuggestions)
      .values(suggestion)
      .returning();
    return newSuggestion;
  }

  async getUserSuggestions(userId: string): Promise<AiSuggestion[]> {
    return await db
      .select()
      .from(aiSuggestions)
      .where(eq(aiSuggestions.userId, userId))
      .orderBy(desc(aiSuggestions.createdAt));
  }

  async markSuggestionRead(id: number): Promise<AiSuggestion> {
    const [suggestion] = await db
      .update(aiSuggestions)
      .set({ isRead: true })
      .where(eq(aiSuggestions.id, id))
      .returning();
    return suggestion;
  }

  async markSuggestionApplied(id: number): Promise<AiSuggestion> {
    const [suggestion] = await db
      .update(aiSuggestions)
      .set({ isApplied: true })
      .where(eq(aiSuggestions.id, id))
      .returning();
    return suggestion;
  }

  // Assessments
  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const [newAssessment] = await db
      .insert(assessments)
      .values(assessment)
      .returning();
    return newAssessment;
  }

  async getUserAssessments(userId: string): Promise<Assessment[]> {
    return await db
      .select()
      .from(assessments)
      .where(eq(assessments.userId, userId))
      .orderBy(desc(assessments.completedAt));
  }

  // Chat conversations
  async createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation> {
    const [newConversation] = await db
      .insert(chatConversations)
      .values(conversation)
      .returning();
    return newConversation;
  }

  async updateChatConversation(id: number, messages: any[]): Promise<ChatConversation> {
    const [conversation] = await db
      .update(chatConversations)
      .set({ messages, updatedAt: new Date() })
      .where(eq(chatConversations.id, id))
      .returning();
    return conversation;
  }

  async getUserChatConversations(userId: string): Promise<ChatConversation[]> {
    return await db
      .select()
      .from(chatConversations)
      .where(eq(chatConversations.userId, userId))
      .orderBy(desc(chatConversations.updatedAt));
  }
}

export const storage = new DatabaseStorage();
