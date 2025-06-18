import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Sparkles, MessageCircle, ArrowRight, TestTube, Brain, UserCheck } from "lucide-react";
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

const startingPoints = [
  {
    id: 'understand',
    title: 'Understand Our Dynamic',
    description: 'Explore how you and your partner connect through observation-based insights',
    subtitle: 'Predictive partner assessment',
    icon: '💗',
    bgColor: 'from-purple-600 to-purple-800',
    href: '/members/explore'
  },
  {
    id: 'blueprint',
    title: 'Discover My Blueprint',
    description: 'Learn about your unique intimacy style through the proven Erotic Blueprint assessment',
    subtitle: 'Personal assessment only',
    icon: '📋',
    bgColor: 'from-blue-600 to-blue-800',
    href: '/members/blueprint'
  },
  {
    id: 'full-picture',
    title: 'Both - Full Picture',
    description: 'Complete relationship intelligence - understand both your style and dynamic',
    subtitle: 'Both assessments',
    icon: '🚀',
    bgColor: 'from-emerald-600 to-emerald-800',
    href: '/members/full-assessment'
  },
  {
    id: 'invite',
    title: 'Invite My Partner',
    description: 'They can join here and take their own assessment at their own pace',
    subtitle: 'Send invite code',
    icon: '💌',
    bgColor: 'from-rose-600 to-rose-800',
    href: '/members/partner'
  },
  {
    id: 'browse',
    title: 'Just Browse First',
    description: 'Explore the app and see what kinds of suggestions we generate',
    subtitle: 'Limited preview mode',
    icon: '✨',
    bgColor: 'from-amber-600 to-amber-800',
    href: '/members/boudoir'
  },
  {
    id: 'returning',
    title: "I'm Returning",
    description: 'Sign in to continue your intimacy discovery journey',
    subtitle: 'Account login',
    icon: '🔑',
    bgColor: 'from-slate-600 to-slate-800',
    href: '/members/dashboard'
  }
];

const bottomFeatures = [
  {
    title: 'Blueprint Science',
    description: 'Based on proven Erotic Blueprint research - understand how you and your partner naturally connect',
    icon: TestTube
  },
  {
    title: 'AI-Powered Ideas',
    description: 'Endless personalized suggestions across 20 intimacy categories - never run out of things to try',
    icon: Brain
  },
  {
    title: 'Solo-Friendly',
    description: 'Start your journey alone or together - flexible approach that works for any situation',
    icon: UserCheck
  }
];

export default function ModernDashboard() {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/user/profile", user?.uid],
    enabled: !!user?.uid,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Main Header */}
      <div className="text-center pt-16 pb-12 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
          What should we try tonight?
        </h1>
        <p className="text-muted-foreground text-lg mb-2">
          AI knows.
        </p>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto leading-relaxed">
          The first Blueprint-Powered Intimacy Idea Engine that creates endless personalized suggestions
          based on your unique erotic blueprint combination.
        </p>
      </div>

      {/* Starting Point Selection */}
      <div className="px-6 pb-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full border">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-foreground font-medium">Choose Your Starting Point</span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {startingPoints.map((point) => (
            <Link key={point.id} href={point.href}>
              <Card className={`bg-gradient-to-br ${point.bgColor} border-0 text-white hover:scale-105 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl h-full flex flex-col`}>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="text-center flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-4xl mb-4">{point.icon}</div>
                      <h3 className="text-xl font-semibold mb-3">{point.title}</h3>
                      <p className="text-white/90 text-sm leading-relaxed mb-4">
                        {point.description}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1 text-white/80 text-xs">
                      <ArrowRight className="h-3 w-3" />
                      <span>{point.subtitle}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Features */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {bottomFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}