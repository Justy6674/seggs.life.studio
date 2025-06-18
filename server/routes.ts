import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
// Firebase backend will be handled client-side for this implementation
import { 
  insertPartnerConnectionSchema,
  insertIntimacyTrackingSchema,
  insertAiSuggestionSchema,
  insertAssessmentSchema,
  insertChatConversationSchema 
} from "@shared/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Stripe (optional for development)
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "demo_key");

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', firebase: 'client-side' });
  });

  // Stripe subscription route
  app.post('/api/get-or-create-subscription', isAuthenticated, async (req: any, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Payment system not configured" });
    }

    const userId = req.user.claims.sub;
    let user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.stripeSubscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        res.json({
          subscriptionId: subscription.id,
          clientSecret: "demo_client_secret_for_development",
        });
        return;
      } catch (error) {
        console.error("Error retrieving subscription:", error);
      }
    }
    
    if (!user.email) {
      return res.status(400).json({ message: 'No user email on file' });
    }

    try {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
      });

      // Create a simple price for development
      const price = await stripe.prices.create({
        currency: 'usd',
        unit_amount: 2900, // $29.00
        recurring: {
          interval: 'month',
        },
        product_data: {
          name: 'Seggs.Life Studio - Couple Plan',
        },
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: price.id }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateUserStripeInfo(userId, customer.id, subscription.id);
  
      res.json({
        subscriptionId: subscription.id,
        clientSecret: "demo_client_secret_for_development",
      });
    } catch (error: any) {
      console.error("Stripe error:", error);
      return res.status(400).json({ error: { message: error.message } });
    }
  });

  // AI Chat endpoint
  app.post('/api/chat', isAuthenticated, async (req: any, res) => {
    try {
      const { message, conversationId } = req.body;
      const userId = req.user.claims.sub;

      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Get or create conversation
      let conversation;
      if (conversationId) {
        const conversations = await storage.getUserChatConversations(userId);
        conversation = conversations.find(c => c.id === conversationId);
      }

      if (!conversation) {
        conversation = await storage.createChatConversation({
          userId,
          messages: [],
        });
      }

      // Add user message
      const userMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };

      const messages = [...(conversation.messages as any[]), userMessage];

      // Generate AI response
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `You are SeggsyBot, a supportive and knowledgeable AI companion specializing in intimacy and relationship guidance. You provide tasteful, professional advice while being warm and understanding. 

Context: You're helping couples and individuals improve their intimate relationships through evidence-based suggestions, communication techniques, and emotional support.

Guidelines:
- Be supportive, non-judgmental, and professional
- Provide practical, actionable advice
- Respect privacy and boundaries
- Focus on emotional connection, communication, and healthy relationship dynamics
- Keep responses concise but meaningful
- If asked about explicit content, redirect to emotional intimacy and connection

User message: ${message}

Please respond as SeggsyBot:`;

      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();

      // Add AI message
      const aiMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...messages, aiMessage];

      // Update conversation
      const updatedConversation = await storage.updateChatConversation(
        conversation.id,
        updatedMessages
      );

      res.json({
        message: aiMessage,
        conversationId: updatedConversation.id,
      });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Partner connections
  app.post('/api/partner-connections', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertPartnerConnectionSchema.parse({
        ...req.body,
        userId,
      });
      
      const connection = await storage.createPartnerConnection(validatedData);
      res.json(connection);
    } catch (error) {
      console.error("Error creating partner connection:", error);
      res.status(400).json({ message: "Failed to create partner connection" });
    }
  });

  app.get('/api/partner-connections', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const connections = await storage.getPartnerConnections(userId);
      res.json(connections);
    } catch (error) {
      console.error("Error fetching partner connections:", error);
      res.status(500).json({ message: "Failed to fetch partner connections" });
    }
  });

  // Intimacy tracking
  app.post('/api/intimacy-tracking', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertIntimacyTrackingSchema.parse({
        ...req.body,
        userId,
      });
      
      const entry = await storage.createIntimacyEntry(validatedData);
      res.json(entry);
    } catch (error) {
      console.error("Error creating intimacy entry:", error);
      res.status(400).json({ message: "Failed to create intimacy entry" });
    }
  });

  app.get('/api/intimacy-tracking', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entries = await storage.getIntimacyEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching intimacy entries:", error);
      res.status(500).json({ message: "Failed to fetch intimacy entries" });
    }
  });

  app.get('/api/intimacy-stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getIntimacyStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching intimacy stats:", error);
      res.status(500).json({ message: "Failed to fetch intimacy stats" });
    }
  });

  // AI suggestions
  app.get('/api/ai-suggestions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const suggestions = await storage.getUserSuggestions(userId);
      res.json(suggestions);
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      res.status(500).json({ message: "Failed to fetch AI suggestions" });
    }
  });

  app.post('/api/ai-suggestions/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const suggestion = await storage.markSuggestionRead(parseInt(id));
      res.json(suggestion);
    } catch (error) {
      console.error("Error marking suggestion as read:", error);
      res.status(400).json({ message: "Failed to mark suggestion as read" });
    }
  });

  // Assessments
  app.post('/api/assessments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertAssessmentSchema.parse({
        ...req.body,
        userId,
      });
      
      const assessment = await storage.createAssessment(validatedData);
      res.json(assessment);
    } catch (error) {
      console.error("Error creating assessment:", error);
      res.status(400).json({ message: "Failed to create assessment" });
    }
  });

  app.get('/api/assessments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const assessments = await storage.getUserAssessments(userId);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  // Member page endpoints
  app.post('/api/boudoir-topics', isAuthenticated, async (req: any, res) => {
    try {
      const { spiciness, blueprintType, userContext } = req.body;
      
      const topics = [
        {
          id: "1",
          title: "Sensory Exploration",
          description: "What texture, scent, or sound instantly makes you feel more connected to your body?",
          tags: ["sensory", "mindfulness", "connection"],
          blueprintRelevant: blueprintType === "Sensual",
          spiciness: spiciness
        },
        {
          id: "2", 
          title: "Fantasy Sharing",
          description: "If you could create the perfect intimate evening, what three elements would you absolutely include?",
          tags: ["fantasy", "planning", "desires"],
          blueprintRelevant: true,
          spiciness: spiciness
        },
        {
          id: "3",
          title: "Appreciation Practice",
          description: "What's one thing about our physical connection that you've been thinking about lately?",
          tags: ["appreciation", "communication", "reflection"],
          blueprintRelevant: blueprintType === "Sexual",
          spiciness: spiciness
        }
      ];

      res.json(topics);
    } catch (error) {
      console.error("Error generating boudoir topics:", error);
      res.status(500).json({ message: "Failed to generate topics" });
    }
  });

  app.post('/api/generate-message', isAuthenticated, async (req: any, res) => {
    try {
      const { audience, tone, spiciness, userContext, partnerName } = req.body;
      
      const audienceText = audience === 'partner' && partnerName ? partnerName : 
                          audience === 'partner' ? 'your partner' :
                          audience === 'self' ? 'yourself' : 'someone special';

      const messages = [
        `Hey ${audienceText}, I've been thinking about you and feeling grateful for the connection we share. There's something magical about the way you make me feel comfortable being myself.`,
        `I love the way we can be both playful and intimate together. You have this amazing ability to make even ordinary moments feel special.`,
        `Just wanted you to know that you've been on my mind today. The way you look at me makes me feel seen and desired in the most wonderful way.`
      ];

      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      res.json({ message: randomMessage });
    } catch (error) {
      console.error("Error generating message:", error);
      res.status(500).json({ message: "Failed to generate message" });
    }
  });

  app.post('/api/blueprint-results', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const results = req.body;
      res.json(results);
    } catch (error) {
      console.error("Error saving blueprint results:", error);
      res.status(500).json({ message: "Failed to save blueprint results" });
    }
  });

  app.post('/api/mood', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { mood, libido } = req.body;
      res.json({ success: true, mood, libido, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error("Error saving mood:", error);
      res.status(500).json({ message: "Failed to save mood" });
    }
  });

  app.put('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updates = req.body;
      res.json({ success: true, message: "Profile updated" });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.post('/api/partner/generate-invite', isAuthenticated, async (req: any, res) => {
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      res.json({ code });
    } catch (error) {
      console.error("Error generating invite code:", error);
      res.status(500).json({ message: "Failed to generate invite code" });
    }
  });

  app.post('/api/partner/link', isAuthenticated, async (req: any, res) => {
    try {
      const { code } = req.body;
      res.json({ 
        partnerId: "partner_123", 
        partnerName: "Your Partner",
        success: true 
      });
    } catch (error) {
      console.error("Error linking partner:", error);
      res.status(500).json({ message: "Failed to link partner" });
    }
  });

  app.delete('/api/partner/unlink', isAuthenticated, async (req: any, res) => {
    try {
      res.json({ success: true });
    } catch (error) {
      console.error("Error unlinking partner:", error);
      res.status(500).json({ message: "Failed to unlink partner" });
    }
  });

  app.post('/api/seggsybot/chat', isAuthenticated, async (req: any, res) => {
    try {
      const { message, userContext, conversationHistory } = req.body;
      
      const responses = [
        "That's a really thoughtful question. Based on your profile, I'd suggest starting with small steps to build comfort and communication.",
        "I understand what you're experiencing. Many people in similar situations find that focusing on emotional connection first can help.",
        "That sounds like a great opportunity for growth. Have you considered discussing this openly with your partner?",
        "Your awareness of this shows great emotional intelligence. Building intimacy is a journey, not a destination."
      ];

      const botResponse = {
        role: 'assistant' as const,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
      };

      res.json({ message: botResponse });
    } catch (error) {
      console.error("Error in SeggsyBot chat:", error);
      res.status(500).json({ message: "Failed to get bot response" });
    }
  });

  // Dashboard data
  app.get('/api/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const [
        intimacyStats,
        suggestions,
        assessments,
        partnerConnections,
        chatConversations,
      ] = await Promise.all([
        storage.getIntimacyStats(userId),
        storage.getUserSuggestions(userId),
        storage.getUserAssessments(userId),
        storage.getPartnerConnections(userId),
        storage.getUserChatConversations(userId),
      ]);

      const partnerConnected = partnerConnections.some(
        conn => conn.status === 'accepted'
      );

      res.json({
        intimacyScore: Math.round((intimacyStats.averageConnection || 0) * 10),
        newSuggestions: suggestions.filter(s => !s.isRead).length,
        completedAssessments: assessments.length,
        partnerConnected,
        chatSessions: chatConversations.length,
        weeklyStats: {
          connections: intimacyStats.totalEntries || 0,
          insights: suggestions.length,
          assessments: assessments.length,
          chatSessions: chatConversations.length,
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
