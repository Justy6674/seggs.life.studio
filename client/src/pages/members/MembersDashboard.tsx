import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useUserMemory } from "@/hooks/useUserMemory";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Heart, 
  Users, 
  Brain, 
  MessageCircle, 
  Settings, 
  BarChart3,
  Sparkles,
  ClipboardList,
  Link,
  Smile,
  TrendingUp
} from "lucide-react";
import { Link as RouterLink } from "wouter";

const moodEmojis = ["😔", "😐", "🙂", "😊", "😍"];
const moodLabels = ["Low", "Meh", "Good", "Great", "Amazing"];

export default function MembersDashboard() {
  const { memory, updateMood } = useUserMemory();
  const [selectedMood, setSelectedMood] = useState<number>(3);
  const [selectedLibido, setSelectedLibido] = useState<number>(5);

  const saveMoodMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/mood", {
        mood: moodLabels[selectedMood - 1],
        libido: selectedLibido,
      });
      return response.json();
    },
    onSuccess: () => {
      updateMood(moodLabels[selectedMood - 1], selectedLibido);
    },
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getBlueprintColor = (type: string) => {
    const colors = {
      Sensual: "bg-green-100 text-green-800",
      Sexual: "bg-red-100 text-red-800", 
      Energetic: "bg-yellow-100 text-yellow-800",
      Kinky: "bg-purple-100 text-purple-800",
      Shapeshifter: "bg-blue-100 text-blue-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (!memory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {memory.firstName || 'there'}!
          </h1>
          <p className="text-lg text-gray-600">Ready to explore your intimate journey today?</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Blueprint Summary Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Brain className="text-primary" size={20} />
                    <span>Your Erotic Blueprint</span>
                  </div>
                  <RouterLink href="/members/blueprint">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </RouterLink>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {memory.blueprintResults ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Badge className={getBlueprintColor(memory.blueprintResults.primaryType)}>
                        {memory.blueprintResults.primaryType}
                      </Badge>
                      <span className="text-sm text-gray-600">Primary Type</span>
                    </div>
                    
                    <div className="space-y-3">
                      {Object.entries(memory.blueprintResults).map(([key, value]) => {
                        if (key === 'primaryType' || key === 'completedAt') return null;
                        return (
                          <div key={key} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{key}</span>
                              <span>{value}%</span>
                            </div>
                            <Progress value={value as number} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="font-semibold text-gray-900 mb-2">Discover Your Blueprint</h3>
                    <p className="text-gray-600 mb-4">Take the quiz to unlock personalized insights</p>
                    <RouterLink href="/members/blueprint">
                      <Button className="bg-primary text-white">
                        Take Blueprint Quiz
                      </Button>
                    </RouterLink>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Partner Link Status */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="text-secondary" size={20} />
                  <span>Partner Connection</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {memory.partnerLinked && memory.partnerName ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">{memory.partnerName}</p>
                        <p className="text-sm text-gray-600">Connected & Active</p>
                      </div>
                    </div>
                    <RouterLink href="/members/settings">
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </RouterLink>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Link className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="font-semibold text-gray-900 mb-2">Connect Your Partner</h3>
                    <p className="text-gray-600 mb-4">Share your journey together</p>
                    <RouterLink href="/members/settings">
                      <Button className="bg-secondary text-white">
                        <Link className="h-4 w-4 mr-2" />
                        Invite Partner
                      </Button>
                    </RouterLink>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Mood & Quick Actions */}
          <div className="space-y-6">
            {/* Mood Tracking Widget */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smile className="text-accent" size={20} />
                  <span>Today's Mood</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {memory.mood ? (
                  <div className="text-center py-2">
                    <div className="text-3xl mb-2">
                      {moodEmojis[moodLabels.indexOf(memory.mood.current)]}
                    </div>
                    <p className="font-medium text-gray-900">{memory.mood.current}</p>
                    <p className="text-sm text-gray-600">
                      Libido: {memory.mood.libido}/10
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Last updated: {new Date(memory.mood.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        How are you feeling?
                      </label>
                      <div className="flex justify-between">
                        {moodEmojis.map((emoji, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedMood(index + 1)}
                            className={`text-2xl p-2 rounded-full transition-all ${
                              selectedMood === index + 1 
                                ? 'bg-primary/10 scale-110' 
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Libido Level: {selectedLibido}/10
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={selectedLibido}
                        onChange={(e) => setSelectedLibido(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <Button
                      onClick={() => saveMoodMutation.mutate()}
                      disabled={saveMoodMutation.isPending}
                      className="w-full"
                      size="sm"
                    >
                      Save Mood
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Launch Tiles */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="text-primary" size={20} />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <RouterLink href="/members/boudoir">
                  <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-xs">Boudoir Ideas</span>
                  </Button>
                </RouterLink>

                <RouterLink href="/members/generator">
                  <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                    <MessageCircle className="h-6 w-6" />
                    <span className="text-xs">Message Gen</span>
                  </Button>
                </RouterLink>

                <RouterLink href="/members/blueprint">
                  <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                    <ClipboardList className="h-6 w-6" />
                    <span className="text-xs">Blueprint</span>
                  </Button>
                </RouterLink>

                <RouterLink href="/members/settings">
                  <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                    <Settings className="h-6 w-6" />
                    <span className="text-xs">Settings</span>
                  </Button>
                </RouterLink>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Stats */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="text-accent" size={20} />
              <span>Your Journey Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {memory.blueprintResults ? '1' : '0'}
                </div>
                <div className="text-sm text-gray-600">Blueprint Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {memory.partnerLinked ? '1' : '0'}
                </div>
                <div className="text-sm text-gray-600">Partner Connected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {memory.mood ? '1' : '0'}
                </div>
                <div className="text-sm text-gray-600">Mood Entries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">
                  {memory.spicinessLevel}
                </div>
                <div className="text-sm text-gray-600">Spiciness Level</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}