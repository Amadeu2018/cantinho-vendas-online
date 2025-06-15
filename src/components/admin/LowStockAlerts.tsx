
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LowStockAlertsProps {
  inventory: any[];
}

const LowStockAlerts = ({ inventory }: LowStockAlertsProps) => {
  const isMobile = useIsMobile();
  const lowStockItems = inventory.filter(item => item.stock_quantity <= item.min_stock_quantity);
  
  if (lowStockItems.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Estoque Normal</p>
              <p className="text-sm text-green-600">Todos os produtos estão com estoque adequado</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-red-800">
          <AlertTriangle className="h-5 w-5" />
          Alertas de Estoque Baixo
          <Badge variant="destructive">{lowStockItems.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className={`space-y-3 ${isMobile ? 'max-h-60 overflow-y-auto' : ''}`}>
          {lowStockItems.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-white border border-red-200 rounded-lg shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-sm text-gray-500">{item.category_name}</p>
              </div>
              <div className="text-right ml-3">
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-red-600 font-bold text-lg">{item.stock_quantity}</p>
                    <p className="text-xs text-gray-500">de {item.min_stock_quantity} min.</p>
                  </div>
                  <span className="text-sm text-gray-500">{item.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {isMobile && lowStockItems.length > 3 && (
          <p className="text-xs text-center text-muted-foreground mt-3">
            Role para ver mais produtos
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LowStockAlerts;
