
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order } from "@/hooks/admin/use-orders-data";
import FinanceStats from "./finance/FinanceStats";
import TransactionsTable from "./finance/TransactionsTable";
import FinanceCharts from "./finance/FinanceCharts";

interface AdminFinanceProps {
  orders: Order[];
}

const AdminFinance = ({ orders }: AdminFinanceProps) => {
  const totalRevenue = orders
    .filter(order => order.paymentStatus === "completed")
    .reduce((sum, order) => sum + order.total, 0);
    
  const pendingRevenue = orders
    .filter(order => order.paymentStatus === "pending")
    .reduce((sum, order) => sum + order.total, 0);
    
  const completedOrders = orders.filter(order => order.status === "completed").length;
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestão Financeira</h2>
      </div>

      <FinanceStats
        totalRevenue={totalRevenue}
        pendingRevenue={pendingRevenue}
        completedOrders={completedOrders}
        totalOrders={totalOrders}
        averageOrderValue={averageOrderValue}
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Receita Total:</span>
                    <span className="font-bold">
                      {new Intl.NumberFormat("pt-AO", {
                        style: "currency", 
                        currency: "AOA"
                      }).format(totalRevenue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pedidos Concluídos:</span>
                    <span className="font-bold">{completedOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de Conversão:</span>
                    <span className="font-bold">
                      {totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Dinheiro:</span>
                    <span>40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transferência:</span>
                    <span>35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Multicaixa:</span>
                    <span>25%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions">
          <TransactionsTable orders={orders} />
        </TabsContent>
        
        <TabsContent value="charts">
          <FinanceCharts orders={orders} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFinance;
