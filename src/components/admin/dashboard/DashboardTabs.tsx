
import React from "react";
import { Card } from "@/components/ui/card";
import AdminOrdersList from "@/components/admin/AdminOrdersList";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminFinance from "@/components/admin/AdminFinance";
import AdminInventory from "@/components/admin/AdminInventory";
import AdminReports from "@/components/admin/AdminReports";
import AdminCustomers from "../AdminCustomers";
import { Order } from "@/hooks/admin/use-orders-data";

interface DashboardTabsProps {
  activeTab: string;
  orders: Order[];
  fetchingOrders: boolean;
  onSelectOrder: (orderId: string) => void;
  children: React.ReactNode;
}

const DashboardTabs = ({ 
  activeTab, 
  orders, 
  fetchingOrders, 
  onSelectOrder,
  children 
}: DashboardTabsProps) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return children;
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
      default:
        return children;
    }
  };

  return (
    <Card className="overflow-hidden shadow-2xl border-0">
      <div className="p-8 bg-gradient-to-br from-gray-50/50 to-white min-h-[400px]">
        {renderTabContent()}
      </div>
    </Card>
  );
};

export default DashboardTabs;
