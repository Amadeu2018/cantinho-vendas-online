
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Activity } from "lucide-react";

interface DailyStats {
  date: string;
  revenue: number;
  orders: number;
}

interface TrendLineChartProps {
  data: DailyStats[];
}

const CHART_COLORS = {
  success: "#10B981",
  warning: "#F59E0B",
};

const TrendLineChart = ({ data }: TrendLineChartProps) => {
  const isMobile = useIsMobile();
  const chartHeight = isMobile ? 250 : 300;

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
    <Card className="lg:col-span-2 xl:col-span-3 transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
          Tendência de Vendas e Receita
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: isMobile ? 10 : 12 }}
              interval={isMobile ? 1 : 0}
            />
            <YAxis 
              yAxisId="left"
              orientation="left"
              tickFormatter={(value) => isMobile ? `${(value/1000).toFixed(0)}k` : formatCurrency(value)}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 50 : 80}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 30 : 40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="revenue" 
              stroke={CHART_COLORS.success} 
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Receita"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="orders" 
              stroke={CHART_COLORS.warning} 
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Pedidos"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TrendLineChart;
