
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Package, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

// Interface mais flexível para aceitar dados do Supabase
interface SupabaseOrder {
  id: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  customer_info: any;
  items: any[];
  payment_method: string;
  [key: string]: any;
}

interface OrderTrackingListProps {
  orders: SupabaseOrder[];
  onSelectOrder: (order: SupabaseOrder) => void;
  formatPrice: (price: number) => string;
  getStatusName: (status: string) => string;
  getStatusColor: (status: string) => string;
  getProgressPercentage: (status: string) => number;
}

const OrderTrackingList = ({ 
  orders, 
  onSelectOrder, 
  formatPrice, 
  getStatusName, 
  getStatusColor, 
  getProgressPercentage 
}: OrderTrackingListProps) => {
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">Você não tem pedidos em andamento no momento</p>
        <Button 
          onClick={() => navigate('/menu')}
          className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
        >
          Ver Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-semibold">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-sm text-gray-600">
                {formatDistanceToNow(new Date(order.created_at), {
                  addSuffix: true,
                  locale: ptBR
                })}
              </p>
              {order.items && order.items.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {order.items.length} item(s)
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-bold">{formatPrice(order.total)}</p>
              <Badge variant="outline" className={getStatusColor(order.status)}>
                {getStatusName(order.status)}
              </Badge>
            </div>
          </div>
          
          <div className="mb-3">
            <Progress value={getProgressPercentage(order.status)} className="h-2" />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Método: {order.payment_method}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onSelectOrder(order)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Acompanhar
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTrackingList;
