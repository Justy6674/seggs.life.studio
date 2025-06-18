import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Users, Sparkles, MessageCircle, Settings, Plus, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  blueprintType?: string;
  blueprintScores?: {
    sensual: number;
    sexual: number;
    energetic: number;
    kinky: number;
    shapeshifter: number;
  };
  partnerId?: string;
  partnerName?: string;
  partnerLinked: boolean;
  createdAt: string;
}

const getBlueprintColor = (type: string) => {
  const colors = {
    Sensual: "bg-rose-100 text-rose-800 border-rose-200",
    Sexual: "bg-red-100 text-red-800 border-red-200", 
    Energetic: "bg-orange-100 text-orange-800 border-orange-200",
    Kinky: "bg-purple-100 text-purple-800 border-purple-200",
    Shapeshifter: "bg-indigo-100 text-indigo-800 border-indigo-200"
  };
  return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
};

const getBlueprintDescription = (type: string) => {
  const descriptions = {
    Sensual: "You crave slow, romantic connection and emotional intimacy",
    Sexual: "You're direct about pleasure and enjoy physical satisfaction",
    Energetic: "You love anticipation, teasing, and psychological arousal",
    Kinky: "You're drawn to power dynamics and taboo exploration",
    Shapeshifter: "You adapt and enjoy variety in all forms of intimacy"
  };
  return descriptions[type as keyof typeof descriptions] || "Discover your unique pathway to pleasure";
};

export default function ModernDashboard() {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/user/profile", user?.uid],
    enabled: !!user?.uid,
    retry: false,
  });

  const { data: recentSuggestions } = useQuery({
    queryKey: ["/api/user/recent-suggestions", user?.uid],
    enabled: !!user?.uid,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#7f1d1d] border-t-transparent rounded-full" />
      </div>
    );
  }

  const userProfile = profile as UserProfile;
  const firstName = userProfile?.firstName || user?.displayName?.split(' ')[0] || user?.email?.split('@')[0];

  return (
    <div className="min-h-screen bg-[#f5f3f0] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-serif font-bold">
              Welcome back, {firstName}
            </h1>
            <p className="text-white/80 mt-1">
              Your journey to deeper intimacy continues
            </p>
          </div>
          <Link href="/members/settings">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="font-medium">Ideas Generated</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {recentSuggestions?.length || 0}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-300" />
              <span className="font-medium">Days Together</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {userProfile?.partnerLinked ? "Connected" : "Solo"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Blueprint Status */}
        <Card className="border-[#d6c0a5]/30 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[#4b4f56]">
              <Heart className="h-5 w-5 text-[#7f1d1d]" />
              Your Erotic Blueprint
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userProfile?.blueprintType ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={`${getBlueprintColor(userProfile.blueprintType)} px-4 py-2 text-sm font-semibold`}>
                    {userProfile.blueprintType}
                  </Badge>
                  <Link href="/members/blueprint">
                    <Button variant="outline" size="sm" className="border-[#7f1d1d] text-[#7f1d1d]">
                      View Details
                    </Button>
                  </Link>
                </div>
                <p className="text-[#4b4f56]/80 text-sm leading-relaxed">
                  {getBlueprintDescription(userProfile.blueprintType)}
                </p>
                {userProfile.blueprintScores && (
                  <div className="space-y-3 pt-2">
                    {Object.entries(userProfile.blueprintScores).map(([type, score]) => (
                      <div key={type} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize font-medium text-[#4b4f56]">{type}</span>
                          <span className="text-[#7f1d1d] font-semibold">{score}%</span>
                        </div>
                        <Progress 
                          value={score} 
                          className="h-2 bg-[#d6c0a5]/30"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Heart className="h-12 w-12 mx-auto mb-4 text-[#d6c0a5]" />
                <h3 className="font-semibold text-[#4b4f56] mb-2">Discover Your Blueprint</h3>
                <p className="text-[#4b4f56]/70 mb-4 text-sm">
                  Take the quiz to unlock personalized insights and recommendations
                </p>
                <Link href="/members/blueprint">
                  <Button className="bg-[#7f1d1d] hover:bg-[#7f1d1d]/90 text-white">
                    Take Blueprint Quiz
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Partner Status */}
        <Card className="border-[#d6c0a5]/30 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[#4b4f56]">
              <Users className="h-5 w-5 text-[#7f1d1d]" />
              Partner Connection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userProfile?.partnerLinked ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#7f1d1d]/10 rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5 text-[#7f1d1d]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#4b4f56]">
                      Connected with {userProfile.partnerName}
                    </p>
                    <p className="text-sm text-[#4b4f56]/70">
                      Enjoy personalized couple experiences
                    </p>
                  </div>
                </div>
                <Link href="/members/partner">
                  <Button variant="outline" size="sm" className="border-[#7f1d1d] text-[#7f1d1d]">
                    Manage
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <Users className="h-12 w-12 mx-auto mb-4 text-[#d6c0a5]" />
                <h3 className="font-semibold text-[#4b4f56] mb-2">Connect with Your Partner</h3>
                <p className="text-[#4b4f56]/70 mb-4 text-sm">
                  Sync with your partner to unlock personalized ideas for both of you
                </p>
                <Link href="/members/partner">
                  <Button className="bg-[#7f1d1d] hover:bg-[#7f1d1d]/90 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Link Partner
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/members/boudoir">
            <Card className="border-[#d6c0a5]/30 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Sparkles className="h-8 w-8 mx-auto mb-3 text-[#7f1d1d]" />
                <h3 className="font-semibold text-[#4b4f56] mb-1">Boudoir Ideas</h3>
                <p className="text-sm text-[#4b4f56]/70">
                  Generate personalized intimacy suggestions
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card className="border-[#d6c0a5]/30 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-3 text-[#7f1d1d]" />
              <h3 className="font-semibold text-[#4b4f56] mb-1">Flirty Messages</h3>
              <p className="text-sm text-[#4b4f56]/70">
                Craft the perfect message
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {recentSuggestions && recentSuggestions.length > 0 && (
          <Card className="border-[#d6c0a5]/30 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-[#4b4f56]">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#7f1d1d]" />
                  Recent Ideas
                </span>
                <Link href="/members/boudoir">
                  <Button variant="ghost" size="sm" className="text-[#7f1d1d]">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSuggestions.slice(0, 3).map((suggestion: any, index: number) => (
                  <div key={index} className="p-3 bg-[#f5f3f0] rounded-lg border border-[#d6c0a5]/20">
                    <p className="text-sm text-[#4b4f56] leading-relaxed">
                      {suggestion.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {suggestion.topic}
                      </Badge>
                      <span className="text-xs text-[#4b4f56]/60">
                        {new Date(suggestion.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}