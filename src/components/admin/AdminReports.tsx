
import { useState } from "react";
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
import { CalendarIcon, Download, CircleDollarSign, ShoppingBag } from "lucide-react";
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

type AdminReportsProps = {
  orders: Order[];
};

const COLORS = ["#3D405B", "#E07A5F", "#81B29A", "#F2CC8F", "#457B9D", "#E63946"];

// Mock inventory data for reports
const inventoryData = [
  { id: 1, name: "Bacalhau", category: "Peixe", incoming: 50, outgoing: 25, current: 25 },
  { id: 2, name: "Azeite", category: "Óleo", incoming: 60, outgoing: 20, current: 40 },
  { id: 3, name: "Batata", category: "Legumes", incoming: 100, outgoing: 50, current: 50 },
  { id: 4, name: "Chouriço", category: "Charcutaria", incoming: 30, outgoing: 15, current: 15 },
  { id: 5, name: "Vinho Tinto", category: "Bebidas", incoming: 50, outgoing: 20, current: 30 }
];

const AdminReports = ({ orders }: AdminReportsProps) => {
  const [reportType, setReportType] = useState<"sales" | "inventory">("sales");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "custom">("month");
  const [fromDate, setFromDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [toDate, setToDate] = useState<Date>(new Date());
  const { toPDF, targetRef } = usePDF({
    filename: `${reportType}-report-${format(new Date(), "yyyy-MM-dd")}.pdf`,
  });
  
  // Filter orders by date range
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    
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
    .filter(order => order.status !== "cancelled")
    .reduce((total, order) => total + order.total, 0);
  
  const completedSales = filteredOrders
    .filter(order => order.status === "completed" && order.paymentStatus === "completed")
    .reduce((total, order) => total + order.total, 0);
  
  const pendingSales = filteredOrders
    .filter(order => order.status !== "cancelled" && order.status !== "completed")
    .reduce((total, order) => total + order.total, 0);
  
  // Generate data for sales by category chart
  const generateSalesByCategory = () => {
    const categories: Record<string, number> = {};
    
    filteredOrders
      .filter(order => order.status !== "cancelled")
      .forEach(order => {
        order.items.forEach(item => {
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
      .filter(order => order.status !== "cancelled")
      .forEach(order => {
        const date = new Date(order.createdAt);
        let key = format(date, "dd/MM");
        
        if (!salesByDay[key]) {
          salesByDay[key] = 0;
        }
        salesByDay[key] += order.total;
      });
    
    return Object.entries(salesByDay).map(([name, value]) => ({
      name,
      value
    }));
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
        
        <Button onClick={() => toPDF()} className="flex items-center gap-2">
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
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
                  {filteredOrders
                    .filter(order => order.status !== "cancelled")
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{format(new Date(order.createdAt), "dd/MM/yyyy")}</TableCell>
                        <TableCell>{order.id.slice(4, 12)}</TableCell>
                        <TableCell>{order.customerInfo.name}</TableCell>
                        <TableCell>{order.items.length} itens</TableCell>
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
                        <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                      </TableRow>
                    ))}
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
                      data={inventoryData}
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
                        data={inventoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="current"
                        nameKey="category"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {inventoryData.map((entry, index) => (
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">{item.incoming}</TableCell>
                      <TableCell className="text-right">{item.outgoing}</TableCell>
                      <TableCell className="text-right">
                        <span className={item.current < 10 ? "text-red-500 font-bold" : ""}>
                          {item.current}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
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
