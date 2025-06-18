import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Book, Globe, Users, Heart, Star } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  rating: number;
  type: 'article' | 'book' | 'website' | 'course' | 'podcast';
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Come As You Are',
    description: 'Emily Nagoski\'s groundbreaking book on understanding your unique sexuality and how it works.',
    url: 'https://www.emilynagoski.com/come-as-you-are',
    category: 'Education',
    rating: 5,
    type: 'book'
  },
  {
    id: '2',
    title: 'Mating in Captivity',
    description: 'Esther Perel explores the paradox of maintaining desire in long-term relationships.',
    url: 'https://estherperel.com/book/mating-in-captivity/',
    category: 'Relationships',
    rating: 5,
    type: 'book'
  },
  {
    id: '3',
    title: 'The Gottman Institute',
    description: 'Research-based resources for building stronger relationships and emotional connection.',
    url: 'https://www.gottman.com/',
    category: 'Research',
    rating: 5,
    type: 'website'
  },
  {
    id: '4',
    title: 'OMGYes',
    description: 'Research-based platform exploring techniques for pleasure, with interactive guides.',
    url: 'https://www.omgyes.com/',
    category: 'Pleasure Education',
    rating: 4,
    type: 'course'
  },
  {
    id: '5',
    title: 'Sex with Emily Podcast',
    description: 'Popular podcast covering sex, relationships, and intimacy with expert advice.',
    url: 'https://sexwithemily.com/',
    category: 'Education',
    rating: 4,
    type: 'podcast'
  },
  {
    id: '6',
    title: 'The School of Life - Relationships',
    description: 'Thoughtful articles and videos on improving relationships and emotional intelligence.',
    url: 'https://www.theschooloflife.com/relationships/',
    category: 'Philosophy',
    rating: 4,
    type: 'website'
  },
  {
    id: '7',
    title: 'Sensate Focus Exercises',
    description: 'Evidence-based touch exercises for building intimacy and reducing performance anxiety.',
    url: 'https://www.healthline.com/health/healthy-sex/sensate-focus',
    category: 'Techniques',
    rating: 4,
    type: 'article'
  },
  {
    id: '8',
    title: 'Untrue: Why Nearly Everything We Believe About Women, Lust, and Infidelity Is Wrong',
    description: 'Wednesday Martin challenges myths about female sexuality with scientific research.',
    url: 'https://www.wednesdaymartin.com/untrue',
    category: 'Research',
    rating: 4,
    type: 'book'
  },
  {
    id: '9',
    title: 'AASECT - American Association of Sexuality Educators',
    description: 'Find certified sex therapists and educators, plus professional resources.',
    url: 'https://www.aasect.org/',
    category: 'Professional',
    rating: 5,
    type: 'website'
  },
  {
    id: '10',
    title: 'Planned Parenthood - Sexual Health',
    description: 'Comprehensive, medically accurate information about sexual health and wellness.',
    url: 'https://www.plannedparenthood.org/learn/sexual-health',
    category: 'Health',
    rating: 5,
    type: 'website'
  }
];

const categories = ['All', 'Education', 'Relationships', 'Research', 'Pleasure Education', 'Philosophy', 'Techniques', 'Professional', 'Health'];

export default function Explore() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'book': return <Book className="h-5 w-5" />;
      case 'website': return <Globe className="h-5 w-5" />;
      case 'course': return <Users className="h-5 w-5" />;
      case 'podcast': return <Heart className="h-5 w-5" />;
      default: return <ExternalLink className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'book': return 'bg-blue-100 text-blue-800';
      case 'website': return 'bg-green-100 text-green-800';
      case 'course': return 'bg-purple-100 text-purple-800';
      case 'podcast': return 'bg-pink-100 text-pink-800';
      case 'article': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">Explore Resources</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Curated collection of evidence-based resources for sexual wellness, relationship health, and intimate education
          </p>
        </div>

        {/* Category Filter */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={category === 'All' ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <Card key={resource.id} className="shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getIcon(resource.type)}
                    <Badge className={getTypeColor(resource.type)}>
                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex">
                    {renderStars(resource.rating)}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">
                  {resource.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {resource.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {resource.category}
                  </Badge>
                  <Button 
                    size="sm" 
                    className="bg-primary text-white"
                    onClick={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <Card className="mt-8 bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Important Disclaimers</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <ul className="space-y-2">
                <li>• These resources are for educational purposes only</li>
                <li>• Always consult healthcare providers for medical concerns</li>
                <li>• Content may not be suitable for all ages or situations</li>
              </ul>
              <ul className="space-y-2">
                <li>• External links are provided for convenience only</li>
                <li>• We do not endorse all views expressed in external content</li>
                <li>• Practice safe and consensual activities always</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Section */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>Suggest a Resource</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Know of a valuable resource that should be included? We'd love to hear your suggestions.
            </p>
            <Button variant="outline" className="w-full md:w-auto">
              Submit Suggestion
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}