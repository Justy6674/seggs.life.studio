import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { useAuth } from "@/hooks/useAuth";
import { SeggsyBot } from "@/components/chat/SeggsyBot";
import Landing from "@/pages/Landing";
import Subscribe from "@/pages/Subscribe";
import NotFound from "@/pages/not-found";
import BlueprintOnboarding from "@/pages/BlueprintOnboarding";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Members Area Pages
import ModernDashboard from "@/pages/members/ModernDashboard";
import Boudoir from "@/pages/members/BoudoirComplete";
import Blueprint from "@/pages/members/Blueprint";
import PartnerSync from "@/pages/members/PartnerSync";
import Explore from "@/pages/members/Explore";
import Settings from "@/pages/members/Settings";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isBotOpen, setIsBotOpen] = useState(false);

  const toggleBot = () => setIsBotOpen(!isBotOpen);
  const closeBot = () => setIsBotOpen(false);

  // Check if user has completed blueprint quiz
  const { data: userProfile } = useQuery({
    queryKey: ["/api/user/profile", user?.uid],
    enabled: !!user?.uid && isAuthenticated,
    retry: false,
  });

  const hasBlueprint = (userProfile as any)?.blueprintType;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#7f1d1d] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/subscribe" component={Subscribe} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Show blueprint onboarding for authenticated users without blueprint
  if (!hasBlueprint && userProfile !== undefined) {
    return (
      <BlueprintOnboarding 
        onComplete={(results) => {
          // Refetch user profile to get updated blueprint data
          queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
        }} 
      />
    );
  }

  // Show main app for authenticated users with completed blueprint
  return (
    <>
      <div className="pb-20">
        <Switch>
          <Route path="/" component={ModernDashboard} />
          <Route path="/members/dashboard" component={ModernDashboard} />
          <Route path="/members/explore" component={Explore} />
          <Route path="/members/boudoir" component={Boudoir} />
          <Route path="/members/blueprint" component={Blueprint} />
          <Route path="/members/partner" component={PartnerSync} />
          <Route path="/members/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </div>

      <BottomNavigation />
      
      {/* SeggsyBot for authenticated users only */}
      <SeggsyBot 
        isOpen={isBotOpen} 
        onToggle={toggleBot} 
        onClose={closeBot} 
      />
      
      {/* Bot Toggle Button */}
      {!isBotOpen && (
        <Button
          onClick={toggleBot}
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] text-white shadow-2xl hover:scale-105 transition-all duration-300 z-40 overflow-hidden"
        >
          <img src="/SEGGSYCHATBOT.png" alt="SeggsyBot" className="w-8 h-8 object-cover" />
        </Button>
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
