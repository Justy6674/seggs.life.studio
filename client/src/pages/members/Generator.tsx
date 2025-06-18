import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SpicinessSlider } from "@/components/ui/spiciness-slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useUserMemory } from "@/hooks/useUserMemory";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { MessageCircle, Copy, RefreshCw, Heart, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const toneOptions = [
  { value: "playful", label: "Playful", icon: "😏" },
  { value: "romantic", label: "Romantic", icon: "💕" },
  { value: "sultry", label: "Sultry", icon: "🔥" },
  { value: "sweet", label: "Sweet", icon: "🥰" },
  { value: "teasing", label: "Teasing", icon: "😉" },
  { value: "passionate", label: "Passionate", icon: "💋" },
];

export default function Generator() {
  const { memory, getAIContext } = useUserMemory();
  const { toast } = useToast();
  const [spiciness, setSpiciness] = useState(memory?.spicinessLevel || 3);
  const [audience, setAudience] = useState<string>(memory?.partnerLinked ? "partner" : "self");
  const [tone, setTone] = useState<string>("playful");
  const [generatedMessage, setGeneratedMessage] = useState<string>("");

  const generateMessageMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/generate-message", {
        audience,
        tone,
        spiciness,
        userContext: getAIContext(),
        partnerName: memory?.partnerName,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedMessage(data.message);
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Unable to generate message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = async () => {
    if (!generatedMessage) return;
    
    try {
      await navigator.clipboard.writeText(generatedMessage);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  if (!memory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">Message Generator</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create personalized flirty and intimate messages tailored to your style and relationship.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="text-primary" size={20} />
                <span>Message Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Audience Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">For whom?</label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {memory.partnerLinked && memory.partnerName ? (
                      <SelectItem value="partner">
                        For {memory.partnerName} 💕
                      </SelectItem>
                    ) : (
                      <SelectItem value="partner">For Your Partner</SelectItem>
                    )}
                    <SelectItem value="self">For Yourself</SelectItem>
                    <SelectItem value="dating">For Someone New</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tone Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {toneOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={tone === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTone(option.value)}
                      className="justify-start"
                    >
                      <span className="mr-2">{option.icon}</span>
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Spiciness Level */}
              <SpicinessSlider
                value={spiciness}
                onChange={setSpiciness}
              />

              {/* Blueprint Info */}
              {memory.blueprintResults && (
                <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="text-secondary" size={16} />
                    <span className="font-medium text-gray-700">Blueprint Influence</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Messages will reflect your <Badge variant="secondary">{memory.blueprintResults.primaryType}</Badge> style
                  </p>
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={() => generateMessageMutation.mutate()}
                disabled={generateMessageMutation.isPending}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white"
                size="lg"
              >
                {generateMessageMutation.isPending ? (
                  <>
                    <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Generate Message
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Message */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Generated Message</span>
                {generatedMessage && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generateMessageMutation.isPending ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-600">Crafting your perfect message...</p>
                  </div>
                </div>
              ) : generatedMessage ? (
                <div className="space-y-4">
                  <Textarea
                    value={generatedMessage}
                    onChange={(e) => setGeneratedMessage(e.target.value)}
                    className="min-h-[200px] text-base leading-relaxed resize-none"
                    placeholder="Your generated message will appear here..."
                  />
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Feel free to edit before sending</span>
                    <span>{generatedMessage.length} characters</span>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => generateMessageMutation.mutate()}
                      disabled={generateMessageMutation.isPending}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Your personalized message will appear here</p>
                  <p className="text-sm mt-2">Configure your settings and click generate</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Tips for Great Messages</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <ul className="space-y-2">
                <li>• Personalize with inside jokes or shared memories</li>
                <li>• Consider timing - when will they receive it?</li>
                <li>• Match their communication style</li>
              </ul>
              <ul className="space-y-2">
                <li>• Be authentic to your personality</li>
                <li>• Respect boundaries and comfort levels</li>
                <li>• Have fun and be creative!</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}