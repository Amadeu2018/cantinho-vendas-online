
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
import PromotionsManager from "./promotions/PromotionsManager";
import DeliverySettingsManager from "./delivery/DeliverySettingsManager";
import ImageUploadManager from "./image-upload/ImageUploadManager";
import SecurityLogsManager from "./security/SecurityLogsManager";
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
            onTabChange={onTabChange}
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
      case "promotions":
        return <PromotionsManager />;
      case "delivery-settings":
        return <DeliverySettingsManager />;
      case "image-manager":
        return <ImageUploadManager />;
      case "security-logs":
        return <SecurityLogsManager />;
      default:
        return (
          <DashboardContent 
            orders={orders}
            onSelectOrder={onSelectOrder}
            onTabChange={onTabChange}
          />
        );
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6 w-full max-w-full overflow-hidden">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6 w-full">
        <div className="w-full overflow-hidden">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
