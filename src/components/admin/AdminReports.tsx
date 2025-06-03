
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminReports = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
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

      // Process the data safely
      const totalSales = orders?.reduce((sum, order) => sum + (Number(order.total) || 0), 0) || 0;
      const totalOrders = orders?.length || 0;
      const totalProducts = products?.length || 0;

      setReportData({
        totalSales,
        totalOrders,
        totalProducts,
        orders: orders || [],
        products: products || []
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
        products: []
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-1/3">
          <CardHeader>
            <CardTitle>Selecionar Data</CardTitle>
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

        <div className="md:w-2/3 space-y-4">
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p>Carregando dados do relatório...</p>
              </CardContent>
            </Card>
          ) : reportData ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Vendas Totais
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(reportData.totalSales)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Pedidos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {reportData.totalOrders}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Produtos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {reportData.totalProducts}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Pedidos do Dia</CardTitle>
                </CardHeader>
                <CardContent>
                  {reportData.orders && reportData.orders.length > 0 ? (
                    <div className="space-y-2">
                      {reportData.orders.map((order: any) => (
                        <div key={order.id} className="flex justify-between items-center p-2 border rounded">
                          <span>Pedido #{order.id?.slice(0, 8) || 'N/A'}</span>
                          <span>{formatCurrency(Number(order.total) || 0)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhum pedido encontrado para esta data.</p>
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
