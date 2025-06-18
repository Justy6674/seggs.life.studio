import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Heart, ShoppingBag, Music, BookOpen, Stethoscope, Sparkles } from "lucide-react";

interface Resource {
  id: string;
  category: 'health' | 'products' | 'lifestyle' | 'education';
  title: string;
  description: string;
  url: string;
  tags: string[];
  spiciness: 1 | 2 | 3 | 4 | 5;
  blueprintAlignment?: string[];
  affiliateReady: boolean;
  trusted: boolean;
}

const resources: Resource[] = [
  // Health & Medical Resources
  {
    id: "planned_parenthood",
    category: "health",
    title: "Planned Parenthood Sexual Health",
    description: "Comprehensive sexual health information, contraception guidance, and STI resources",
    url: "https://www.plannedparenthood.org/learn/sexual-health",
    tags: ["health", "contraception", "sti", "sexual-health"],
    spiciness: 1,
    affiliateReady: false,
    trusted: true
  },
  {
    id: "consent_education",
    category: "health", 
    title: "Consent & Communication Guide",
    description: "Essential resources for healthy sexual communication and enthusiastic consent",
    url: "https://www.rainn.org/articles/what-is-consent",
    tags: ["consent", "communication", "education"],
    spiciness: 1,
    affiliateReady: false,
    trusted: true
  },
  {
    id: "sexual_dysfunction",
    category: "health",
    title: "Sexual Health Concerns Support",
    description: "Professional resources for ED, libido issues, dryness, and other intimate health concerns",
    url: "https://www.aasect.org/",
    tags: ["dysfunction", "therapy", "medical"],
    spiciness: 2,
    affiliateReady: false,
    trusted: true
  },

  // Lifestyle Resources
  {
    id: "sensual_playlist",
    category: "lifestyle",
    title: "Sensual Blueprint Spotify Playlist",
    description: "Curated music for slow, intimate moments focusing on all the senses",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd",
    tags: ["sensual", "music", "playlist", "spotify"],
    spiciness: 2,
    blueprintAlignment: ["sensual"],
    affiliateReady: false,
    trusted: true
  },
  {
    id: "sexual_blueprint_podcast",
    category: "lifestyle",
    title: "Sex with Emily Podcast",
    description: "Educational podcast covering sexual wellness, communication, and relationship advice",
    url: "https://sexwithemily.com/podcast/",
    tags: ["podcast", "education", "sex-ed"],
    spiciness: 3,
    affiliateReady: false,
    trusted: true
  },
  {
    id: "erotic_fragrance",
    category: "lifestyle",
    title: "Sensual Fragrance Collection",
    description: "Curated scents designed to enhance intimate moments and sensory experiences",
    url: "https://escentric.com/",
    tags: ["fragrance", "sensual", "scents"],
    spiciness: 2,
    blueprintAlignment: ["sensual"],
    affiliateReady: true,
    trusted: true
  },

  // Product Ideas
  {
    id: "beginners_toys",
    category: "products",
    title: "Beginner-Friendly Intimacy Products",
    description: "Thoughtfully curated selection of high-quality, body-safe products for exploration",
    url: "https://www.lovehoney.com/",
    tags: ["toys", "beginner", "body-safe"],
    spiciness: 4,
    affiliateReady: true,
    trusted: true
  },
  {
    id: "blueprint_books",
    category: "products", 
    title: "Erotic Blueprint Books & Games",
    description: "Educational books and intimate games to deepen understanding of your blueprint",
    url: "https://www.amazon.com/s?k=erotic+blueprints",
    tags: ["books", "games", "education"],
    spiciness: 2,
    affiliateReady: true,
    trusted: true
  },
  {
    id: "luxury_accessories",
    category: "products",
    title: "Premium Intimate Accessories",
    description: "High-end candles, oils, and accessories for creating the perfect atmosphere",
    url: "https://shop.unbound.co/",
    tags: ["accessories", "luxury", "atmosphere"],
    spiciness: 3,
    affiliateReady: true,
    trusted: true
  },

  // Educational Resources
  {
    id: "blueprint_guide",
    category: "education",
    title: "Complete Erotic Blueprint Guide",
    description: "Comprehensive guide to understanding and applying the five erotic blueprints",
    url: "https://www.jaiyainstitute.com/",
    tags: ["blueprints", "education", "guide"],
    spiciness: 2,
    affiliateReady: false,
    trusted: true
  },
  {
    id: "communication_course",
    category: "education",
    title: "Intimate Communication Course",
    description: "Online course teaching effective communication skills for intimate relationships",
    url: "https://www.gottman.com/",
    tags: ["communication", "course", "relationships"],
    spiciness: 1,
    affiliateReady: true,
    trusted: true
  }
];

