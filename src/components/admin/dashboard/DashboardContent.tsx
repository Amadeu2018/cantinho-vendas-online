
import React from "react";
import { Order } from "@/hooks/admin/use-orders-data";
import DashboardStatsGrid from "./DashboardStatsGrid";
import DashboardCharts from "./DashboardCharts";
import RecentOrders from "./RecentOrders";

interface DashboardContentProps {
  orders: Order[];
  onSelectOrder: (orderId: string) => void;
}

const DashboardContent = ({ orders, onSelectOrder }: DashboardContentProps) => {
  return (
    <div className="space-y-8">
      <DashboardStatsGrid orders={orders} />
      <DashboardCharts orders={orders} />
      <RecentOrders 
        orders={orders}
        onSelectOrder={onSelectOrder}
      />
    </div>
  );
};

export default DashboardContent;
