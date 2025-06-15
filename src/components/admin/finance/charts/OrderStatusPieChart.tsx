
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { PieChart as PieChartIcon } from "lucide-react";
import { Order } from "@/hooks/admin/use-orders-data";

interface StatusStats {
  name: string;
  value: number;
  color: string;
}

interface OrderStatusPieChartProps {
  orders: Order[];
}

const CHART_COLORS = {
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
};

const OrderStatusPieChart = ({ orders }: OrderStatusPieChartProps) => {
  const isMobile = useIsMobile();
  const chartHeight = isMobile ? 200 : 300;

  const statusData: StatusStats[] = [
    { name: 'Concluídos', value: orders.filter(o => o.status === 'completed').length, color: CHART_COLORS.success },
    { name: 'Pendentes', value: orders.filter(o => ['pending', 'confirmed', 'preparing', 'delivering'].includes(o.status)).length, color: CHART_COLORS.warning },
    { name: 'Cancelados', value: orders.filter(o => o.status === 'cancelled').length, color: CHART_COLORS.danger }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.payload.color }} className="text-xs">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          Status dos Pedidos
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-4">
          <ResponsiveContainer width="100%" height={chartHeight}>
            <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 60 : 80}
                innerRadius={isMobile ? 25 : 35}
                dataKey="value"
                label={!isMobile ? ({ name, value }) => `${name}: ${value}` : false}
                labelLine={false}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {isMobile && (
            <div className="flex flex-wrap gap-3 justify-center">
              {statusData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderStatusPieChart;