const categoryConfig = {
  health: {
    title: "Health & Medical",
    description: "Trusted resources for sexual health, consent, and medical guidance",
    icon: Stethoscope,
    gradient: "from-emerald-600 to-emerald-800"
  },
  lifestyle: {
    title: "Lifestyle & Culture", 
    description: "Playlists, podcasts, fragrances, and lifestyle enhancers",
    icon: Music,
    gradient: "from-purple-600 to-purple-800"
  },
  products: {
    title: "Products & Shopping",
    description: "Curated toys, books, games, and intimate accessories",
    icon: ShoppingBag,
    gradient: "from-rose-600 to-rose-800"
  },
  education: {
    title: "Education & Learning",
    description: "Courses, guides, and educational content for growth",
    icon: BookOpen,
    gradient: "from-blue-600 to-blue-800"
  }
};

function ResourceCard({ resource }: { resource: Resource }) {
  const category = categoryConfig[resource.category];
  
  return (
    <Card className={`bg-gradient-to-br ${category.gradient} border-0 text-white shadow-xl hover:scale-105 transition-all duration-300`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-lg font-bold mb-2 flex items-center gap-2">
              <category.icon className="h-5 w-5" />
              {resource.title}
            </CardTitle>
            <p className="text-white/90 text-sm leading-relaxed">
              {resource.description}
            </p>
          </div>
          <div className="flex flex-col gap-2 ml-4">
            {resource.trusted && (
              <Badge className="bg-white/20 text-white border-white/40 text-xs">
                Trusted
              </Badge>
            )}
            <div className="flex gap-1">
              {Array.from({ length: resource.spiciness }).map((_, i) => (
                <Sparkles key={i} className="h-3 w-3 text-white" />
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {resource.blueprintAlignment && (
            <div className="flex flex-wrap gap-1">
              {resource.blueprintAlignment.map((blueprint) => (
                <Badge key={blueprint} className="bg-white/20 text-white border-white/40 text-xs">
                  {blueprint}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex flex-wrap gap-1">
            {resource.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="border-white/40 text-white/80 text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full justify-center mt-4"
          >
            <span>Explore Resource</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Resources() {
  const [activeTab, setActiveTab] = useState<string>("health");

  const getResourcesByCategory = (category: string) => {
    return resources.filter(resource => resource.category === category);
  };

  return (
    <div className="min-h-screen bg-[#4b4f56] pb-24">
      {/* Header */}
      <div className="text-center pt-16 pb-12 px-6">
        <h1 className="text-4xl font-bold text-white mb-4 font-serif">
          Resources & Tools
        </h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Curated collection of trusted resources, products, and lifestyle enhancers to support your intimate journey
        </p>
      </div>

      <div className="px-6 pb-12 max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 rounded-xl p-1 mb-8">
            {Object.entries(categoryConfig).map(([key, config]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 font-medium"
              >
                <config.icon className="h-4 w-4 mr-2" />
                {config.title.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(categoryConfig).map(([key, config]) => (
            <TabsContent key={key} value={key} className="space-y-6">
              {/* Category Header */}
              <Card className={`bg-gradient-to-br ${config.gradient} border-0 text-white shadow-xl`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white text-xl">
                    <config.icon className="h-6 w-6" />
                    {config.title}
                  </CardTitle>
                  <p className="text-white/90">{config.description}</p>
                </CardHeader>
              </Card>

              {/* Resources Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getResourcesByCategory(key).map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>

              {getResourcesByCategory(key).length === 0 && (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-white/40" />
                  <p className="text-white/60">More resources coming soon...</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}