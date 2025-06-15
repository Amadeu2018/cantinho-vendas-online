
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { TrendingUp } from "lucide-react";

interface DailyStats {
  date: string;
  revenue: number;
  orders: number;
}

interface RevenueAreaChartProps {
  data: DailyStats[];
}

const CHART_COLORS = {
  primary: "#8B5CF6",
};

const RevenueAreaChart = ({ data }: RevenueAreaChartProps) => {
  const isMobile = useIsMobile();
  const chartHeight = isMobile ? 200 : 300;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-xs">
              {entry.name}: {typeof entry.value === 'number' ? 
                (entry.name === 'Receita' ? formatCurrency(entry.value) : entry.value) : 
                entry.value
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="lg:col-span-2 xl:col-span-1 transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          Receita por Dia
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: isMobile ? 10 : 12 }}
              interval={isMobile ? 1 : 0}
            />
            <YAxis 
              tickFormatter={(value) => isMobile ? `${(value/1000).toFixed(0)}k` : formatCurrency(value)}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 50 : 80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke={CHART_COLORS.primary} 
              strokeWidth={2}
              fill="url(#colorRevenue)"
              name="Receita"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueAreaChart;
