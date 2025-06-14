
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  onTabChange?: (tab: string) => void;
  orders: Order[];
  fetchingOrders: boolean;
  onSelectOrder: (orderId: string) => void;
  children: React.ReactNode;
}

const DashboardTabs = ({ 
  activeTab, 
  onTabChange, 
  orders, 
  fetchingOrders, 
  onSelectOrder,
  children 
}: DashboardTabsProps) => {
  const tabs = [
    { value: "dashboard", label: "Dashboard" },
    { value: "orders", label: "Pedidos" },
    { value: "products", label: "Produtos" },
    { value: "customers", label: "Clientes" },
    { value: "finance", label: "Finanças" },
    { value: "inventory", label: "Estoque" },
    { value: "reports", label: "Relatórios" }
  ];

  // Convert orders to CartOrder format for components that need it
  const cartOrders = orders.map(order => ({
    ...order,
    notes: order.notes || "",
    paymentMethod: {
      id: order.paymentMethod?.id || 'default-id',
      name: order.paymentMethod?.name || 'Método de pagamento',
      icon: order.paymentMethod?.icon || 'credit-card'
    }
  }));

  return (
    <Card className="overflow-hidden shadow-2xl border-0">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <div className="bg-gradient-to-r from-cantinho-cream/30 to-white border-b-2 border-gray-100">
          <TabsList className="bg-transparent h-16 w-full justify-start rounded-none pl-6 pt-2">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:border-b-3 data-[state=active]:border-cantinho-terracotta data-[state=active]:text-cantinho-terracotta rounded-none bg-transparent h-12 px-6 font-semibold transition-all duration-300 hover:bg-gray-50"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <div className="p-8 bg-gradient-to-br from-gray-50/50 to-white min-h-[400px]">
          <TabsContent value="dashboard" className="m-0 focus:outline-none">
            {children}
          </TabsContent>
          
          <TabsContent value="orders" className="m-0 focus:outline-none">
            <AdminOrdersList 
              orders={cartOrders} 
              onSelectOrder={onSelectOrder}
              fetchingOrders={fetchingOrders}
            />
          </TabsContent>
          
          <TabsContent value="products" className="m-0 focus:outline-none">
            <AdminProducts />
          </TabsContent>

          <TabsContent value="customers" className="m-0 focus:outline-none">
            <AdminCustomers />
          </TabsContent>
          
          <TabsContent value="finance" className="m-0 focus:outline-none">
            <AdminFinance orders={cartOrders} />
          </TabsContent>
          
          <TabsContent value="inventory" className="m-0 focus:outline-none">
            <AdminInventory />
          </TabsContent>
          
          <TabsContent value="reports" className="m-0 focus:outline-none">
            <AdminReports />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};

export default DashboardTabs;
