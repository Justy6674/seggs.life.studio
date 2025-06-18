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

  const httpServer = createServer(app);
  return httpServer;
}