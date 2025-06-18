import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SpicinessSlider } from "@/components/ui/spiciness-slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUserMemory } from "@/hooks/useUserMemory";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ChevronLeft, ChevronRight, Sparkles, Heart, RefreshCw } from "lucide-react";

interface TopicPrompt {
  id: string;
  title: string;
  description: string;
  tags: string[];
  blueprintRelevant: boolean;
  spiciness: number;
}

export default function Boudoir() {
  const { memory, updateSpicinessLevel, getAIContext } = useUserMemory();
  const [currentSpiciness, setCurrentSpiciness] = useState(memory?.spicinessLevel || 3);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: topics, isLoading, refetch } = useQuery({
    queryKey: ["/api/boudoir-topics", currentSpiciness, memory?.blueprintResults?.primaryType],
    enabled: !!memory,
    retry: false,
  });

  const generateTopicsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/boudoir-topics", {
        spiciness: currentSpiciness,
        blueprintType: memory?.blueprintResults?.primaryType,
        userContext: getAIContext(),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boudoir-topics"] });
    },
  });

  useEffect(() => {
    if (memory && currentSpiciness !== memory.spicinessLevel) {
      setCurrentSpiciness(memory.spicinessLevel);
    }
  }, [memory?.spicinessLevel]);

  const handleSpicinessChange = (value: number) => {
    setCurrentSpiciness(value);
    updateSpicinessLevel(value);
  };

  const handlePrevious = () => {
    if (topics && topics.length > 0) {
      setCurrentIndex((prev) => (prev === 0 ? topics.length - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    if (topics && topics.length > 0) {
      setCurrentIndex((prev) => (prev === topics.length - 1 ? 0 : prev + 1));
    }
  };

  const currentTopic = topics && topics.length > 0 ? topics[currentIndex] : null;

  if (!memory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">Boudoir Inspiration</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover intimate conversation starters and playful prompts tailored to your unique style and comfort level.
          </p>
        </div>

        {/* Spiciness Control */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="text-primary" size={20} />
              <span>Customize Your Experience</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SpicinessSlider
              value={currentSpiciness}
              onChange={handleSpicinessChange}
              className="mb-4"
            />
            
            {memory.blueprintResults && (
              <div className="mt-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="text-secondary" size={16} />
                  <span className="font-medium text-gray-700">Your Blueprint Personalization</span>
                </div>
                <p className="text-sm text-gray-600">
                  Content is tailored for your <Badge variant="secondary">{memory.blueprintResults.primaryType}</Badge> blueprint type
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Topic Carousel */}
        <Card className="mb-8 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Intimate Prompts</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateTopicsMutation.mutate()}
                  disabled={generateTopicsMutation.isPending}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${generateTopicsMutation.isPending ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading || generateTopicsMutation.isPending ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-gray-600">Generating personalized prompts...</p>
                </div>
              </div>
            ) : currentTopic ? (
              <div className="space-y-6">
                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={!topics || topics.length <= 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  
                  <span className="text-sm text-gray-500">
                    {currentIndex + 1} of {topics?.length || 0}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNext}
                    disabled={!topics || topics.length <= 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                <Separator />

                {/* Current Topic */}
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">{currentTopic.title}</h3>
                  <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                    {currentTopic.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {currentTopic.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                    {currentTopic.blueprintRelevant && (
                      <Badge className="bg-gradient-to-r from-primary to-secondary text-white">
                        Blueprint Match
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">No prompts available</h3>
                <p className="text-gray-600 mb-6">
                  Click refresh to generate personalized intimate prompts.
                </p>
                <Button onClick={() => generateTopicsMutation.mutate()}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Prompts
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Tips for Using Boudoir Prompts</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Use these as conversation starters with your partner</li>
              <li>• Adapt the prompts to your comfort level and relationship dynamic</li>
              <li>• Save favorites by taking screenshots or notes</li>
              <li>• Remember: communication and consent are always key</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}