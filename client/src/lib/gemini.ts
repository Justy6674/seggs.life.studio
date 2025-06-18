import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "demo_key"
);

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: "gemini-pro" });

  async sendMessage(message: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    try {
      const context = conversationHistory
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const prompt = `You are SeggsyBot, a supportive and knowledgeable AI companion specializing in intimacy and relationship guidance. You provide tasteful, professional advice while being warm and understanding.

Context: You're helping couples and individuals improve their intimate relationships through evidence-based suggestions, communication techniques, and emotional support.

Guidelines:
- Be supportive, non-judgmental, and professional
- Provide practical, actionable advice
- Respect privacy and boundaries
- Focus on emotional connection, communication, and healthy relationship dynamics
- Keep responses concise but meaningful
- If asked about explicit content, redirect to emotional intimacy and connection

Previous conversation:
${context}

User message: ${message}

Please respond as SeggsyBot:`;

      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
  }

  async generateSuggestions(userContext: any): Promise<string[]> {
    try {
      const prompt = `Based on the following user context, generate 3 personalized intimacy and relationship suggestions:

User context: ${JSON.stringify(userContext)}

Please provide practical, actionable suggestions that focus on:
- Communication improvement
- Emotional connection
- Relationship activities
- Personal growth within relationships

Format as a JSON array of strings.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      try {
        return JSON.parse(response);
      } catch {
        // Fallback if JSON parsing fails
        return [
          "Schedule 15 minutes of phone-free conversation daily",
          "Practice expressing appreciation for one specific thing your partner did today",
          "Plan a surprise activity based on something your partner mentioned recently"
        ];
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [
        "Schedule 15 minutes of phone-free conversation daily",
        "Practice expressing appreciation for one specific thing your partner did today",
        "Plan a surprise activity based on something your partner mentioned recently"
      ];
    }
  }
}

export const geminiService = new GeminiService();
