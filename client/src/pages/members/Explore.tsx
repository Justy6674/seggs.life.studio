import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Heart, MessageCircle, Calendar, Book, Zap } from "lucide-react";
import { Link } from "wouter";

const explorationCategories = [
  {
    id: 'communication',
    title: 'Communication Starters',
    description: 'Conversation prompts to deepen your connection',
    icon: MessageCircle,
    count: 45,
    bgColor: 'from-blue-500 to-blue-700',
    href: '/members/boudoir?category=communication'
  },
  {
    id: 'sensory',
    title: 'Sensory Experiences',
    description: 'Touch, taste, sound, and sight explorations',
    icon: Sparkles,
    count: 38,
    bgColor: 'from-purple-500 to-purple-700',
    href: '/members/boudoir?category=sensory'
  },
  {
    id: 'romantic',
    title: 'Romantic Gestures',
    description: 'Sweet and meaningful ways to show love',
    icon: Heart,
    count: 52,
    bgColor: 'from-rose-500 to-rose-700',
    href: '/members/boudoir?category=romantic'
  },
  {
    id: 'adventure',
    title: 'Adventure & Novelty',
    description: 'New experiences to try together',
    icon: Zap,
    count: 34,
    bgColor: 'from-orange-500 to-orange-700',
    href: '/members/boudoir?category=adventure'
  },
  {
    id: 'planning',
    title: 'Date Night Planning',
    description: 'Creative ideas for special occasions',
    icon: Calendar,
    count: 41,
    bgColor: 'from-emerald-500 to-emerald-700',
    href: '/members/boudoir?category=planning'
  },
  {
    id: 'education',
    title: 'Learning Together',
    description: 'Educational content and exercises',
    icon: Book,
    count: 29,
    bgColor: 'from-indigo-500 to-indigo-700',
    href: '/members/boudoir?category=education'
  }
];

export default function Explore() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="text-center pt-16 pb-12 px-6">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Explore by Category
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Browse our collection of intimacy-building activities organized by type.
          Each category contains personalized suggestions based on your Blueprint.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {explorationCategories.map((category) => (
            <Link key={category.id} href={category.href}>
              <Card className={`bg-gradient-to-br ${category.bgColor} border-0 text-white hover:scale-105 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <category.icon className="h-8 w-8 text-white" />
                    <Badge className="bg-white/20 text-white border-white/30">
                      {category.count} ideas
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{category.title}</h3>
                  <p className="text-white/90 text-sm leading-relaxed mb-4">
                    {category.description}
                  </p>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
                  >
                    Explore Category
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Not sure where to start?
            </h2>
            <p className="text-muted-foreground">
              Let our AI create a personalized mix just for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/members/boudoir">
              <Card className="bg-card border hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Generate Random Ideas
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Get a curated mix of suggestions across all categories
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/members/blueprint">
              <Card className="bg-card border hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Take Blueprint Quiz
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Discover your unique intimacy style for better suggestions
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}