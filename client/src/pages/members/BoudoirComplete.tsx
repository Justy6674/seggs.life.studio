import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Heart, Zap, RefreshCw, Copy, Share } from "lucide-react";
import { useUserMemory } from "@/hooks/useUserMemory";
import { useToast } from "@/hooks/use-toast";
import { BOUDOIR_TOPICS, SPICINESS_LEVELS } from "@/lib/boudoirTopics";
import { apiRequest } from "@/lib/queryClient";

interface GeneratedIdea {
  id: string;
  topic: string;
  suggestion: string;
  spiciness: number;
  blueprint: string;
  timestamp: string;
  isFavorite: boolean;
}

export default function Boudoir() {
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [spiciness, setSpiciness] = useState([3]);
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { memory } = useUserMemory();
  const { toast } = useToast();

  const generateIdea = async () => {
    if (!selectedTopic) {
      toast({
        title: "Please select a topic",
        description: "Choose a topic to generate personalized ideas.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await apiRequest("POST", "/api/boudoir/generate", {
        topic: selectedTopic,
        spiciness: spiciness[0],
        userBlueprint: memory?.blueprintResults?.primaryType || "Sensual",
        partnerBlueprint: memory?.partnerBlueprint?.primaryType,
        userIdentity: memory?.identity || "Individual"
      });

      const data = await response.json();

      const newIdea: GeneratedIdea = {
        id: Date.now().toString(),
        topic: selectedTopic,
        suggestion: data.suggestion,
        spiciness: spiciness[0],
        blueprint: memory?.blueprintResults?.primaryType || "Sensual",
        timestamp: new Date().toISOString(),
        isFavorite: false
      };
      
      setGeneratedIdeas(prev => [newIdea, ...prev]);
      
      toast({
        title: "New Idea Generated!",
        description: "A personalized suggestion has been created for you.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate ideas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Suggestion copied to clipboard.",
    });
  };

  const toggleFavorite = (id: string) => {
    setGeneratedIdeas(prev => 
      prev.map(idea => 
        idea.id === id ? { ...idea, isFavorite: !idea.isFavorite } : idea
      )
    );
  };

  const currentLevel = SPICINESS_LEVELS.find(level => level.level === spiciness[0]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-serif font-bold text-accent">Boudoir Generator</h1>
          </div>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Discover personalized intimacy ideas tailored to your unique blueprint and preferences.
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Customize Your Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Topic Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Choose a Topic</label>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an intimacy topic..." />
                </SelectTrigger>
                <SelectContent>
                  {BOUDOIR_TOPICS.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Spiciness Level */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Spiciness Level</label>
                <Badge variant="outline" className="text-sm">
                  {currentLevel?.level}: {currentLevel?.label}
                </Badge>
              </div>
              <Slider
                value={spiciness}
                onValueChange={setSpiciness}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-sm text-foreground/60">
                {currentLevel?.description}
              </p>
            </div>

            {/* Generate Button */}
            <Button 
              onClick={generateIdea}
              disabled={isGenerating || !selectedTopic}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating Your Idea...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate New Idea
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* User Context Display */}
        {memory?.blueprintResults && (
          <Card className="mb-8 bg-accent/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {memory.blueprintResults.primaryType} Blueprint
                  </Badge>
                </div>
                {memory.partnerLinked && memory.partnerName && (
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Linked with {memory.partnerName}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generated Ideas */}
        <div className="space-y-6">
          {generatedIdeas.length > 0 && (
            <h2 className="text-2xl font-serif font-bold text-accent mb-4">Your Generated Ideas</h2>
          )}
          
          {generatedIdeas.map((idea) => (
            <Card key={idea.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{idea.topic}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Spiciness: {idea.spiciness}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {idea.blueprint}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(idea.id)}
                      className={idea.isFavorite ? "text-red-500" : "text-gray-400"}
                    >
                      <Heart className="h-4 w-4" fill={idea.isFavorite ? "currentColor" : "none"} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(idea.suggestion)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 leading-relaxed">{idea.suggestion}</p>
                <div className="mt-4 text-xs text-foreground/50">
                  Generated {new Date(idea.timestamp).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {generatedIdeas.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Ready to Begin?</h3>
              <p className="text-gray-500 mb-6">
                Select a topic and spiciness level to generate your first personalized intimacy idea.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}