
import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order } from "@/hooks/admin/use-orders-data";
import { format, parseISO, subMonths, isAfter, startOfMonth, subDays, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { usePDF } from 'react-to-pdf';
import { useToast } from "@/hooks/use-toast";
import { downloadCSV } from "@/lib/utils";
import { ReportHeader } from "./reports/ReportHeader";
import { ReportStats } from "./reports/ReportStats";
import { MonthlyReport } from "./reports/MonthlyReport";
import { DailyReport } from "./reports/DailyReport";
import { TopProductsReport } from "./reports/TopProductsReport";

interface AdminReportsProps {
  orders: Order[];
}

const AdminReports = ({ orders }: AdminReportsProps) => {
  const [activeTab, setActiveTab] = useState('monthly');
  const { toPDF, targetRef } = usePDF({ filename: 'relatorio_geral.pdf' });
  const { toast } = useToast();

  const reportData = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const completedOrders = orders.filter(order => order.status === "completed").length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const monthlySummary: { [key: string]: { pedidos: number; receita: number } } = {};
    const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));

    for (let i = 0; i < 6; i++) {
      const month = format(subMonths(new Date(), i), 'yyyy-MM');
      monthlySummary[month] = { pedidos: 0, receita: 0 };
    }

    orders.forEach(order => {
      const orderDate = parseISO(order.createdAt);
      if (isAfter(orderDate, sixMonthsAgo)) {
        const monthKey = format(orderDate, 'yyyy-MM');
        if (monthlySummary[monthKey]) {
          monthlySummary[monthKey].pedidos += 1;
          monthlySummary[monthKey].receita += order.total;
        }
      }
    });
    
    const monthlyData = Object.keys(monthlySummary)
      .sort()
      .map(monthKey => ({
        month: format(parseISO(monthKey + '-02'), 'MMM/yy', { locale: ptBR }),
        pedidos: monthlySummary[monthKey].pedidos,
        receita: monthlySummary[monthKey].receita
      }));

    const dailySummary: { [key: string]: { pedidos: number; receita: number } } = {};
    const sevenDaysAgo = startOfDay(subDays(new Date(), 6));
    
    for (let i = 6; i >= 0; i--) {
      const day = subDays(new Date(), i);
      const dayKey = format(day, 'yyyy-MM-dd');
      dailySummary[dayKey] = { pedidos: 0, receita: 0 };
    }

    orders.forEach(order => {
      const orderDate = parseISO(order.createdAt);
      if (isAfter(orderDate, sevenDaysAgo)) {
        const dayKey = format(orderDate, 'yyyy-MM-dd');
        if (dailySummary[dayKey]) {
          dailySummary[dayKey].pedidos += 1;
          dailySummary[dayKey].receita += order.total;
        }
      }
    });

    const dailyData = Object.keys(dailySummary)
      .sort()
      .map(dayKey => ({
        day: format(parseISO(dayKey), 'EEE', { locale: ptBR }),
        pedidos: dailySummary[dayKey].pedidos,
        receita: dailySummary[dayKey].receita,
      }));

    const productSales: { [name: string]: { vendas: number } } = {};

    orders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          if (!productSales[item.name]) {
            productSales[item.name] = { vendas: 0 };
          }
          productSales[item.name].vendas += item.quantity;
        });
      }
    });

    const topProducts = Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.vendas - a.vendas)
      .slice(0, 5);
      
    return { totalOrders, totalRevenue, completedOrders, avgOrderValue, monthlyData, dailyData, topProducts };
  }, [orders]);

  const { totalOrders, totalRevenue, completedOrders, avgOrderValue, monthlyData, dailyData, topProducts } = reportData;

  const handleExportPDF = () => {
    toast({
      title: "A gerar PDF...",
      description: "O seu relatório está a ser preparado para download.",
    });
    toPDF();
  };

  const handleExportCSV = () => {
    let dataToExport;
    let filename;

    switch (activeTab) {
      case 'monthly':
        dataToExport = monthlyData.map(d => ({
          'Mês/Ano': d.month,
          'Pedidos': d.pedidos,
          'Receita (AOA)': d.receita.toFixed(2),
        }));
        filename = 'relatorio_mensal_pedidos_receita';
        break;
      case 'daily':
        dataToExport = dailyData.map(d => ({
          'Dia': d.day,
          'Pedidos': d.pedidos,
          'Receita (AOA)': d.receita.toFixed(2),
        }));
        filename = 'relatorio_diario_pedidos_receita';
        break;
      case 'products':
        dataToExport = topProducts.map(p => ({
          'Produto': p.name,
          'Vendas (unidades)': p.vendas,
        }));
        filename = 'relatorio_top_produtos';
        break;
      default:
        toast({ title: "Erro", description: "Aba de relatório inválida para exportação.", variant: "destructive" });
        return;
    }

    downloadCSV(dataToExport, filename, toast);
  };

  return (
    <div className="space-y-6">
      <ReportHeader title="Relatórios e Análises" onExportPDF={handleExportPDF} onExportCSV={handleExportCSV} />

      <div ref={targetRef} className="space-y-6 bg-background p-4 rounded-lg">
        <div className="hidden print:block mb-4 text-center">
          <h1 className="text-3xl font-bold">Relatório - O Cantinho do Zé</h1>
          <p className="text-sm text-muted-foreground">Gerado em: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
        </div>

        <ReportStats 
          totalOrders={totalOrders} 
          totalRevenue={totalRevenue} 
          completedOrders={completedOrders} 
          avgOrderValue={avgOrderValue} 
        />

        <Tabs defaultValue="monthly" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="print:hidden">
            <TabsTrigger value="monthly">Últimos 6 Meses</TabsTrigger>
            <TabsTrigger value="daily">Últimos 7 Dias</TabsTrigger>
            <TabsTrigger value="products">Top Produtos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly">
            <MonthlyReport data={monthlyData} />
          </TabsContent>
          
          <TabsContent value="daily">
            <DailyReport data={dailyData} />
          </TabsContent>
          
          <TabsContent value="products">
            <TopProductsReport data={topProducts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminReports;
