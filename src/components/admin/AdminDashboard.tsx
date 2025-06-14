
import React from "react";
import { Order } from "@/hooks/admin/use-orders-data";
import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardStatsGrid from "./dashboard/DashboardStatsGrid";
import DashboardCharts from "./dashboard/DashboardCharts";
import DashboardContent from "./dashboard/DashboardContent";
import DashboardRefresh from "./dashboard/DashboardRefresh";
import AdminOrdersList from "./AdminOrdersList";
import AdminProducts from "./AdminProducts";
import AdminFinance from "./AdminFinance";
import AdminInventory from "./AdminInventory";
import AdminReports from "./AdminReports";
import AdminCustomers from "./AdminCustomers";
import AdminSettings from "./AdminSettings";

interface AdminDashboardProps {
  orders: Order[];
  fetchingOrders: boolean;
  onSelectOrder: (orderId: string) => void;
  onPrepareInvoice: (order: Order) => void;
  onLogout: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const AdminDashboard = ({ 
  orders, 
  fetchingOrders, 
  onSelectOrder, 
  onPrepareInvoice,
  onLogout,
  activeTab = "dashboard",
  onTabChange
}: AdminDashboardProps) => {
  const { handleRefresh, isRefreshing } = DashboardRefresh({ 
    onRefresh: async () => {
      // Refresh logic here if needed
    }
  });

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return (
          <AdminOrdersList 
            orders={orders} 
            onSelectOrder={onSelectOrder}
            fetchingOrders={fetchingOrders}
          />
        );
      case "products":
        return <AdminProducts />;
      case "customers":
        return <AdminCustomers />;
      case "finance":
        return <AdminFinance orders={orders} />;
      case "inventory":
        return <AdminInventory />;
      case "reports":
        return <AdminReports />;
      case "settings":
        return <AdminSettings />;
      case "dashboard":
      default:
        return (
          <div className="space-y-8">
            <DashboardHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />
            <DashboardStatsGrid orders={orders} />
            <DashboardCharts orders={orders} />
            <DashboardContent 
              orders={orders}
              onSelectOrder={onSelectOrder}
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;
