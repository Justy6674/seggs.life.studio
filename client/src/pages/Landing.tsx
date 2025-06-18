import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Star, Users, Zap, ArrowRight, CheckCircle, Play, Shield, Lock, Brain } from "lucide-react";

export default function Landing() {
  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background Hero Image */}
        <div className="absolute inset-0">
          <img 
            src="/seggsheroimage.png" 
            alt="Seggs.Life Studio Hero" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/60 to-background/40"></div>
        </div>
        
        <div className="relative px-4 py-20 md:py-32 w-full">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <img 
                  src="/SeggsLogoNoBackground.png" 
                  alt="Seggs.Life Studio Logo" 
                  className="h-16 md:h-20 w-auto"
                />
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-8">
                <span className="text-accent">
                  Stay erotically connected, stay playful, explore adult desires.
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-foreground/80 max-w-4xl mx-auto leading-relaxed mb-12">
                Rediscover what turns you both on—with playful, private tools for exploring desires, sparking connection, and making intimacy fun.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Button 
                  onClick={handleSignIn}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  🚀 Enter Members Area
                  <ArrowRight className="ml-2" size={20} />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-accent/30 hover:border-accent text-foreground hover:text-foreground hover:bg-accent/10 px-8 py-6 text-xl font-bold rounded-2xl transition-all duration-300"
                >
                  <Play className="mr-2" size={20} />
                  👀 Preview Features
                </Button>
              </div>
              
              <p className="text-foreground/60 max-w-3xl mx-auto leading-relaxed text-lg">
                🔒 <strong>100% private and secure</strong> — Only you and your partner see your answers, ideas, and shared experiences. No judgment, just fun.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-slate-900/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-amber-100 mb-6">
              Your Complete Intimacy Toolkit
            </h2>
            <p className="text-xl text-amber-100/80 max-w-3xl mx-auto">
              Everything you need to deepen connection, explore desires, and keep the spark alive
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-amber-200/20 hover:border-amber-200/40 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-amber-100 mb-4">Erotic Blueprint Quiz</h3>
                <p className="text-amber-100/70 leading-relaxed">
                  Discover your unique pathway to pleasure with our comprehensive assessment
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-amber-200/20 hover:border-amber-200/40 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-amber-100 mb-4">SeggsyBot AI</h3>
                <p className="text-amber-100/70 leading-relaxed">
                  Your personal intimacy companion providing thoughtful guidance and insights
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-amber-200/20 hover:border-amber-200/40 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-amber-100 mb-4">Partner Connection</h3>
                <p className="text-amber-100/70 leading-relaxed">
                  Share your journey together with secure partner linking and insights
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-amber-200/20 hover:border-amber-200/40 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-amber-100 mb-4">Boudoir Inspiration</h3>
                <p className="text-amber-100/70 leading-relaxed">
                  Personalized conversation starters and intimate prompts tailored to your style
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-amber-200/20 hover:border-amber-200/40 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Star className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-amber-100 mb-4">Message Generator</h3>
                <p className="text-amber-100/70 leading-relaxed">
                  Create personalized flirty messages that perfectly match your relationship dynamic
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-amber-200/20 hover:border-amber-200/40 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-amber-100 mb-4">Complete Privacy</h3>
                <p className="text-amber-100/70 leading-relaxed">
                  End-to-end encryption ensures your intimate moments stay between you and your partner
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Reignite Your Connection?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of couples who have transformed their intimate relationships with our playful, evidence-based approach.
          </p>
          
          <Button 
            onClick={handleSignIn}
            size="lg" 
            className="bg-white text-red-600 hover:bg-amber-50 px-12 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Start Your Journey Today
            <ArrowRight className="ml-2" size={20} />
          </Button>
          
          <div className="flex items-center justify-center space-x-8 mt-12 text-white/80">
            <div className="flex items-center">
              <Lock className="mr-2" size={20} />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2" size={20} />
              <span>Evidence-Based</span>
            </div>
            <div className="flex items-center">
              <Heart className="mr-2" size={20} />
              <span>Relationship Focused</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}