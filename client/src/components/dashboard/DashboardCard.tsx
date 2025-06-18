import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  value: string | number;
  trend?: string;
  trendColor?: string;
  iconColor?: string;
  onClick?: () => void;
}

export function DashboardCard({
  title,
  description,
  icon: Icon,
  value,
  trend,
  trendColor = "text-accent",
  iconColor = "text-primary",
  onClick,
}: DashboardCardProps) {
  return (
    <Card 
      className="hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 bg-${iconColor.split('-')[1]}/10 rounded-xl flex items-center justify-center`}>
            <Icon className={iconColor} size={20} />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {trend && (
              <div className={`text-xs ${trendColor}`}>{trend}</div>
            )}
          </div>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}
