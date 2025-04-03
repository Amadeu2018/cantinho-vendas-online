
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LowStockAlertsProps {
  inventory: any[];
}

const LowStockAlerts = ({ inventory }: LowStockAlertsProps) => {
  const lowStockItems = inventory.filter(item => item.stock_quantity <= item.min_stock_quantity);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas de Estoque</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockItems.length > 0 ? (
            lowStockItems.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-md">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.category_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-red-600 font-bold">{item.stock_quantity} {item.unit}</p>
                  <p className="text-sm text-gray-500">Alerta: {item.min_stock_quantity}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-green-600">
              Nenhum item com estoque baixo
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LowStockAlerts;
