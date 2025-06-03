import { useState, useEffect, useMemo } from "react";
import { Order } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { CalendarIcon, TrendingUpIcon, CircleDollarSignIcon, ActivityIcon, Loader2, Download, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { exportToPDF, generateFinancialReport } from "@/utils/pdfExports";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type AdminFinanceProps = {
  orders: Order[];
};

const COLORS = ["#3D405B", "#E07A5F", "#81B29A", "#F2CC8F", "#6C7086", "#D3AB9E"];

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
      
      if (data && data.length > 0) {
        setOrders(data);
      } else {
        // If no data from database, use the props orders or fallback
        const filteredOrders = initialOrders.filter(order => {
          const orderDate = new Date(order.createdAt);
          if (period === "day") {
            return orderDate.getDate() === now.getDate() && 
                  orderDate.getMonth() === now.getMonth() && 
                  orderDate.getFullYear() === now.getFullYear();
          } else if (period === "week") {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return orderDate >= weekAgo;
          } else if (period === "month") {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return orderDate >= monthAgo;
          } else if (period === "year") {
            const yearAgo = new Date();
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return orderDate >= yearAgo;
          }
          return true;
        });
        
        setOrders(filteredOrders);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      toast({
        title: "Erro ao carregar dados financeiros",
        description: "Não foi possível buscar os dados do backend. Utilizando dados locais.",
        variant: "destructive"
      });
      // Fallback to props orders
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
        description: "Não foi possível exportar o relatório. Tente novamente.",
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
        description: "Não foi possível gerar o relatório. Tente novamente.",
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
    return orders.filter(order => order.status === "completed" || order.status === "completed").length;
  }, [orders]);
  
  const totalOrders = useMemo(() => {
    return orders.filter(order => order.status !== "cancelled").length;
  }, [orders]);
  
  const averageOrderValue = useMemo(() => {
    if (totalOrders === 0) return 0;
    return totalRevenue / totalOrders;
  }, [totalRevenue, totalOrders]);
  
  // Generate revenue data by payment method
  const paymentMethodData = useMemo(() => {
    const data: Record<string, number> = {};
    
    orders
      .filter(order => {
        const status = order.status || order.paymentStatus;
        const paymentStatus = order.payment_status || order.paymentStatus;
        return status !== "cancelled" && paymentStatus === "completed";
      })
      .forEach(order => {
        let methodName = "Desconhecido";
        try {
          if (order.payment_method && typeof order.payment_method === 'string') {
            methodName = order.payment_method;
          } else if (order.paymentMethod?.name) {
            methodName = order.paymentMethod.name;
          }
        } catch (e) {
          console.error("Error parsing payment method:", e);
        }
        
        if (!data[methodName]) {
          data[methodName] = 0;
        }
        
        const orderTotal = typeof order.total === 'number' ? order.total : 
                          typeof order.total === 'string' ? parseFloat(order.total) : 0;
        data[methodName] += orderTotal;
      });
    
    return Object.entries(data).map(([name, value]) => ({
      name,
      value
    }));
  }, [orders]);
  
  // Generate revenue data by day/week/month
  const revenueData = useMemo(() => {
    const data: Record<string, number> = {};
    const now = new Date();
    
    orders
      .filter(order => {
        const status = order.status || order.paymentStatus;
        const paymentStatus = order.payment_status || order.paymentStatus;
        return status !== "cancelled" && paymentStatus === "completed";
      })
      .forEach(order => {
        const date = new Date(order.created_at || order.createdAt);
        let key = "";
        
        if (period === "day") {
          key = format(date, "HH:00");
        } else if (period === "week") {
          key = format(date, "EEE");
        } else if (period === "month") {
          key = format(date, "dd/MM");
        } else if (period === "year") {
          key = format(date, "MMM");
        }
        
        if (!data[key]) {
          data[key] = 0;
        }
        
        const orderTotal = typeof order.total === 'number' ? order.total : 
                          typeof order.total === 'string' ? parseFloat(order.total) : 0;
        data[key] += orderTotal;
      });
    
    return Object.entries(data).map(([name, value]) => ({
      name,
      value
    }));
  }, [orders, period]);
  
  // Get recent transactions
  const recentTransactions = useMemo(() => {
    return orders
      .filter(order => order.status !== "cancelled")
      .sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt);
        const dateB = new Date(b.created_at || b.createdAt);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 10);
  }, [orders]);

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

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <CircleDollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                +{formatCurrency(pendingRevenue)} pendente
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Completos</CardTitle>
              <ActivityIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders}</div>
              <p className="text-xs text-muted-foreground">
                de {totalOrders} pedidos totais
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(averageOrderValue)}</div>
              <p className="text-xs text-muted-foreground">
                por pedido
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                de pedidos concluídos
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Receita por Método de Pagamento</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ""}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Receita por Período</CardTitle>
                <TabsList>
                  <TabsTrigger 
                    value="day" 
                    onClick={() => setPeriod("day")}
                    className={period === "day" ? "bg-primary text-primary-foreground" : ""}
                  >
                    Dia
                  </TabsTrigger>
                  <TabsTrigger 
                    value="week" 
                    onClick={() => setPeriod("week")}
                    className={period === "week" ? "bg-primary text-primary-foreground" : ""}
                  >
                    Semana
                  </TabsTrigger>
                  <TabsTrigger 
                    value="month" 
                    onClick={() => setPeriod("month")}
                    className={period === "month" ? "bg-primary text-primary-foreground" : ""}
                  >
                    Mês
                  </TabsTrigger>
                  <TabsTrigger 
                    value="year" 
                    onClick={() => setPeriod("year")}
                    className={period === "year" ? "bg-primary text-primary-foreground" : ""}
                  >
                    Ano
                  </TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="value" fill="#3D405B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Transactions table */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Pedido</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((order) => {
                    let customerName = "Cliente";
                    let paymentMethod = "Desconhecido";
                    let paymentStatus = order.payment_status || order.paymentStatus || "pending";
                    const createdAt = order.created_at || order.createdAt;
                    const orderId = typeof order.id === 'string' ? order.id.slice(0, 8) : order.id;
                    
                    try {
                      // Handle customer info
                      if (order.customer_info && typeof order.customer_info === 'string') {
                        try {
                          const info = JSON.parse(order.customer_info);
                          customerName = info.name || "Cliente";
                        } catch (e) {
                          customerName = order.customer_info;
                        }
                      } else if (order.customer_info?.name) {
                        customerName = order.customer_info.name;
                      } else if (order.customerInfo?.name) {
                        customerName = order.customerInfo.name;
                      }
                      
                      // Handle payment method
                      if (order.payment_method && typeof order.payment_method === 'string') {
                        paymentMethod = order.payment_method;
                      } else if (order.payment_method?.name) {
                        paymentMethod = order.payment_method.name;
                      } else if (order.paymentMethod?.name) {
                        paymentMethod = order.paymentMethod.name;
                      }
                    } catch (e) {
                      console.error("Error parsing order data:", e);
                    }
                    
                    const orderTotal = typeof order.total === 'number' ? order.total : 
                                      typeof order.total === 'string' ? parseFloat(order.total) : 0;
                    
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{orderId}</TableCell>
                        <TableCell>{format(new Date(createdAt), "dd/MM/yy HH:mm")}</TableCell>
                        <TableCell>{customerName}</TableCell>
                        <TableCell>{paymentMethod}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            paymentStatus === "completed" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {paymentStatus === "completed" ? "Pago" : "Pendente"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(orderTotal)}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Nenhuma transação disponível
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminFinance;
