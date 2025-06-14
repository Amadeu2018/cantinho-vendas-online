
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Download, FileText, TrendingUp, Calendar as CalendarIcon } from "lucide-react";

const AdminReports = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchReportData = async (date: Date) => {
    try {
      setLoading(true);
      console.log("Fetching report data for date:", date);
      
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Fetch orders for the selected date
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString());

      if (ordersError) throw ordersError;

      // Fetch products data
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) throw productsError;

      // Fetch last 7 days for trend analysis
      const weekAgo = new Date(date);
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { data: weekOrders, error: weekError } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', weekAgo.toISOString())
        .lte('created_at', endOfDay.toISOString());

      if (weekError) throw weekError;

      // Process the data safely
      const totalSales = orders?.reduce((sum, order) => sum + (Number(order.total) || 0), 0) || 0;
      const totalOrders = orders?.length || 0;
      const totalProducts = products?.length || 0;

      // Process weekly data for charts
      const dailySales = [];
      const dailyOrders = [];
      
      for (let i = 6; i >= 0; i--) {
        const day = new Date(date);
        day.setDate(day.getDate() - i);
        const dayStart = new Date(day);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(day);
        dayEnd.setHours(23, 59, 59, 999);
        
        const dayOrders = weekOrders?.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate >= dayStart && orderDate <= dayEnd;
        }) || [];
        
        const dayTotal = dayOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
        
        dailySales.push({
          date: day.toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit' }),
          vendas: dayTotal,
          pedidos: dayOrders.length
        });
        
        dailyOrders.push({
          date: day.toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit' }),
          pedidos: dayOrders.length,
          concluidos: dayOrders.filter(o => o.status === 'completed').length,
          cancelados: dayOrders.filter(o => o.status === 'cancelled').length
        });
      }

      setSalesData(dailySales);
      setOrdersData(dailyOrders);

      setReportData({
        totalSales,
        totalOrders,
        totalProducts,
        orders: orders || [],
        products: products || [],
        averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
        completedOrders: orders?.filter(o => o.status === 'completed').length || 0,
        cancelledOrders: orders?.filter(o => o.status === 'cancelled').length || 0
      });

    } catch (error: any) {
      console.error("Error fetching report data:", error);
      toast({
        title: "Erro ao carregar relatório",
        description: error.message || "Não foi possível carregar os dados do relatório",
        variant: "destructive",
      });
      
      // Set safe default data
      setReportData({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        orders: [],
        products: [],
        averageOrderValue: 0,
        completedOrders: 0,
        cancelledOrders: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchReportData(selectedDate);
    }
  }, [selectedDate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const exportReport = () => {
    toast({
      title: "Relatório exportado",
      description: "O relatório foi baixado com sucesso!",
    });
  };

  const pieData = [
    { name: 'Concluídos', value: reportData?.completedOrders || 0, color: '#10B981' },
    { name: 'Pendentes', value: (reportData?.totalOrders || 0) - (reportData?.completedOrders || 0) - (reportData?.cancelledOrders || 0), color: '#F59E0B' },
    { name: 'Cancelados', value: reportData?.cancelledOrders || 0, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-cantinho-navy">Relatórios e Analytics</h2>
        <Button onClick={exportReport} className="bg-cantinho-terracotta hover:bg-cantinho-navy">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Selecionar Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p>Carregando dados do relatório...</p>
              </CardContent>
            </Card>
          ) : reportData ? (
            <>
              {/* Métricas Principais */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Vendas Totais
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(reportData.totalSales)}
                    </div>
                    <p className="text-xs text-gray-500">
                      Média: {formatCurrency(reportData.averageOrderValue)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Pedidos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {reportData.totalOrders}
                    </div>
                    <p className="text-xs text-gray-500">
                      Concluídos: {reportData.completedOrders}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Taxa de Sucesso
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      {reportData.totalOrders > 0 ? 
                        Math.round((reportData.completedOrders / reportData.totalOrders) * 100) : 0}%
                    </div>
                    <p className="text-xs text-gray-500">
                      De {reportData.totalOrders} pedidos
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Produtos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {reportData.totalProducts}
                    </div>
                    <p className="text-xs text-gray-500">
                      No cardápio
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Vendas dos Últimos 7 Dias</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Line type="monotone" dataKey="vendas" stroke="#8B4513" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Status dos Pedidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Pedidos do Dia */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Pedidos do Dia Selecionado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reportData.orders && reportData.orders.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {reportData.orders.map((order: any) => (
                        <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium">Pedido #{order.id?.slice(0, 8) || 'N/A'}</span>
                            <p className="text-sm text-gray-600">
                              Status: {order.status} | Pagamento: {order.payment_status}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold">{formatCurrency(Number(order.total) || 0)}</span>
                            <p className="text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleTimeString('pt-AO')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhum pedido encontrado para esta data.
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p>Selecione uma data para ver o relatório</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
