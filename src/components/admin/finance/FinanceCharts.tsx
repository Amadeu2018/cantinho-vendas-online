
import React, { useMemo } from "react";
import { Order } from "@/hooks/admin/use-orders-data";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile, useIsMobileOrTablet } from "@/hooks/use-mobile";
import RevenueAreaChart from "./charts/RevenueAreaChart";
import OrdersBarChart from "./charts/OrdersBarChart";
import OrderStatusPieChart from "./charts/OrderStatusPieChart";
import TrendLineChart from "./charts/TrendLineChart";
import EmptyChartsState from "./charts/EmptyChartsState";

interface DailyStats {
  date: string;
  revenue: number;
  orders: number;
}

interface FinanceChartsProps {
  orders: Order[];
}

const FinanceCharts = ({ orders }: FinanceChartsProps) => {
  const isMobile = useIsMobile();
  const isMobileOrTablet = useIsMobileOrTablet();

  const dailyStats = useMemo(() => {
    const stats: { [key: string]: { revenue: number, orders: number } } = {};
    
    orders.forEach(order => {
      try {
        let dateStr: string;
        if (order.createdAt) {
          dateStr = order.createdAt.includes('T') 
            ? format(parseISO(order.createdAt), 'yyyy-MM-dd')
            : format(new Date(order.createdAt), 'yyyy-MM-dd');
        } else {
          dateStr = format(new Date(), 'yyyy-MM-dd');
        }

        if (!stats[dateStr]) {
          stats[dateStr] = { revenue: 0, orders: 0 };
        }
        stats[dateStr].revenue += Number(order.total) || 0;
        stats[dateStr].orders += 1;
      } catch (error) {
        console.error('Error processing order date:', error, order);
      }
    });

    return Object.keys(stats).sort().map(date => ({
      date: format(new Date(date), 'dd/MM', { locale: ptBR }),
      revenue: stats[date].revenue,
      orders: stats[date].orders,
    }));
  }, [orders]);

  const gridCols = isMobile ? "grid-cols-1" : isMobileOrTablet ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3";

  if (!orders || orders.length === 0) {
    return <EmptyChartsState />;
  }

  return (
    <div className={`grid ${gridCols} gap-4 sm:gap-6 p-2 sm:p-0`}>
      <RevenueAreaChart data={dailyStats} />
      <OrdersBarChart data={dailyStats} />
      <OrderStatusPieChart orders={orders} />
      <TrendLineChart data={dailyStats} />
    </div>
  );
};

export default FinanceCharts;
