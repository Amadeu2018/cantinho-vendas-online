import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, MapPin, Phone, ChefHat, Truck, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OrderTrackingProps {
  orderId: string;
  showFullDetails?: boolean;
}

const statusSteps = [
  { key: 'pending', label: 'Pendente', icon: Clock, color: 'bg-yellow-500' },
  { key: 'confirmed', label: 'Confirmado', icon: CheckCircle, color: 'bg-blue-500' },
  { key: 'preparing', label: 'Em Preparo', icon: ChefHat, color: 'bg-purple-500' },
  { key: 'delivering', label: 'Em Entrega', icon: Truck, color: 'bg-orange-500' },
  { key: 'completed', label: 'Entregue', icon: CheckCircle, color: 'bg-green-500' }
];

const RealTimeOrderTracking = ({ orderId, showFullDetails = true }: OrderTrackingProps) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [estimatedDelivery, setEstimatedDelivery] = useState<Date | null>(null);

  useEffect(() => {
    fetchOrderDetails();
    
    // Real-time subscription
    const subscription = supabase
      .channel(`order_${orderId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'orders',
          filter: `id=eq.${orderId}`
        }, 
        (payload) => {
          setOrder(payload.new);
          updateEstimatedDelivery(payload.new);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      
      setOrder(data);
      updateEstimatedDelivery(data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateEstimatedDelivery = (orderData: any) => {
    if (orderData.status === 'confirmed' && !orderData.estimated_delivery) {
      // Calculate estimated delivery based on preparation time + delivery time
      const baseTime = 30; // 30 minutes base preparation
      const deliveryTime = 20; // 20 minutes delivery
      const estimated = new Date(Date.now() + (baseTime + deliveryTime) * 60000);
      setEstimatedDelivery(estimated);
    } else if (orderData.estimated_delivery) {
      setEstimatedDelivery(new Date(orderData.estimated_delivery));
    }
  };

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === order?.status) || 0;
  };

  const getProgressPercentage = () => {
    const currentIndex = getCurrentStepIndex();
    return ((currentIndex + 1) / statusSteps.length) * 100;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-2 border-cantinho-terracotta border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Pedido não encontrado</p>
        </CardContent>
      </Card>
    );
  }

  const customerInfo = typeof order.customer_info === 'string' 
    ? JSON.parse(order.customer_info) 
    : order.customer_info;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Pedido #{order.id.slice(0, 8)}</CardTitle>
          <Badge variant="outline" className="capitalize">
            {statusSteps.find(step => step.key === order.status)?.label || order.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progresso do Pedido</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        {/* Status Steps */}
        <div className="space-y-4">
          {statusSteps.map((step, index) => {
            const currentIndex = getCurrentStepIndex();
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex items-center space-x-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${isCompleted ? step.color : 'bg-gray-200'}
                  ${isCurrent ? 'ring-4 ring-opacity-30 ring-cantinho-terracotta' : ''}
                `}>
                  <Icon className={`h-5 w-5 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-sm text-cantinho-terracotta">Em andamento</p>
                  )}
                </div>
                {isCompleted && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
            );
          })}
        </div>

        {/* Estimated Delivery */}
        {estimatedDelivery && order.status !== 'completed' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Previsão de Entrega</p>
                <p className="text-sm text-blue-700">
                  {formatDistanceToNow(estimatedDelivery, { addSuffix: true, locale: ptBR })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Customer Info */}
        {showFullDetails && (
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-medium text-gray-900">Informações de Entrega</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{customerInfo.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{customerInfo.phone}</span>
              </div>
            </div>
          </div>
        )}

        {/* Order Items */}
        {showFullDetails && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Itens do Pedido</h4>
            <div className="space-y-2">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('pt-AO', {
                      style: 'currency',
                      currency: 'AOA',
                      minimumFractionDigits: 0,
                    }).format(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total</span>
                <span>
                  {new Intl.NumberFormat('pt-AO', {
                    style: 'currency',
                    currency: 'AOA',
                    minimumFractionDigits: 0,
                  }).format(order.total)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeOrderTracking;