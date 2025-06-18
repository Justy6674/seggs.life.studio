import OpenAI from "openai";

// Note: Using API key on client-side for development only
// In production, route through your backend
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export class OpenAIService {
  async sendMessage(message: string, conversationHistory: ChatMessage[] = []): Promise<string> {
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
      throw new Error('Failed to get response from AI');
    }
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
