
import { useState } from "react";
import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardContent from "./dashboard/DashboardContent";
import AdminOrdersList from "./AdminOrdersList";
import AdminProducts from "./AdminProducts";
import AdminCustomers from "./AdminCustomers";
import AdminFinance from "./AdminFinance";
import AdminInventory from "./AdminInventory";
import AdminReports from "./AdminReports";
import AdminSettings from "./AdminSettings";
import AdminEventRequests from "./AdminEventRequests";
import { Order } from "@/hooks/admin/use-orders-data";

interface AdminDashboardProps {
  orders: Order[];
  fetchingOrders: boolean;
  onSelectOrder: (orderId: string) => void;
  onPrepareInvoice: (order: Order) => void;
  onLogout: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminDashboard = ({ 
  orders, 
  fetchingOrders,
  onSelectOrder, 
  onPrepareInvoice,
  onLogout,
  activeTab,
  onTabChange
}: AdminDashboardProps) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardContent 
            orders={orders}
            onSelectOrder={onSelectOrder}
          />
        );
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
        return <AdminReports orders={orders} />;
      case "settings":
        return <AdminSettings />;
      case "events":
        return <AdminEventRequests />;
      default:
        return (
          <DashboardContent 
            orders={orders}
            onSelectOrder={onSelectOrder}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
