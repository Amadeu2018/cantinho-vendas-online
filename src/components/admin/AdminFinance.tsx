
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FinanceCharts from "./finance/FinanceCharts";
import FinanceStats from "./finance/FinanceStats";
import TransactionsTable from "./finance/TransactionsTable";
import { Order } from "@/hooks/admin/use-orders-data";
import { subDays } from 'date-fns';
import { ReportHeader } from "./reports/ReportHeader";
import { usePDF } from "react-to-pdf";
import { useToast } from "@/hooks/use-toast";
import { downloadCSV } from "@/lib/utils";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useIsMobile, useIsMobileOrTablet } from "@/hooks/use-mobile";
import { Wallet, TrendingUp, BarChart3, Receipt } from "lucide-react";

interface AdminFinanceProps {
  orders: Order[];
}

const AdminFinance = ({ orders }: AdminFinanceProps) => {
  const [period, setPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  const { toPDF, targetRef } = usePDF({ filename: 'relatorio_financeiro.pdf' });
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const isMobileOrTablet = useIsMobileOrTablet();

  const filteredOrders = useMemo(() => {
    const now = new Date();
    let daysToSubtract;

    switch (period) {
      case 'week':
        daysToSubtract = 7;
        break;
      case 'year':
        daysToSubtract = 365;
        break;
      case 'month':
      default:
        daysToSubtract = 30;
        break;
    }

    const startDate = subDays(now, daysToSubtract);
    return orders.filter(order => new Date(order.createdAt) >= startDate);
  }, [orders, period]);

  const financialStats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
    const completedOrdersData = filteredOrders.filter(order => order.status === 'completed');
    const completedOrders = completedOrdersData.length;
    const pendingRevenue = filteredOrders
      .filter(order => ['pending', 'confirmed', 'preparing', 'delivering'].includes(order.status))
      .reduce((sum, order) => sum + (Number(order.total) || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    return { totalOrders, totalRevenue, completedOrders, pendingRevenue, averageOrderValue };
  }, [filteredOrders]);

  const handleExportPDF = () => {
    toast({
      title: "A gerar PDF...",
      description: "O seu relatório financeiro está a ser preparado.",
    });
    toPDF();
  };

  const handleExportCSV = () => {
    const dataToExport = [{
      'Período': period,
      'Receita Total': financialStats.totalRevenue.toFixed(2),
      'Receita Pendente': financialStats.pendingRevenue.toFixed(2),
      'Pedidos Totais': financialStats.totalOrders,
      'Pedidos Completos': financialStats.completedOrders,
      'Valor Médio por Pedido': financialStats.averageOrderValue.toFixed(2)
    }];
    
    downloadCSV(dataToExport, `relatorio_financeiro_${period}`, toast);
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      {/* Header Mobile-Optimized */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-cantinho-terracotta" />
              Finanças
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Análise financeira e relatórios detalhados
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Semana</SelectItem>
                <SelectItem value="month">Mês</SelectItem>
                <SelectItem value="year">Ano</SelectItem>
              </SelectContent>
            </Select>
            <ReportHeader title="" onExportPDF={handleExportPDF} onExportCSV={handleExportCSV} />
          </div>
        </div>
      </div>

      <div ref={targetRef} className="space-y-4 sm:space-y-6 bg-background rounded-lg">
        <div className="hidden print:block mb-4 text-center">
          <h1 className="text-3xl font-bold">Relatório Financeiro - O Cantinho do Zé</h1>
          <p className="text-sm text-muted-foreground">Gerado em: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
          <p className="text-sm text-muted-foreground">Período: {period}</p>
        </div>

        {/* Stats Cards */}
        <FinanceStats {...financialStats} />

        {/* Mobile Tabs */}
        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className={`w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-3'} bg-muted p-1`}>
            <TabsTrigger value="overview" className="flex items-center gap-2 text-xs sm:text-sm">
              <TrendingUp className="h-4 w-4" />
              {isMobile ? "Visão" : "Visão Geral"}
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center gap-2 text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4" />
              {isMobile ? "Gráficos" : "Gráficos"}
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2 text-xs sm:text-sm">
              <Receipt className="h-4 w-4" />
              {isMobile ? "Histórico" : "Transações"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800">Receita Confirmada</h4>
                      <p className="text-2xl font-bold text-green-900">
                        {new Intl.NumberFormat('pt-AO', {
                          style: 'currency',
                          currency: 'AOA',
                        }).format(financialStats.totalRevenue - financialStats.pendingRevenue)}
                      </p>
                      <p className="text-sm text-green-600">{financialStats.completedOrders} pedidos completos</p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-medium text-yellow-800">Receita Pendente</h4>
                      <p className="text-2xl font-bold text-yellow-900">
                        {new Intl.NumberFormat('pt-AO', {
                          style: 'currency',
                          currency: 'AOA',
                        }).format(financialStats.pendingRevenue)}
                      </p>
                      <p className="text-sm text-yellow-600">
                        {financialStats.totalOrders - financialStats.completedOrders} pedidos pendentes
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800">Valor Médio por Pedido</h4>
                    <p className="text-xl font-bold text-blue-900">
                      {new Intl.NumberFormat('pt-AO', {
                        style: 'currency',
                        currency: 'AOA',
                      }).format(financialStats.averageOrderValue)}
                    </p>
                    <p className="text-sm text-blue-600">Baseado em {financialStats.totalOrders} pedidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="charts">
            <FinanceCharts orders={filteredOrders} />
          </TabsContent>
          
          <TabsContent value="transactions">
            <TransactionsTable orders={filteredOrders} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminFinance;
