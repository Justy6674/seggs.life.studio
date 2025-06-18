import { Home, Heart, Sparkles, Users, Settings } from "lucide-react";
import { useLocation } from "wouter";

const navigationItems = [
  {
    id: "dashboard",
    label: "Home",
    icon: Home,
    path: "/members/dashboard"
  },
  {
    id: "explore",
    label: "Explore",
    icon: Sparkles,
    path: "/members/explore"
  },
  {
    id: "blueprint",
    label: "Blueprint",
    icon: Heart,
    path: "/members/blueprint"
  },
  {
    id: "partner",
    label: "Partner",
    icon: Users,
    path: "/members/partner"
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    path: "/members/settings"
  }
];

export function BottomNavigation() {
  const [location, navigate] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="flex items-center justify-around px-4 py-2 pb-safe">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path || (item.path === "/members/dashboard" && location === "/");
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center p-2 min-w-[60px] transition-colors ${
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon 
                className={`h-6 w-6 mb-1 ${isActive ? "fill-current" : ""}`} 
              />
              <span className={`text-xs font-medium ${isActive ? "font-semibold" : ""}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}