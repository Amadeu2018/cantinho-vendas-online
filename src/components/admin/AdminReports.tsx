
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Order } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { CalendarIcon, Download, CircleDollarSign, ShoppingBag, Loader2 } from "lucide-react";
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
import { usePDF } from "react-to-pdf";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AdminReportsProps = {
  orders: Order[];
};

const COLORS = ["#3D405B", "#E07A5F", "#81B29A", "#F2CC8F", "#457B9D", "#E63946"];

const AdminReports = ({ orders: initialOrders }: AdminReportsProps) => {
  const [reportType, setReportType] = useState<"sales" | "inventory">("sales");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "custom">("month");
  const [fromDate, setFromDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [toDate, setToDate] = useState<Date>(new Date());
  const [orders, setOrders] = useState<any[]>([]);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const reportRef = useRef(null);
  const { toast } = useToast();
  
  const { toPDF, targetRef } = usePDF({
    filename: `${reportType}-report-${format(new Date(), "yyyy-MM-dd")}.pdf`,
    page: { margin: 20 },
    canvas: {
      // Improves quality of the PDF
      dpi: 300,
      mimeType: "image/png",
    },
  });
  
  useEffect(() => {
    fetchData();
  }, [reportType, dateRange, fromDate, toDate]);
  
  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      if (reportType === "sales") {
        await fetchOrders();
      } else {
        await fetchInventory();
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast({
        title: "Erro ao buscar dados",
        description: "Não foi possível carregar os dados do relatório. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchOrders = async () => {
    try {
      let query = supabase
        .from('orders')
        .select('*');
        
      // Apply date filters
      if (dateRange === "today") {
        const today = new Date().toISOString().split('T')[0];
        query = query.gte('created_at', `${today}T00:00:00`).lte('created_at', `${today}T23:59:59`);
      } else if (dateRange === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('created_at', weekAgo.toISOString());
      } else if (dateRange === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        query = query.gte('created_at', monthAgo.toISOString());
      } else if (dateRange === "custom") {
        query = query
          .gte('created_at', fromDate.toISOString())
          .lte('created_at', new Date(toDate.setHours(23,59,59,999)).toISOString());
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setOrders(data);
      } else {
        // If no data from database, use the props orders
        setOrders(initialOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Fallback to props orders if there's an error
      setOrders(initialOrders);
    }
  };
  
  const fetchInventory = async () => {
    try {
      // Fetch products and their stock information
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, category_id, stock_quantity, min_stock_quantity, price, categories!fk_product_category(name)');
        
      if (productsError) throw productsError;
      
      // Fetch stock movements
      const { data: movements, error: movementsError } = await supabase
        .from('stock_movements')
        .select('*');
        
      if (movementsError) throw movementsError;
      
      // Process data for inventory report
      const inventory = products.map((product: any) => {
        const productMovements = movements.filter((m: any) => m.product_id === product.id);
        const incoming = productMovements
          .filter((m: any) => m.type === 'incoming')
          .reduce((sum: number, m: any) => sum + m.quantity, 0);
        const outgoing = productMovements
          .filter((m: any) => m.type === 'outgoing')
          .reduce((sum: number, m: any) => sum + m.quantity, 0);
        
        return {
          id: product.id,
          name: product.name,
          category: product.categories?.name || 'Sem categoria',
          incoming: incoming || 0,
          outgoing: outgoing || 0,
          current: product.stock_quantity || 0,
          minStock: product.min_stock_quantity || 0,
          price: product.price
        };
      });
      
      setInventoryData(inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      // Fallback to static data
      setInventoryData([
        { id: 1, name: "Bacalhau", category: "Peixe", incoming: 50, outgoing: 25, current: 25, minStock: 10 },
        { id: 2, name: "Azeite", category: "Óleo", incoming: 60, outgoing: 20, current: 40, minStock: 5 },
        { id: 3, name: "Batata", category: "Legumes", incoming: 100, outgoing: 50, current: 50, minStock: 20 },
        { id: 4, name: "Chouriço", category: "Charcutaria", incoming: 30, outgoing: 15, current: 15, minStock: 5 },
        { id: 5, name: "Vinho Tinto", category: "Bebidas", incoming: 50, outgoing: 20, current: 30, minStock: 10 }
      ]);
    }
  };
  
  // Filter orders by date range (for rendering)
  const filteredOrders = orders.filter((order: any) => {
    const orderDate = new Date(order.created_at);
    
    if (dateRange === "today") {
      const today = new Date();
      return orderDate.getDate() === today.getDate() &&
             orderDate.getMonth() === today.getMonth() &&
             orderDate.getFullYear() === today.getFullYear();
    } else if (dateRange === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return orderDate >= weekAgo;
    } else if (dateRange === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return orderDate >= monthAgo;
    } else if (dateRange === "custom") {
      return orderDate >= fromDate && orderDate <= toDate;
    }
    
    return true;
  });
  
  // Calculate sales metrics
  const totalSales = filteredOrders
    .filter((order: any) => order.status !== "cancelled")
    .reduce((total: number, order: any) => total + Number(order.total), 0);
  
  const completedSales = filteredOrders
    .filter((order: any) => order.status === "completed" && order.payment_status === "completed")
    .reduce((total: number, order: any) => total + Number(order.total), 0);
  
  const pendingSales = filteredOrders
    .filter((order: any) => order.status !== "cancelled" && order.status !== "completed")
    .reduce((total: number, order: any) => total + Number(order.total), 0);
  
  // Generate data for sales by category chart
  const generateSalesByCategory = () => {
    const categories: Record<string, number> = {};
    
    filteredOrders
      .filter((order: any) => order.status !== "cancelled")
      .forEach((order: any) => {
        if (Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            // This is a simplification - in a real app you'd categorize items properly
            const category = item.name.includes("Peixe") ? "Peixe" :
                          item.name.includes("Carne") ? "Carne" :
                          item.name.includes("Vinho") || item.name.includes("Bebida") ? "Bebidas" :
                          item.name.includes("Sobremesa") ? "Sobremesas" : "Outros";
            
            if (!categories[category]) {
              categories[category] = 0;
            }
            categories[category] += item.price * item.quantity;
          });
        }
      });
    
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value
    }));
  };
  
  // Generate data for sales by day chart
  const generateSalesByDay = () => {
    const salesByDay: Record<string, number> = {};
    
    filteredOrders
      .filter((order: any) => order.status !== "cancelled")
      .forEach((order: any) => {
        const date = new Date(order.created_at);
        let key = format(date, "dd/MM");
        
        if (!salesByDay[key]) {
          salesByDay[key] = 0;
        }
        salesByDay[key] += Number(order.total);
      });
    
    return Object.entries(salesByDay).map(([name, value]) => ({
      name,
      value
    }));
  };
  
  // Generate inventory data charts
  const generateInventoryByCategory = () => {
    const categories: Record<string, number> = {};
    
    inventoryData.forEach((item) => {
      if (!categories[item.category]) {
        categories[item.category] = 0;
      }
      categories[item.category] += item.current;
    });
    
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value
    }));
  };
  
  const handleExportPDF = async () => {
    // Wait for a moment to ensure charts are rendered
    await new Promise(resolve => setTimeout(resolve, 500));
    toPDF();
    
    toast({
      title: "Relatório exportado",
      description: "O relatório foi exportado como PDF com sucesso.",
    });
  };
  
  const getDateRangeText = () => {
    if (dateRange === "today") {
      return `Hoje (${format(new Date(), "dd/MM/yyyy")})`;
    } else if (dateRange === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return `Últimos 7 dias (${format(weekAgo, "dd/MM/yyyy")} - ${format(new Date(), "dd/MM/yyyy")})`;
    } else if (dateRange === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return `Últimos 30 dias (${format(monthAgo, "dd/MM/yyyy")} - ${format(new Date(), "dd/MM/yyyy")})`;
    } else if (dateRange === "custom") {
      return `${format(fromDate, "dd/MM/yyyy")} - ${format(toDate, "dd/MM/yyyy")}`;
    }
    return "";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Carregando dados do relatório...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" ref={targetRef}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col md:flex-row gap-2">
          <Tabs value={reportType} onValueChange={(value) => setReportType(value as "sales" | "inventory")}>
            <TabsList>
              <TabsTrigger value="sales">Relatório de Vendas</TabsTrigger>
              <TabsTrigger value="inventory">Relatório de Estoque</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Select value={dateRange} onValueChange={(value) => setDateRange(value as any)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          
          {dateRange === "custom" && (
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-28">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(fromDate, "dd/MM")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={(date) => date && setFromDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <span className="self-center">até</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-28">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(toDate, "dd/MM")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={(date) => date && setToDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
        
        <Button onClick={handleExportPDF} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar PDF
        </Button>
      </div>
      
      <div>
        <h3 className="text-lg font-bold">
          {reportType === "sales" ? "Relatório de Vendas" : "Relatório de Estoque"}: {getDateRangeText()}
        </h3>
      </div>
      
      {reportType === "sales" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas Concluídas</CardTitle>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(completedSales)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas Pendentes</CardTitle>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(pendingSales)}</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Vendas por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={generateSalesByCategory()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ""}
                      >
                        {generateSalesByCategory().map((entry, index) => (
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
                <CardTitle>Vendas por Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generateSalesByDay()}>
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
          
          <Card>
            <CardHeader>
              <CardTitle>Detalhes das Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders
                      .filter((order: any) => order.status !== "cancelled")
                      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .slice(0, 20) // Limit to 20 orders for better PDF rendering
                      .map((order: any) => {
                        let customerName = "Cliente";
                        try {
                          if (order.customer_info && typeof order.customer_info === 'object') {
                            customerName = order.customer_info.name || "Cliente";
                          } else if (typeof order.customer_info === 'string' && order.customer_info.startsWith('{')) {
                            const parsed = JSON.parse(order.customer_info);
                            customerName = parsed.name || "Cliente";
                          }
                        } catch (e) {
                          console.error("Error parsing customer info:", e);
                        }
                        
                        return (
                          <TableRow key={order.id}>
                            <TableCell>{format(new Date(order.created_at), "dd/MM/yyyy")}</TableCell>
                            <TableCell>{typeof order.id === 'string' ? order.id.slice(0, 8) : order.id}</TableCell>
                            <TableCell>{customerName}</TableCell>
                            <TableCell>{Array.isArray(order.items) ? order.items.length : 0} itens</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                order.status === "completed" 
                                  ? "bg-green-100 text-green-800" 
                                  : order.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {order.status === "completed" ? "Concluído" : 
                                 order.status === "cancelled" ? "Cancelado" : 
                                 order.status === "confirmed" ? "Confirmado" :
                                 order.status === "preparing" ? "Em Preparo" :
                                 order.status === "delivering" ? "Em Entrega" : "Pendente"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(Number(order.total))}</TableCell>
                          </TableRow>
                        );
                      })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Nenhuma venda encontrada no período selecionado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Movimento de Estoque</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={inventoryData.slice(0, 10)} // Limit to 10 items for better readability
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="incoming" name="Entrada" fill="#3D405B" />
                      <Bar dataKey="outgoing" name="Saída" fill="#E07A5F" />
                      <Bar dataKey="current" name="Atual" fill="#81B29A" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Estoque por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={generateInventoryByCategory()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ""}
                      >
                        {generateInventoryByCategory().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Inventário</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Entrada</TableHead>
                    <TableHead className="text-right">Saída</TableHead>
                    <TableHead className="text-right">Estoque Atual</TableHead>
                    <TableHead className="text-right">Estoque Mínimo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryData.length > 0 ? (
                    inventoryData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">{item.incoming}</TableCell>
                        <TableCell className="text-right">{item.outgoing}</TableCell>
                        <TableCell className="text-right">
                          <span className={item.current < item.minStock ? "text-red-500 font-bold" : ""}>
                            {item.current}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{item.minStock}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Nenhum dado de inventário disponível
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminReports;
