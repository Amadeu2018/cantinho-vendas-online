
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  ChefHat, 
  Truck, 
  CheckCircle, 
  Package,
  MapPin,
  Phone,
  Bell,
  BellOff
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OrderTrackerProps {
  orderId: string;
}

interface OrderStatus {
  id: string;
  status: string;
  estimatedDeliveryTime: string;
  currentStep: number;
  customerInfo: {
    name: string;
    phone: string;
    address: string;
  };
  items: Array<{
    name: string;
    quantity: number;
  }>;
}

const OrderTracker = ({ orderId }: OrderTrackerProps) => {
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const orderSteps = [
    { 
      id: 'pending', 
      title: 'Pedido Recebido', 
      icon: Package, 
      description: 'Seu pedido foi confirmado',
      color: 'text-blue-500'
    },
    { 
      id: 'confirmed', 
      title: 'Em Preparação', 
      icon: ChefHat, 
      description: 'Nossos chefs estão preparando seu pedido',
      color: 'text-orange-500'
    },
    { 
      id: 'preparing', 
      title: 'Pronto para Entrega', 
      icon: Package, 
      description: 'Seu pedido está pronto',
      color: 'text-purple-500'
    },
    { 
      id: 'delivering', 
      title: 'Em Trânsito', 
      icon: Truck, 
      description: 'Seu pedido está a caminho',
      color: 'text-blue-600'
    },
    { 
      id: 'completed', 
      title: 'Entregue', 
      icon: CheckCircle, 
      description: 'Pedido entregue com sucesso',
      color: 'text-green-500'
    }
  ];

  useEffect(() => {
    fetchOrderDetails();
    
    // Set up real-time subscription for order updates
    const channel = supabase
      .channel(`order-${orderId}`)
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` }, 
        (payload) => {
          console.log('Order status updated:', payload);
          fetchOrderDetails();
          
          if (notifications) {
            toast({
              title: 'Status Atualizado',
              description: `Seu pedido foi atualizado para: ${payload.new.status}`
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, notifications]);

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        let customerInfo = {
          name: 'Cliente',
          phone: 'Não informado',
          address: 'Endereço não informado'
        };

        try {
          if (data.customer_info && typeof data.customer_info === 'string') {
            const parsed = JSON.parse(data.customer_info);
            customerInfo = {
              name: parsed.name || customerInfo.name,
              phone: parsed.phone || customerInfo.phone,
              address: parsed.address || customerInfo.address
            };
          }
        } catch (e) {
          console.error('Error parsing customer info:', e);
        }

        const currentStepIndex = orderSteps.findIndex(step => step.id === data.status);
        
        // Handle items properly - ensure it's always an array
        let orderItems: Array<{ name: string; quantity: number; }> = [];
        if (data.items) {
          if (Array.isArray(data.items)) {
            orderItems = data.items.map((item: any) => ({
              name: item.name || 'Item',
              quantity: item.quantity || 1
            }));
          } else if (typeof data.items === 'string') {
            try {
              const parsedItems = JSON.parse(data.items);
              if (Array.isArray(parsedItems)) {
                orderItems = parsedItems.map((item: any) => ({
                  name: item.name || 'Item',
                  quantity: item.quantity || 1
                }));
              }
            } catch (e) {
              console.error('Error parsing items:', e);
            }
          }
        }
        
        setOrder({
          id: data.id,
          status: data.status,
          estimatedDeliveryTime: calculateEstimatedTime(data.created_at, data.status),
          currentStep: currentStepIndex >= 0 ? currentStepIndex : 0,
          customerInfo,
          items: orderItems
        });
      }
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os detalhes do pedido',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateEstimatedTime = (createdAt: string, status: string) => {
    const created = new Date(createdAt);
    
    // Base delivery time in minutes based on status
    const deliveryTimes = {
      pending: 45,
      confirmed: 35,
      preparing: 25,
      delivering: 15,
      completed: 0
    };
    
    const baseTime = deliveryTimes[status as keyof typeof deliveryTimes] || 45;
    const estimatedDelivery = new Date(created.getTime() + baseTime * 60000);
    
    return estimatedDelivery.toLocaleTimeString('pt-AO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getProgressPercentage = () => {
    if (!order) return 0;
    return ((order.currentStep + 1) / orderSteps.length) * 100;
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
    toast({
      title: notifications ? 'Notificações Desativadas' : 'Notificações Ativadas',
      description: notifications 
        ? 'Você não receberá mais notificações sobre este pedido'
        : 'Você receberá notificações sobre atualizações do pedido'
    });
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin h-8 w-8 border-2 border-cantinho-terracotta border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Pedido não encontrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-cantinho-navy to-cantinho-terracotta text-white">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Acompanhar Pedido</CardTitle>
            <p className="text-white/90">#{orderId.slice(0, 8).toUpperCase()}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleNotifications}
            className="text-white hover:bg-white/20"
          >
            {notifications ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Progresso do Pedido</span>
            <span className="text-cantinho-terracotta font-semibold">
              {Math.round(getProgressPercentage())}%
            </span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        {/* Estimated Delivery Time */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <Clock className="h-5 w-5" />
            <div>
              <p className="font-semibold">Tempo Estimado de Entrega</p>
              <p className="text-sm">Até às {order.estimatedDeliveryTime}</p>
            </div>
          </div>
        </div>

        {/* Order Steps */}
        <div className="space-y-4">
          {orderSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= order.currentStep;
            const isCurrent = index === order.currentStep;
            
            return (
              <div 
                key={step.id}
                className={`flex items-start gap-4 p-3 rounded-lg transition-all ${
                  isActive ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  isActive 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold ${isActive ? 'text-green-800' : 'text-gray-600'}`}>
                      {step.title}
                    </h3>
                    {isCurrent && (
                      <Badge className="bg-cantinho-terracotta text-white">
                        Atual
                      </Badge>
                    )}
                  </div>
                  <p className={`text-sm ${isActive ? 'text-green-700' : 'text-gray-500'}`}>
                    {step.description}
                  </p>
                </div>
                {isActive && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
            );
          })}
        </div>

        {/* Customer Info */}
        <div className="border-t pt-4 space-y-3">
          <h3 className="font-semibold text-cantinho-navy">Informações de Entrega</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{order.customerInfo.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{order.customerInfo.phone}</span>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-cantinho-cream/20 border border-cantinho-cream rounded-lg p-4">
          <h4 className="font-semibold text-cantinho-navy mb-2">Precisa de Ajuda?</h4>
          <p className="text-sm text-gray-600 mb-3">
            Entre em contato conosco se tiver alguma dúvida sobre seu pedido.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => window.open('https://wa.me/244924678544', '_blank')}
          >
            <Phone className="h-4 w-4 mr-2" />
            Contatar via WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTracker;
