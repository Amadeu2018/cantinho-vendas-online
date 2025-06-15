
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/hooks/admin/use-orders-data";

interface AdminReportsProps {
  orders: Order[];
}

const AdminReports = ({ orders }: AdminReportsProps) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatórios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold">Total de Pedidos</h3>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold">Receita Total</h3>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-AO", {
                style: "currency",
                currency: "AOA",
              }).format(totalRevenue)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminReports;
