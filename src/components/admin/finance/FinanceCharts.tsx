
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import { Order } from "@/hooks/admin/use-orders-data";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import { useIsMobile, useIsMobileOrTablet } from "@/hooks/use-mobile";
import { SmoothScrollArea } from "@/components/ui/smooth-scroll-area";
import { useScrollTransitions } from "@/hooks/use-scroll-transitions";
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react";

interface DailyStats {
  date: string;
  revenue: number;
  orders: number;
}

interface StatusStats {
  name: string;
  value: number;
  color: string;
}

interface FinanceChartsProps {
  orders: Order[];
}

const CHART_COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))", 
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  muted: "hsl(var(--muted-foreground))"
};

const FinanceCharts = ({ orders }: FinanceChartsProps) => {
  const isMobile = useIsMobile();
  const isMobileOrTablet = useIsMobileOrTablet();
  const { registerItem } = useScrollTransitions({ enableFadeTransitions: true });

  const dailyStats = useMemo(() => {
    const stats: { [key: string]: { revenue: number, orders: number } } = {};
    
    orders.forEach(order => {
      const date = format(parseISO(order.createdAt), 'yyyy-MM-dd');
      if (!stats[date]) {
        stats[date] = { revenue: 0, orders: 0 };
      }
      stats[date].revenue += order.total;
      stats[date].orders += 1;
    });

    return Object.keys(stats).sort().map(date => ({
      date: format(parseISO(date), 'dd/MM', { locale: ptBR }),
      revenue: stats[date].revenue,
      orders: stats[date].orders,
    }));
  }, [orders]);

  const statusData: StatusStats[] = useMemo(() => ([
    { name: 'Concluídos', value: orders.filter(o => o.status === 'completed').length, color: CHART_COLORS.success },
    { name: 'Pendentes', value: orders.filter(o => ['pending', 'confirmed', 'preparing', 'delivering'].includes(o.status)).length, color: CHART_COLORS.warning },
    { name: 'Cancelados', value: orders.filter(o => o.status === 'cancelled').length, color: CHART_COLORS.danger }
  ]), [orders]);

  const chartHeight = isMobile ? 200 : isMobileOrTablet ? 250 : 300;
  const gridCols = isMobile ? "grid-cols-1" : isMobileOrTablet ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3";

  // Custom tooltip para mobile
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
    <SmoothScrollArea className="h-full" fadeEdges={true}>
      <div className={`grid ${gridCols} gap-4 sm:gap-6 p-2 sm:p-0`}>
        {/* Receita por Dia - Area Chart para melhor visualização mobile */}
        <Card 
          className="lg:col-span-2 xl:col-span-1 transition-all duration-300 hover:shadow-md"
          ref={(el) => registerItem('revenue-chart', el)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              Receita por Dia
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={chartHeight}>
              <AreaChart data={dailyStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
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

        {/* Pedidos por Dia */}
        <Card 
          className="transition-all duration-300 hover:shadow-md"
          ref={(el) => registerItem('orders-chart', el)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              Pedidos por Dia
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart data={dailyStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  interval={isMobile ? 1 : 0}
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 30 : 40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="orders" 
                  fill={CHART_COLORS.primary} 
                  radius={[4, 4, 0, 0]}
                  name="Pedidos"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status dos Pedidos - Melhorado para mobile */}
        <Card 
          className="transition-all duration-300 hover:shadow-md"
          ref={(el) => registerItem('status-chart', el)}
        >
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
              
              {/* Legenda para mobile */}
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

        {/* Gráfico de Tendência (novo) */}
        <Card 
          className="lg:col-span-2 xl:col-span-3 transition-all duration-300 hover:shadow-md"
          ref={(el) => registerItem('trend-chart', el)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              Tendência de Vendas e Receita
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <LineChart data={dailyStats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
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
      </div>
    </SmoothScrollArea>
  );
};

export default FinanceCharts;
