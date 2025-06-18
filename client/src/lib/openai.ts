import OpenAI from "openai";

// Note: Using API key on client-side for development only
// In production, route through your backend
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || "demo_key",
  dangerouslyAllowBrowser: true
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export class OpenAIService {
  async sendMessage(message: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    // Check if we have a valid API key
    if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === "demo_key") {
      return this.getMockResponse(message);
    }

    try {
      const messages = [
        {
          role: "system" as const,
          content: "You are SeggsyBot, a supportive and knowledgeable AI companion specializing in intimacy and relationship guidance. You provide tasteful, professional advice while being warm and understanding. Focus on emotional connection, communication, and healthy relationship dynamics. Keep responses concise but meaningful."
        },
        ...conversationHistory.map(msg => ({
          role: msg.role as "user" | "assistant",
          content: msg.content
        })),
        {
          role: "user" as const,
          content: message
        }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages,
        max_tokens: 500,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content || "I'm here to help with your relationship journey.";
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.getMockResponse(message);
    }
  }

  private getMockResponse(message: string): string {
    const responses = [
      "That's a great question! I'm here to help you explore intimacy and connection in meaningful ways. What specific aspect would you like to discuss?",
      "Communication is so important in relationships. Have you and your partner talked about your needs and desires recently?",
      "I love that you're taking steps to deepen your connection. Building intimacy takes time and patience with yourself and your partner.",
      "Every relationship is unique, and what works for one couple might be different for another. What feels right for you both?",
      "Trust and emotional safety are the foundation of great intimacy. How comfortable do you feel expressing your authentic self?",
      "Small gestures often have the biggest impact. Sometimes it's the everyday moments of connection that matter most."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  async generateSuggestions(userContext: any): Promise<string[]> {
    try {
      const prompt = `Based on this user context: ${JSON.stringify(userContext)}, generate 3 personalized, tasteful intimacy suggestions for couples. Focus on connection, communication, and romance. Return as a JSON array of strings.`;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert relationship coach. Provide tasteful, romantic suggestions for couples to deepen their connection."
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 300
      });

      const result = JSON.parse(response.choices[0]?.message?.content || '{"suggestions": []}');
      return result.suggestions || [];
    } catch (error) {
      console.error('OpenAI suggestions error:', error);
      return [
        "Schedule 15 minutes of phone-free conversation daily",
        "Practice expressing appreciation for one specific thing your partner did today",
        "Plan a surprise activity based on something your partner mentioned recently"
      ];
    }
  }
}

export const openaiService = new OpenAIService();