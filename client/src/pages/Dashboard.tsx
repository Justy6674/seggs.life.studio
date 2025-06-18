import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  BarChart3, 
  Brain, 
  ClipboardList, 
  Users, 
  ClipboardCheck, 
  Settings,
  Heart,
  TrendingUp
} from "lucide-react";

export default function Dashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ["/api/dashboard"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Heart className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getGreeting()}, {user?.firstName || 'there'}!
                </h1>
                <p className="text-gray-600">Ready to strengthen your connection today?</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="text-sm text-gray-600">
                {dashboardData?.partnerConnected ? "Partner Connected" : "Solo Journey"}
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Intimacy Tracking"
            description="Monitor your connection patterns and growth"
            icon={BarChart3}
            value={`${dashboardData?.intimacyScore || 0}%`}
            trend="+5% this week"
            trendColor="text-accent"
            iconColor="text-primary"
          />

          <DashboardCard
            title="AI Suggestions"
            description="Personalized recommendations for deeper connection"
            icon={Brain}
            value={dashboardData?.newSuggestions || 0}
            trend="New today"
            trendColor="text-secondary"
            iconColor="text-secondary"
          />

          <DashboardCard
            title="Blueprint Results"
            description="Your personalized intimacy profile and insights"
            icon={ClipboardList}
            value={`${dashboardData?.completedAssessments || 0}/5`}
            trend="Complete"
            trendColor="text-accent"
            iconColor="text-accent"
          />

          <DashboardCard
            title="Partner Connect"
            description="Sync and share your journey together"
            icon={Users}
            value={dashboardData?.partnerConnected ? "Connected" : "Solo"}
            iconColor="text-purple-500"
          />

          <DashboardCard
            title="Assessments"
            description="Discover new aspects of your relationship"
            icon={ClipboardCheck}
            value={8}
            trend="Available"
            trendColor="text-orange-500"
            iconColor="text-orange-500"
          />

          <DashboardCard
            title="Personalization"
            description="Tailor your experience to your needs"
            icon={Settings}
            value="Custom"
            iconColor="text-teal-500"
          />
        </div>

        {/* Grid Layout for Content and Chat */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Progress Stats */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="text-primary" size={20} />
                  <span>Your Progress This Week</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {dashboardData?.weeklyStats?.connections || 0}
                      </div>
                      <div className="text-sm text-gray-600">Connections</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">
                        {dashboardData?.weeklyStats?.insights || 0}
                      </div>
                      <div className="text-sm text-gray-600">AI Insights</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">
                        {dashboardData?.weeklyStats?.assessments || 0}
                      </div>
                      <div className="text-sm text-gray-600">Assessments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-500">
                        {dashboardData?.weeklyStats?.chatSessions || 0}
                      </div>
                      <div className="text-sm text-gray-600">Chat Sessions</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Chat Interface */}
          <div className="lg:col-span-1">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
}
