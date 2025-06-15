
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FinanceCharts from "./finance/FinanceCharts";
import FinanceStats from "./finance/FinanceStats";
import { Order } from "@/hooks/admin/use-orders-data";
import { subDays } from 'date-fns';
import { ReportHeader } from "./reports/ReportHeader";
import { usePDF } from "react-to-pdf";
import { useToast } from "@/hooks/use-toast";
import { downloadCSV } from "@/lib/utils";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AdminFinanceProps {
  orders: Order[];
}

const AdminFinance = ({ orders }: AdminFinanceProps) => {
  const [period, setPeriod] = useState('month');
  const { toPDF, targetRef } = usePDF({ filename: 'relatorio_financeiro.pdf' });
  const { toast } = useToast();

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
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-2xl font-bold">Análise Financeira</h2>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
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

      <div ref={targetRef} className="space-y-6 bg-background p-4 rounded-lg">
        <div className="hidden print:block mb-4 text-center">
            <h1 className="text-3xl font-bold">Relatório Financeiro - O Cantinho do Zé</h1>
            <p className="text-sm text-muted-foreground">Gerado em: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
            <p className="text-sm text-muted-foreground">Período: {period}</p>
        </div>

        <FinanceStats {...financialStats} />

        <FinanceCharts 
          orders={filteredOrders}
        />
      </div>
    </div>
  );
};

export default AdminFinance;

