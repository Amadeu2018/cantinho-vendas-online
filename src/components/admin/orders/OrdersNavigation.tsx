
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Search, Filter, Download } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrdersNavigationProps {
  selectedOrderId: string | null;
  onBackToList: () => void;
  onSearch?: (term: string) => void;
  onExport?: () => void;
  totalOrders: number;
  pendingOrders: number;
}

const OrdersNavigation = ({
  selectedOrderId,
  onBackToList,
  onSearch,
  onExport,
  totalOrders,
  pendingOrders
}: OrdersNavigationProps) => {
  const isMobile = useIsMobile();

  if (selectedOrderId) {
    return (
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg border">
        <Button 
          onClick={onBackToList}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {!isMobile && "Voltar para Lista"}
        </Button>
        
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Detalhes do Pedido
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-4">
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-cantinho-navy" />
            <h2 className="text-lg font-semibold text-gray-900">Pedidos</h2>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">
              {totalOrders} Total
            </Badge>
            {pendingOrders > 0 && (
              <Badge variant="destructive" className="text-xs">
                {pendingOrders} Pendentes
              </Badge>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {!isMobile && "Exportar"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersNavigation;
