import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/layout/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { SeggsyBot } from "@/components/chat/SeggsyBot";
import { Bot } from "lucide-react";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Subscribe from "@/pages/Subscribe";
import NotFound from "@/pages/not-found";

// Members Area Pages
import MembersDashboard from "@/pages/members/MembersDashboard";
import Boudoir from "@/pages/members/Boudoir";
import Generator from "@/pages/members/Generator";
import Blueprint from "@/pages/members/Blueprint";
import Explore from "@/pages/members/Explore";
import Settings from "@/pages/members/Settings";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isBotOpen, setIsBotOpen] = useState(false);

  const toggleBot = () => setIsBotOpen(!isBotOpen);
  const closeBot = () => setIsBotOpen(false);

  return (
    <>
      <Navigation />
      <Switch>
        {isLoading || !isAuthenticated ? (
          <>
            <Route path="/" component={Landing} />
            <Route path="/subscribe" component={Subscribe} />
          </>
        ) : (
          <>
            <Route path="/" component={MembersDashboard} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/members/boudoir" component={Boudoir} />
            <Route path="/members/generator" component={Generator} />
            <Route path="/members/blueprint" component={Blueprint} />
            <Route path="/members/explore" component={Explore} />
            <Route path="/members/settings" component={Settings} />
            <Route path="/subscribe" component={Subscribe} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>

      {/* SeggsyBot for authenticated users only */}
      {isAuthenticated && (
        <>
          <SeggsyBot 
            isOpen={isBotOpen} 
            onToggle={toggleBot} 
            onClose={closeBot} 
          />
          
          {/* Bot Toggle Button */}
          {!isBotOpen && (
            <Button
              onClick={toggleBot}
              className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-2xl hover:scale-105 transition-all duration-300 z-40"
            >
              <Bot size={24} />
            </Button>
          )}
        </>
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
