
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSignIcon, ActivityIcon, TrendingUpIcon, CalendarIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface FinanceStatsProps {
  totalRevenue: number;
  pendingRevenue: number;
  completedOrders: number;
  totalOrders: number;
  averageOrderValue: number;
}

const FinanceStats = ({
  totalRevenue,
  pendingRevenue,
  completedOrders,
  totalOrders,
  averageOrderValue
}: FinanceStatsProps) => {
  return (
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
  );
};

export default FinanceStats;
