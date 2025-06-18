import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Heart, ShoppingBag, Music, BookOpen, Stethoscope, Sparkles, Lightbulb } from "lucide-react";

interface Resource {
  id: string;
  category: 'health' | 'products' | 'lifestyle' | 'education' | 'techniques';
  title: string;
  description: string;
  url: string;
  tags: string[];
  spiciness: 1 | 2 | 3 | 4 | 5;
  blueprintAlignment?: string[];
  affiliateReady: boolean;
  trusted: boolean;
  comingSoon?: boolean;
}

const resources: Resource[] = [
  // Health & Medical Resources
  {
    id: "planned_parenthood",
    category: "health",
    title: "Planned Parenthood Sexual Health Information",
    description: "A comprehensive hub covering everything from birth control to healthy relationships and STI prevention. Features FAQs, guides on safe sex, consent, anatomy, and more from a reputable source.",
    url: "https://www.plannedparenthood.org/learn/sexual-health",
    tags: ["health", "contraception", "sti", "sexual-health", "consent"],
    spiciness: 1,
    blueprintAlignment: ["All"],
    affiliateReady: false,
    trusted: true
  },
  {
    id: "consent_communication",
    category: "health", 
    title: "Consent & Communication Basics",
    description: "Essential guides on consent and healthy sexual communication. Emphasizes that consent means actively agreeing to be sexual with someone and must be freely given and enthusiastic. Offers tips like using F.R.I.E.S. (Freely given, Reversible, Informed, Enthusiastic, Specific) for remembering consent principles.",
    url: "https://www.rainn.org/articles/what-is-consent",
    tags: ["consent", "communication", "education", "FRIES", "safety"],
    spiciness: 1,
    blueprintAlignment: ["All"],
    affiliateReady: false,
    trusted: true
  },
  {
    id: "sexual_health_concerns",
    category: "health",
    title: "Sexual Health Concerns Support",
    description: "Professional resources for common intimate health issues like erectile dysfunction (ED), low libido, vaginal dryness, and premature ejaculation. Includes medical guides from Mayo Clinic and practical tips using techniques like pelvic floor exercises or the stop-start method.",
    url: "https://www.mayoclinic.org/diseases-conditions/erectile-dysfunction/symptoms-causes/syc-20355776",
    tags: ["dysfunction", "therapy", "medical", "ED", "libido"],
    spiciness: 2,
    blueprintAlignment: ["All"],
    affiliateReady: false,
    trusted: true
  },

  // Lifestyle & Culture Resources
  {
    id: "sensual_bliss_playlist",
    category: "lifestyle",
    title: "Sensual Bliss Spotify Playlist",
    description: "A curated music playlist ideal for slow, intimate moments. Filled with romantic R&B throwbacks, smooth beats, and sexy vibes to set the right mood. Perfect for date nights or solo relaxation.",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd",
    tags: ["sensual", "music", "playlist", "spotify", "mood"],
    spiciness: 2,
    blueprintAlignment: ["Sensual"],
    affiliateReady: false,
    trusted: true
  },
  {
    id: "sex_with_emily",
    category: "lifestyle",
    title: "Sex with Emily Podcast",
    description: "A highly acclaimed sexuality and relationship podcast hosted by Dr. Emily Morse (on air for nearly two decades). Emily's mission is to normalize talking about sex and pleasure in a judgment-free way. Episodes cover everything from libido and orgasms to communication and kinky tips.",
    url: "https://sexwithemily.com/podcast/",
    tags: ["podcast", "education", "sex-ed", "Dr. Emily Morse", "pleasure"],
    spiciness: 4,
    blueprintAlignment: ["All"],
    affiliateReady: false,
    trusted: true
  },
  {
    id: "sensual_fragrance",
    category: "lifestyle",
    title: "Sensual Fragrance Collection",
    description: "A selection of perfumes, candles, and oils designed to enhance mood through scent. Incorporates aromas known to spark intimacy like jasmine (shown to increase libido) or sandalwood (can boost arousal and relaxation). These fragrances help set a sensual atmosphere tapping into the power of smell.",
    url: "#",
    tags: ["fragrance", "sensual", "scents", "jasmine", "sandalwood"],
    spiciness: 1,
    blueprintAlignment: ["Sensual"],
    affiliateReady: true,
    trusted: true,
    comingSoon: true
  },
  {
    id: "intimacy_films",
    category: "lifestyle",
    title: "Intimacy in Film – Mainstream Movie Picks",
    description: "A curated list of well-known movies with tasteful erotic or intimacy themes. From artful classics to modern romance, these films depict sexuality in varying lights. Boundary-pushing intimate scenes in film, when done right, can jumpstart conversations about how we connect.",
    url: "https://time.com/collection/most-sexually-provocative-movies/",
    tags: ["films", "movies", "intimacy", "art", "conversation"],
    spiciness: 3,
    blueprintAlignment: ["All"],
    affiliateReady: false,
    trusted: true
  },
  {
    id: "relationship_books",
    category: "lifestyle",
    title: "Relationship & Intimacy Books",
    description: "Recommended books including insightful reads like 'Come As You Are' (Emily Nagoski) or 'Mating in Captivity' (Esther Perel) that explore improving one's sex life and emotional connection. Great for solo readers or couples book-clubbing to deepen understanding of intimacy.",
    url: "#",
    tags: ["books", "Emily Nagoski", "Esther Perel", "intimacy", "education"],
    spiciness: 2,
    blueprintAlignment: ["All"],
    affiliateReady: true,
    trusted: true,
    comingSoon: true
  },

  // Products & Shopping
  {
    id: "toy_cleaning_guide",
    category: "products",
    title: "Sex Toy Cleaning & Care Guide",
    description: "An informative article on how to clean and store sex toys safely to prevent infections. Explains that dirty toys can harbor bacteria and introduce bacteria that can cause infections. They can also collect lint, dust, and other debris. Emphasizes cleaning after every use and using the right methods for different materials.",
    url: "https://www.healthline.com/health/healthy-sex/how-to-clean-sex-toys",
    tags: ["cleaning", "care", "safety", "hygiene", "maintenance"],
    spiciness: 2,
    blueprintAlignment: ["Sexual"],
    affiliateReady: false,
    trusted: true
  },
  {
    id: "lingerie_inspiration",
    category: "products",
    title: "Lingerie & Outfit Inspiration",
    description: "Figure-flattering lingerie and bedroom attire ideas to boost confidence and allure. From elegant matching sets to playful costumes. Nothing gives you a sexier and more confident feeling than dressing in a matching lingerie set, even if you're the only one who knows you're wearing it.",
    url: "#",
    tags: ["lingerie", "confidence", "outfits", "matching-sets", "bedroom"],
    spiciness: 3,
    blueprintAlignment: ["Sensual"],
    affiliateReady: true,
    trusted: true,
    comingSoon: true
  },
  {
    id: "massage_oils_lubricants",
    category: "products",
    title: "Massage Oils & Lubricants",
    description: "A curated selection of body-safe massage oils, aromatic candles, and personal lubricants. Ideal for enhancing tactile sensations, minimizing discomfort (e.g. with vaginal dryness), and making intimate touch more pleasurable. Products range from all-natural oils to high-end silicone-based lubricants.",
    url: "#",
    tags: ["massage-oils", "lubricants", "body-safe", "tactile", "comfort"],
    spiciness: 2,
    blueprintAlignment: ["Sensual"],
    affiliateReady: true,
    trusted: true,
    comingSoon: true
  },
  {
    id: "beginner_toys",
    category: "products",
    title: "Beginner-Friendly Sex Toys",
    description: "Introductory toys for those new to exploration. Examples: a simple bullet vibrator, a basic dildo, or a vibrating cock ring – all body-safe and non-intimidating. These items focus on ease of use and gentle pleasure to help novices discover likes and dislikes.",
    url: "#",
    tags: ["toys", "beginner", "body-safe", "bullet-vibrator", "exploration"],
    spiciness: 3,
    blueprintAlignment: ["Sexual"],
    affiliateReady: true,
    trusted: true,
    comingSoon: true
  },
  {
    id: "advanced_toys_bondage",
    category: "products",
    title: "Advanced Toys & Bondage Accessories",
    description: "For experienced users seeking adventure: luxury vibrators (app-controlled or heating functions), BDSM kits (silk ties, handcuffs, floggers), and other high-end accessories. These cater to the Kinky blueprint with taboo or intense sensations, as well as Shapeshifter types who enjoy variety.",
    url: "#",
    tags: ["advanced", "BDSM", "luxury", "kinky", "shapeshifter"],
    spiciness: 5,
    blueprintAlignment: ["Kinky", "Shapeshifter"],
    affiliateReady: true,
    trusted: true,
    comingSoon: true
  },

  // Education & Learning
  {
    id: "erotic_blueprint_guide",
    category: "education",
    title: "Complete Erotic Blueprint Guide",
    description: "An in-depth guide to the 5 Erotic Blueprint types by sex educator Jaiya. Explains each arousal style: Energetic (turned on by anticipation and tease), Sensual (aroused by engaging all senses in a relaxing environment), Sexual (enjoys direct, visually explicit play), Kinky (aroused by the taboo or novel, like power play), and Shapeshifter (draws from all other types).",
    url: "https://www.jaiyainstitute.com/",
    tags: ["blueprints", "Jaiya", "arousal", "education", "types"],
    spiciness: 2,
    blueprintAlignment: ["All"],
    affiliateReady: false,
    trusted: true
  },
  {
    id: "yes_no_maybe_workshop",
    category: "education",
    title: "Communicating Your Needs – Yes/No/Maybe Workshop",
    description: "A tutorial on communicating about sex with partners. Teaches using 'I' statements and tools like a Yes/No/Maybe list to share boundaries and fantasies. A Yes/No/Maybe inventory can be extremely helpful in identifying activities you might be interested in and those you would like to set a boundary on.",
    url: "https://www.scarleteen.com/article/advice/yes_no_maybe_so_a_sexual_inventory_stocklist",
    tags: ["communication", "boundaries", "yes-no-maybe", "consent", "fantasies"],
    spiciness: 1,
    blueprintAlignment: ["All"],
    affiliateReady: false,
    trusted: true
  },
  {
    id: "online_courses_platform",
    category: "education",
    title: "Online Courses Platform",
    description: "E-learning platforms like Beducated or OMGYes, which offer video courses and interactive lessons on topics such as foreplay techniques, tantric massage, overcoming shame, etc. Users can follow along at their own pace to develop skills and knowledge.",
    url: "#",
    tags: ["courses", "beducated", "OMGYes", "foreplay", "tantric"],
    spiciness: 3,
    blueprintAlignment: ["All"],
    affiliateReady: true,
    trusted: true,
    comingSoon: true
  },
  {
    id: "communication_masterclass",
    category: "education",
    title: "Intimate Communication MasterClass",
    description: "A featured course (e.g. Emily Morse's MasterClass on Sex & Communication) that empowers couples to talk more openly. Emily's approach is about creating a safe space to ask for what you want and learn tactics to keep desire alive. She emphasizes that sexual wellness is an important pillar of our overall health and well-being.",
    url: "https://www.masterclass.com/classes/emily-morse-teaches-sex-and-communication",
    tags: ["masterclass", "Emily Morse", "communication", "desire", "wellness"],
    spiciness: 2,
    blueprintAlignment: ["All"],
    affiliateReady: false,
    trusted: true
  },

  // Techniques & Ideas
  {
    id: "sensual_massage",
    category: "techniques",
    title: "Sensual Massage Techniques",
    description: "Step-by-step guides on giving a romantic massage to a partner. Covers setting the mood (lighting, music, pillows) and basic strokes. Emphasizes communication during the massage – start with light pressure and ask if they'd like a little more. Pay attention to how they're responding physically.",
    url: "https://www.healthline.com/health/healthy-sex/how-to-give-massage",
    tags: ["massage", "romantic", "communication", "technique", "mood"],
    spiciness: 3,
    blueprintAlignment: ["Sensual"],
    affiliateReady: false,
    trusted: true
  },
  {
    id: "kissing_tips",
    category: "techniques",
    title: "Kissing Tips & Tricks",
    description: "How-to resources for becoming a better kisser. Covers everything from getting consent (asking 'Can I kiss you?' can be pretty sexy in context) to technique. Key tips: start slow and gentle, vary pressure gradually, keep your lips relaxed, use your hands naturally, and read your partner's body language.",
    url: "https://www.healthline.com/health/how-to-kiss",
    tags: ["kissing", "technique", "consent", "body-language", "romance"],
    spiciness: 2,
    blueprintAlignment: ["Sensual", "Sexual"],
    affiliateReady: false,
    trusted: true
  },
  {
    id: "sexy_games",
    category: "techniques",
    title: "Sexy Games & Idea Generators",
    description: "Fun ways to spark new experiences. Includes lists of couple's games (card decks like 'Deck of Desire' or apps like 'Intimately Us' that provide flirty challenges) and DIY games (sexy truth-or-dare, roleplay scenarios, etc.). Also highlights Mojo Upgrade – a free online quiz for couples to privately discover overlapping fantasies.",
    url: "https://mojoupgrade.com/",
    tags: ["games", "couples", "roleplay", "mojo-upgrade", "fantasies"],
    spiciness: 4,
    blueprintAlignment: ["Kinky", "Energetic"],
    affiliateReady: false,
    trusted: true
  },
  {
    id: "solo_exploration",
    category: "techniques",
    title: "Solo Exploration & Mindful Masturbation",
    description: "Tips for individuals to enhance self-pleasure and body awareness. For example: guided audio erotica for an Energetic type (focusing on breath and tease), or techniques like using a mirror or sensate focus exercises for a Sensual experience. Encourages a shame-free, mindful approach so users can learn what they enjoy.",
    url: "#",
    tags: ["solo", "masturbation", "mindful", "self-pleasure", "body-awareness"],
    spiciness: 3,
    blueprintAlignment: ["All"],
    affiliateReady: true,
    trusted: true,
    comingSoon: true
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
  },
  techniques: {
    title: "Techniques & Ideas",
    description: "Practical guides, tips, and creative ideas for intimate exploration",
    icon: Lightbulb,
    gradient: "from-amber-600 to-amber-800"
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
            {resource.comingSoon && (
              <Badge className="bg-amber-500/20 text-amber-200 border-amber-300/40 text-xs">
                Coming Soon
              </Badge>
            )}
            {resource.affiliateReady && !resource.comingSoon && (
              <Badge className="bg-green-500/20 text-green-200 border-green-300/40 text-xs">
                Partner Link
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

          {resource.comingSoon ? (
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/60 px-4 py-2 rounded-lg font-medium w-full justify-center mt-4 cursor-not-allowed">
              <span>Coming Soon</span>
              <Sparkles className="h-4 w-4" />
            </div>
          ) : (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full justify-center mt-4"
            >
              <span>Explore Resource</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
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
          <TabsList className="grid w-full grid-cols-5 bg-white/10 rounded-xl p-1 mb-8">
            {Object.entries(categoryConfig).map(([key, config]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 font-medium text-xs"
              >
                <config.icon className="h-3 w-3 mr-1" />
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