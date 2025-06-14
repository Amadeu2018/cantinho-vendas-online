
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  gradient?: string;
}

const DashboardCard = ({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className,
  gradient = "from-blue-50 to-blue-100"
}: DashboardCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden hover:shadow-lg transition-all duration-300 border-0", 
      `bg-gradient-to-br ${gradient}`,
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        {icon && (
          <div className="p-2 rounded-lg bg-white/50 backdrop-blur-sm">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-800 mb-1">{value}</div>
        {description && <p className="text-xs text-gray-600 mb-2">{description}</p>}
        {trend && trendValue && (
          <div className="flex items-center">
            <span
              className={cn("text-xs font-medium flex items-center gap-1", {
                "text-green-600": trend === "up",
                "text-red-600": trend === "down",
                "text-gray-600": trend === "neutral",
              })}
            >
              {trend === "up" && "↗"}
              {trend === "down" && "↘"}
              {trend === "neutral" && "→"}
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
