
import { useState, useEffect, useMemo } from "react";
import { Order } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { exportToPDF, generateFinancialReport } from "@/utils/pdfExports";
import { Loader2, Download, FileText } from "lucide-react";
import FinanceStats from "./finance/FinanceStats";
import FinanceCharts from "./finance/FinanceCharts";
import TransactionsTable from "./finance/TransactionsTable";

type AdminFinanceProps = {
  orders: Order[];
};

const AdminFinance = ({ orders: initialOrders }: AdminFinanceProps) => {
  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">("month");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchOrders();
  }, [period]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply period filter
      const now = new Date();
      if (period === "day") {
        const today = now.toISOString().split('T')[0];
        query = query.gte('created_at', `${today}T00:00:00`).lte('created_at', `${today}T23:59:59`);
      } else if (period === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('created_at', weekAgo.toISOString());
      } else if (period === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        query = query.gte('created_at', monthAgo.toISOString());
      } else if (period === "year") {
        const yearAgo = new Date();
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        query = query.gte('created_at', yearAgo.toISOString());
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setOrders(data || initialOrders);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      toast({
        title: "Erro ao carregar dados financeiros",
        description: "Utilizando dados locais.",
        variant: "destructive"
      });
      setOrders(initialOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const success = await exportToPDF('financial-report-content', `relatorio-financeiro-${period}`);
      if (success) {
        toast({
          title: "Relatório exportado",
          description: "O relatório financeiro foi exportado com sucesso!",
        });
      } else {
        throw new Error("Falha na exportação");
      }
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o relatório.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleGenerateDetailedReport = () => {
    setExporting(true);
    try {
      generateFinancialReport(orders, period);
      toast({
        title: "Relatório gerado",
        description: "O relatório detalhado foi gerado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro na geração",
        description: "Não foi possível gerar o relatório.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };
  
  const totalRevenue = useMemo(() => {
    return orders
      .filter(order => {
        const status = order.status || order.paymentStatus;
        const paymentStatus = order.payment_status || order.paymentStatus;
        return status !== "cancelled" && paymentStatus === "completed";
      })
      .reduce((total, order) => {
        const orderTotal = typeof order.total === 'number' ? order.total : 
                          typeof order.total === 'string' ? parseFloat(order.total) : 0;
        return total + orderTotal;
      }, 0);
  }, [orders]);
  
  const pendingRevenue = useMemo(() => {
    return orders
      .filter(order => {
        const status = order.status || order.paymentStatus;
        const paymentStatus = order.payment_status || order.paymentStatus;
        return status !== "cancelled" && 
              paymentStatus === "pending" && 
              status !== "completed";
      })
      .reduce((total, order) => {
        const orderTotal = typeof order.total === 'number' ? order.total : 
                          typeof order.total === 'string' ? parseFloat(order.total) : 0;
        return total + orderTotal;
      }, 0);
  }, [orders]);
  
  const completedOrders = useMemo(() => {
    return orders.filter(order => order.status === "completed").length;
  }, [orders]);
  
  const totalOrders = useMemo(() => {
    return orders.filter(order => order.status !== "cancelled").length;
  }, [orders]);
  
  const averageOrderValue = useMemo(() => {
    if (totalOrders === 0) return 0;
    return totalRevenue / totalOrders;
  }, [totalRevenue, totalOrders]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Carregando dados financeiros...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export buttons */}
      <div className="flex justify-end gap-2 mb-4">
        <Button 
          onClick={handleExportPDF} 
          disabled={exporting}
          variant="outline"
          size="sm"
        >
          {exporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
          Exportar Visualização
        </Button>
        <Button 
          onClick={handleGenerateDetailedReport} 
          disabled={exporting}
          size="sm"
        >
          {exporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
          Relatório Detalhado
        </Button>
      </div>

      <div id="financial-report-content">
        {/* Header for PDF */}
        <div className="mb-6 text-center print:block hidden">
          <h1 className="text-2xl font-bold">Relatório Financeiro</h1>
          <p className="text-gray-600">Período: {period} | Gerado em: {new Date().toLocaleString('pt-AO')}</p>
        </div>

        <FinanceStats
          totalRevenue={totalRevenue}
          pendingRevenue={pendingRevenue}
          completedOrders={completedOrders}
          totalOrders={totalOrders}
          averageOrderValue={averageOrderValue}
        />
        
        <FinanceCharts
          orders={orders}
          period={period}
          onPeriodChange={setPeriod}
        />
        
        <TransactionsTable orders={orders} />
      </div>
    </div>
  );
};

export default AdminFinance;
