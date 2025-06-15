
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, CheckCircle, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ReportStatsProps {
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
  avgOrderValue: number;
}

export const ReportStats = ({ totalOrders, totalRevenue, completedOrders, avgOrderValue }: ReportStatsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
        <Package className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalOrders}</div>
        <p className="text-xs text-muted-foreground">Todos os períodos</p>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatCurrency(totalRevenue)}
        </div>
        <p className="text-xs text-muted-foreground">Todos os períodos</p>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Pedidos Concluídos</CardTitle>
        <CheckCircle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{completedOrders}</div>
        <p className="text-xs text-muted-foreground">
          Taxa: {totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}% de conclusão
        </p>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatCurrency(avgOrderValue)}
        </div>
        <p className="text-xs text-muted-foreground">Por pedido</p>
      </CardContent>
    </Card>
  </div>
);
