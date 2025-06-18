import type { Express } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";

// Initialize OpenAI for Boudoir generator
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY || "demo_key",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Boudoir idea generator endpoint (public for now, can be secured later)
  app.post('/api/boudoir/generate', async (req, res) => {
    try {
      const { topic, spiciness, userBlueprint, partnerBlueprint, userIdentity } = req.body;
      
      if (!topic || !spiciness || !userBlueprint) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const prompt = `User Identity: ${userIdentity || 'Individual'}
Top Blueprint: ${userBlueprint}
Spiciness Level: ${spiciness}
Topic: ${topic}
${partnerBlueprint ? `Partner Blueprint: ${partnerBlueprint}` : ''}

Create 1 intimacy idea. Make it creative, emotionally intelligent, non-cringe. Do not repeat topic name. Adapt tone to spiciness level.

Spiciness Guidelines:
1: Safe, playful, lighthearted
2: Flirty, suggestive, sweet  
3: Cheeky, bold, romantic
4: Sensual, physical, intense
5: Erotic, daring, but still elegant

Return only the suggestion, no additional text.`;

      // Use OpenAI to generate authentic suggestions
      let suggestion = "";
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert in intimacy and relationship guidance, specializing in Erotic Blueprint theory. Generate tasteful, creative suggestions that help couples connect more deeply."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.8
        });

        suggestion = response.choices[0]?.message?.content || "Create a meaningful moment of connection that honors both of your unique desires and communication styles.";
      } catch (error) {
        console.error("OpenAI API error:", error);
        // Fallback only if API fails
        const fallbackSuggestions = {
          1: "Try writing a sweet note about something you appreciate about your connection and leave it somewhere they'll find it.",
          2: "Send a text describing your favorite memory together and hint at creating a new one soon.",
          3: "Plan a surprise date night at home with candles, music, and their favorite meal.",
          4: "Create a playlist of songs that remind you of intimate moments and share it with a personal message.",
          5: "Write a letter expressing your desires and what you'd like to explore together, then read it aloud."
        };
        suggestion = fallbackSuggestions[spiciness as keyof typeof fallbackSuggestions] || fallbackSuggestions[3];
      }
      
      res.json({ 
        suggestion,
        topic,
        spiciness,
        blueprint: userBlueprint
      });
    } catch (error) {
      console.error("Boudoir generation error:", error);
      res.status(500).json({ error: "Failed to generate suggestion" });
    }
  });

  // Blueprint quiz results storage (public endpoint)
  app.post('/api/blueprint/results', (req, res) => {
    try {
      const { scores, topBlueprint } = req.body;
      
      // For now, just return the results (Firebase will handle storage client-side)
      res.json({ 
        success: true, 
        scores, 
        topBlueprint,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Blueprint results error:", error);
      res.status(500).json({ error: "Failed to save results" });
    }
  });

  // Partner invite code generation
  app.post('/api/partner/generate-code', (req, res) => {
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      res.json({ code });
    } catch (error) {
      console.error("Code generation error:", error);
      res.status(500).json({ error: "Failed to generate code" });
    }
  });

  // SeggsyBot chat endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, conversationHistory = [] } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Build conversation context for OpenAI
      const messages = [
        {
          role: "system",
          content: "You are SeggsyBot, an expert intimacy and relationship coach specializing in Erotic Blueprint theory. You provide warm, supportive, and practical guidance to help people improve their intimate connections. Keep responses helpful, respectful, and tasteful while being knowledgeable about intimacy, communication, and relationships."
        },
        ...conversationHistory.slice(-5).map((msg: any) => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: "user",
          content: message
        }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: messages,
        max_tokens: 300,
        temperature: 0.7
      });

      const botResponse = {
        role: 'assistant',
        content: response.choices[0]?.message?.content || 'I apologize, but I experienced a brief connection issue. Could you please try asking your question again?',
        timestamp: new Date().toISOString(),
      };

      res.json({ 
        message: botResponse,
        conversationId: Date.now()
      });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ error: 'Chat service temporarily unavailable' });
    }
  });

  // User profile endpoint
  app.get('/api/user/profile/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Mock user profile data - replace with Firestore integration
      const profiles = {
        'demo_user_1': {
          id: 'demo_user_1',
          firstName: 'Alex',
          lastName: 'Smith',
          email: 'alex@example.com',
          blueprintType: 'Sensual',
          blueprintScores: {
            sensual: 65,
            sexual: 20,
            energetic: 45,
            kinky: 15,
            shapeshifter: 30
          },
          partnerId: null,
          partnerName: null,
          partnerLinked: false,
          createdAt: new Date().toISOString()
        }
      };

      const profile = profiles[userId as keyof typeof profiles];
      
      if (!profile) {
        return res.json({
          id: userId,
          blueprintType: null,
          partnerLinked: false,
          createdAt: new Date().toISOString()
        });
      }

      res.json(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  });

  // Blueprint completion endpoint
  app.post('/api/blueprint/complete', async (req, res) => {
    try {
      const { userId, results } = req.body;
      
      if (!userId || !results) {
        return res.status(400).json({ error: 'Missing userId or results' });
      }

      // Mock saving blueprint results - replace with Firestore integration
      const savedResults = {
        userId,
        blueprintType: results.primaryType,
        blueprintScores: results.scores,
        completedAt: results.completedAt,
        success: true
      };

      res.json(savedResults);
    } catch (error) {
      console.error("Error saving blueprint results:", error);
      res.status(500).json({ error: 'Failed to save blueprint results' });
    }
  });

  // Partner status endpoint
  app.get('/api/partner/status/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Mock partner status data - replace with Firestore integration
      const partnerStatus = {
        id: `connection_${userId}`,
        userId,
        status: 'none', // 'none', 'pending', 'connected'
        inviteCode: null,
        partnerId: null,
        partnerName: null,
        createdAt: new Date().toISOString()
      };

      res.json(partnerStatus);
    } catch (error) {
      console.error("Error fetching partner status:", error);
      res.status(500).json({ error: 'Failed to fetch partner status' });
    }
  });

  // Generate partner invite code endpoint
  app.post('/api/partner/generate-code', async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
      }

      // Generate 6-digit invite code
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Mock saving invite code - replace with Firestore integration
      const connection = {
        id: `connection_${userId}`,
        userId,
        status: 'pending',
        inviteCode,
        partnerId: null,
        partnerName: null,
        createdAt: new Date().toISOString()
      };

      res.json(connection);
    } catch (error) {
      console.error("Error generating invite code:", error);
      res.status(500).json({ error: 'Failed to generate invite code' });
    }
  });

  // Link partner endpoint
  app.post('/api/partner/link', async (req, res) => {
    try {
      const { userId, inviteCode } = req.body;
      
      if (!userId || !inviteCode) {
        return res.status(400).json({ error: 'Missing userId or inviteCode' });
      }

      // Mock partner linking - replace with Firestore integration
      // Simulate successful connection
      const connection = {
        id: `connection_${userId}`,
        userId,
        status: 'connected',
        partnerId: 'partner_demo',
        partnerName: 'Sam',
        inviteCode: null,
        createdAt: new Date().toISOString()
      };

      res.json(connection);
    } catch (error) {
      console.error("Error linking partner:", error);
      res.status(500).json({ error: 'Failed to link partner' });
    }
  });

  // Unlink partner endpoint
  app.post('/api/partner/unlink', async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
      }

      // Mock partner unlinking - replace with Firestore integration
      const connection = {
        id: `connection_${userId}`,
        userId,
        status: 'none',
        partnerId: null,
        partnerName: null,
        inviteCode: null,
        createdAt: new Date().toISOString()
      };

      res.json(connection);
    } catch (error) {
      console.error("Error unlinking partner:", error);
      res.status(500).json({ error: 'Failed to unlink partner' });
    }
  });

  // Recent suggestions endpoint
  app.get('/api/user/recent-suggestions/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Mock recent suggestions - replace with Firestore integration
      const suggestions = [
        {
          id: '1',
          content: 'Create a romantic bath setting with candles and essential oils, focusing on slow, mindful touch.',
          topic: 'Sensory Experiences',
          createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          id: '2',
          content: 'Write a heartfelt letter expressing your appreciation for your partner and leave it where they will find it.',
          topic: 'Communication Starters',
          createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        },
        {
          id: '3',
          content: 'Plan a surprise picnic in your living room with favorite foods and soft music.',
          topic: 'Date Night Ideas',
          createdAt: new Date(Date.now() - 259200000).toISOString() // 3 days ago
        }
      ];

      res.json(suggestions);
    } catch (error) {
      console.error("Error fetching recent suggestions:", error);
      res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}