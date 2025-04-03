
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
}

const DashboardCard = ({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className,
}: DashboardCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={cn("text-xs font-medium", {
                "text-green-500": trend === "up",
                "text-red-500": trend === "down",
                "text-gray-500": trend === "neutral",
              })}
            >
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
