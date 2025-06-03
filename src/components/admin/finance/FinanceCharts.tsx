
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#3D405B", "#E07A5F", "#81B29A", "#F2CC8F", "#6C7086", "#D3AB9E"];

interface FinanceChartsProps {
  orders: any[];
  period: string;
  onPeriodChange: (period: "day" | "week" | "month" | "year") => void;
}

const FinanceCharts = ({ orders, period, onPeriodChange }: FinanceChartsProps) => {
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

  return (
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
                onClick={() => onPeriodChange("day")}
                className={period === "day" ? "bg-primary text-primary-foreground" : ""}
              >
                Dia
              </TabsTrigger>
              <TabsTrigger 
                value="week" 
                onClick={() => onPeriodChange("week")}
                className={period === "week" ? "bg-primary text-primary-foreground" : ""}
              >
                Semana
              </TabsTrigger>
              <TabsTrigger 
                value="month" 
                onClick={() => onPeriodChange("month")}
                className={period === "month" ? "bg-primary text-primary-foreground" : ""}
              >
                Mês
              </TabsTrigger>
              <TabsTrigger 
                value="year" 
                onClick={() => onPeriodChange("year")}
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
  );
};

export default FinanceCharts;
