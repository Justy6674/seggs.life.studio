import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { 
  Heart, 
  Shield, 
  Lock, 
  Users, 
  BarChart3, 
  Brain, 
  ClipboardList, 
  Settings, 
  MessageCircle,
  Rocket,
  Play,
  Check,
  Star
} from "lucide-react";

export default function Landing() {
  const handleStartJourney = () => {
    window.location.href = "/api/login";
  };

  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Transform Your{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Intimate Connection
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                AI-powered insights, personalized guidance, and secure tracking to help couples build deeper intimacy and stronger relationships.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button onClick={handleStartJourney} size="lg" className="bg-primary text-white px-8 py-4 text-lg font-semibold hover:bg-primary/90 shadow-lg hover:shadow-xl">
                  <Rocket className="mr-2" size={20} />
                  Start Your Journey
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-gray-300 text-gray-700 px-8 py-4 text-lg font-semibold hover:border-primary hover:text-primary">
                  <Play className="mr-2" size={20} />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Shield className="text-accent" size={16} />
                  <span>100% Private</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Lock className="text-accent" size={16} />
                  <span>End-to-End Encrypted</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="text-accent" size={16} />
                  <span>10k+ Couples</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522938974444-f12497b69347?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Couple having intimate conversation" 
                className="rounded-2xl shadow-2xl w-full"
              />
              
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">AI Insights Active</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center space-x-2">
                  <Heart className="text-secondary" size={16} />
                  <span className="text-sm font-medium text-gray-700">Intimacy Score: 92%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need for Deeper Connection</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our comprehensive platform combines AI insights, tracking tools, and personalized guidance to transform your intimate relationship.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-indigo-50 to-white hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Intimacy Tracking</h3>
                <p className="text-gray-600 leading-relaxed">Monitor your connection patterns, mood trends, and relationship milestones with intelligent tracking and insights.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-50 to-white hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                  <Brain className="text-secondary" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Suggestions</h3>
                <p className="text-gray-600 leading-relaxed">Get personalized recommendations based on your relationship patterns and preferences from our advanced AI.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-white hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                  <ClipboardList className="text-accent" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Blueprint Results</h3>
                <p className="text-gray-600 leading-relaxed">Comprehensive assessments that reveal your unique intimacy profile and growth opportunities.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                  <Users className="text-purple-500" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Partner Connect</h3>
                <p className="text-gray-600 leading-relaxed">Securely sync with your partner to share insights, goals, and progress in your intimate journey together.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-white hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
                  <Settings className="text-orange-500" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalization</h3>
                <p className="text-gray-600 leading-relaxed">Customize your experience with preferences, goals, and privacy settings tailored to your unique needs.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50 to-white hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6">
                  <MessageCircle className="text-teal-500" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">SeggsyBot Chat</h3>
                <p className="text-gray-600 leading-relaxed">24/7 AI companion for intimate questions, guidance, and support whenever you need it most.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Chat Interface */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet SeggsyBot</h2>
            <p className="text-xl text-gray-600">Your private AI companion for intimate questions and personalized guidance</p>
          </div>

          <ChatInterface className="shadow-2xl border border-gray-100" />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Start your journey to deeper intimacy with flexible plans designed for every couple</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Individual Plan */}
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Individual</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">$19</div>
                <div className="text-gray-600 mb-8">per month</div>
                
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center space-x-3">
                    <Check className="text-accent" size={16} />
                    <span className="text-gray-700">Personal intimacy tracking</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="text-accent" size={16} />
                    <span className="text-gray-700">AI suggestions & insights</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="text-accent" size={16} />
                    <span className="text-gray-700">Basic assessments</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="text-accent" size={16} />
                    <span className="text-gray-700">SeggsyBot chat access</span>
                  </li>
                </ul>
                
                <Button variant="outline" className="w-full" onClick={handleStartJourney}>
                  Choose Individual
                </Button>
              </CardContent>
            </Card>

            {/* Couple Plan (Featured) */}
            <Card className="bg-gradient-to-br from-primary to-secondary text-white shadow-2xl border-2 border-primary relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-primary px-4 py-2 rounded-full text-sm font-bold">
                Most Popular
              </div>
              
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold mb-2">Couple</h3>
                <div className="text-4xl font-bold mb-1">$29</div>
                <div className="text-primary-100 mb-8">per month, for 2</div>
                
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center space-x-3">
                    <Check className="text-green-300" size={16} />
                    <span>Everything in Individual</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="text-green-300" size={16} />
                    <span>Partner synchronization</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="text-green-300" size={16} />
                    <span>Shared insights & goals</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="text-green-300" size={16} />
                    <span>Advanced assessments</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="text-green-300" size={16} />
                    <span>Priority support</span>
                  </li>
                </ul>
                
                <Button className="w-full bg-white text-primary hover:bg-gray-50" onClick={handleStartJourney}>
                  Start Couple Journey
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">$49</div>
                <div className="text-gray-600 mb-8">per month</div>
                
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center space-x-3">
                    <Check className="text-accent" size={16} />
                    <span className="text-gray-700">Everything in Couple</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="text-accent" size={16} />
                    <span className="text-gray-700">Expert consultations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="text-accent" size={16} />
                    <span className="text-gray-700">Custom blueprints</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="text-accent" size={16} />
                    <span className="text-gray-700">Advanced analytics</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="text-accent" size={16} />
                    <span className="text-gray-700">24/7 priority support</span>
                  </li>
                </ul>
                
                <Button variant="outline" className="w-full" onClick={handleStartJourney}>
                  Choose Premium
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">All plans include 7-day free trial • Cancel anytime • Secure payment</p>
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <Shield className="text-accent" size={16} />
                <span className="text-gray-600">256-bit SSL</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="text-accent" size={16} />
                <span className="text-gray-600">Stripe Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="text-accent" size={16} />
                <span className="text-gray-600">GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Heart className="text-white" size={16} />
                </div>
                <span className="text-xl font-bold">Seggs.Life Studio</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Empowering couples with AI-driven insights to build deeper, more fulfilling intimate relationships.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Seggs.Life Studio. All rights reserved. Built with ❤️ for deeper connections.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
