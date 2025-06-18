import { Button } from "@/components/ui/button";
import { Heart, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Navigation() {
  const { isAuthenticated, user } = useAuth();

  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  const handleSignOut = () => {
    window.location.href = "/api/logout";
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Heart className="text-white" size={16} />
            </div>
            <span className="text-xl font-bold text-gray-900">Seggs.Life Studio</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">How It Works</a>
                <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">Pricing</a>
                <Button variant="ghost" onClick={handleSignIn} className="text-primary hover:text-primary/80">
                  Sign In
                </Button>
                <Button onClick={handleSignIn} className="bg-primary text-white hover:bg-primary/90">
                  Start Your Journey
                </Button>
              </>
            ) : (
              <>
                <span className="text-gray-600">Welcome back, {user?.firstName || 'User'}</span>
                <Button variant="ghost" onClick={handleSignOut} className="text-gray-600 hover:text-gray-900">
                  Sign Out
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
