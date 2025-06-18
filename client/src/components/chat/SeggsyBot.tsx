import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Send, Minimize2, Maximize2, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useUserMemory } from "@/hooks/useUserMemory";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface SeggsyBotProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function SeggsyBot({ isOpen, onToggle, onClose }: SeggsyBotProps) {
  const { memory, getAIContext } = useUserMemory();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi there! I'm SeggsyBot, your personal intimacy companion. I'm here to provide guidance, answer questions, and help you on your journey. How can I assist you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const conversationHistory = messages.slice(-5); // Keep last 5 messages for context
      const response = await apiRequest("POST", "/api/chat", {
        message,
        conversationHistory
      });
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, data.message]);
      scrollToBottom();
    },
    onError: (error: any) => {
      toast({
        title: "Chat Error",
        description: "Unable to get response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update bot context when user memory changes
  useEffect(() => {
    if (memory && messages.length === 1) {
      // Send context update to bot on first interaction
      const contextMessage: ChatMessage = {
        role: 'assistant',
        content: `I can see you're ${memory.firstName || 'here'}! ${
          memory.blueprintResults 
            ? `I notice you're a ${memory.blueprintResults.primaryType} blueprint type, so I'll tailor my advice accordingly.` 
            : "Once you complete your blueprint quiz, I'll be able to give you even more personalized guidance."
        } ${
          memory.partnerLinked 
            ? `I see you're connected with ${memory.partnerName} - I can provide couples-focused advice.`
            : "I can help with both solo exploration and preparing for partnership."
        }`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [prev[0], contextMessage]);
    }
  }, [memory]);

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate({ message: input });
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-80 shadow-2xl border-2 border-primary/20 transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-96'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                <img src="/SEGGSYCHATBOT.png" alt="SeggsyBot" className="w-6 h-6 object-cover" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">SeggsyBot</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white/80 text-xs">
                    {memory ? 'Context-Aware' : 'Ready to Help'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {memory?.blueprintResults && (
                <Badge variant="secondary" className="text-xs">
                  {memory.blueprintResults.primaryType}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 p-1 h-6 w-6"
              >
                {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 p-1 h-6 w-6"
              >
                <X size={12} />
              </Button>
            </div>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea ref={scrollAreaRef} className="h-64 p-4">
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-2 ${
                      message.role === 'user' ? 'justify-end' : ''
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img src="/SEGGSYCHATBOT.png" alt="SeggsyBot" className="w-4 h-4 object-cover" />
                      </div>
                    )}
                    
                    <div
                      className={`rounded-lg p-3 max-w-[220px] text-sm ${
                        message.role === 'user'
                          ? 'bg-primary text-white rounded-tr-sm'
                          : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>

                    {message.role === 'user' && (
                      <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="text-secondary" size={12} />
                      </div>
                    )}
                  </div>
                ))}

                {chatMutation.isPending && (
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                      <img src="/SEGGSYCHATBOT.png" alt="SeggsyBot" className="w-4 h-4 object-cover" />
                    </div>
                    <div className="bg-gray-100 rounded-lg rounded-tl-sm p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t border-gray-100 p-3">
              <div className="flex items-center space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 text-sm"
                  disabled={chatMutation.isPending}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || chatMutation.isPending}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 p-2"
                >
                  <Send size={14} />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                Personalized guidance based on your profile
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}