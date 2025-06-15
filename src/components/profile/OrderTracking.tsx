
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  ChefHat, 
  Truck, 
  CheckCircle, 
  Package,
  MapPin,
  Phone,
  Eye,
  ArrowLeft,
  Home
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  customer_info: any;
  items: any[];
  payment_method: string;
}

interface OrderTrackingProps {
  userId: string;
}

const OrderTracking = ({ userId }: OrderTrackingProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const orderSteps = [
    { 
      id: 'pending', 
      title: 'Pedido Recebido', 
      icon: Package, 
      description: 'Seu pedido foi confirmado'
    },
    { 
      id: 'confirmed', 
      title: 'Confirmado', 
      icon: CheckCircle, 
      description: 'Pedido confirmado pelo restaurante'
    },
    { 
      id: 'preparing', 
      title: 'Em Preparação', 
      icon: ChefHat, 
      description: 'Estamos preparando seu pedido'
    },
    { 
      id: 'delivering', 
      title: 'Em Entrega', 
      icon: Truck, 
      description: 'Seu pedido está a caminho'
    },
    { 
      id: 'completed', 
      title: 'Entregue', 
      icon: CheckCircle, 
      description: 'Pedido entregue com sucesso'
    }
  ];

  useEffect(() => {
    fetchUserOrders();
    
    // Set up real-time subscription for order updates
    const channel = supabase
      .channel(`user-orders-${userId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'orders',
          filter: `customer_id=eq.${userId}`
        }, 
        (payload) => {
          console.log('Order status updated:', payload);
          fetchUserOrders();
          
          toast({
            title: 'Status do Pedido Atualizado',
            description: `Seu pedido foi atualizado para: ${getStatusName(payload.new.status)}`
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchUserOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', userId)
        .in('status', ['pending', 'confirmed', 'preparing', 'delivering'])
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform the data to match our Order interface
      const transformedOrders: Order[] = (data || []).map(order => ({
        ...order,
        items: Array.isArray(order.items) ? order.items : 
               typeof order.items === 'string' ? JSON.parse(order.items) : []
      }));
      
      setOrders(transformedOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar seus pedidos',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusName = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Aguardando Confirmação",
      confirmed: "Confirmado",
      preparing: "Em Preparação",
      delivering: "Em Entrega",
      completed: "Entregue",
      cancelled: "Cancelado"
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "preparing":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "delivering":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getProgressPercentage = (status: string) => {
    const stepIndex = orderSteps.findIndex(step => step.id === status);
    return stepIndex >= 0 ? ((stepIndex + 1) / orderSteps.length) * 100 : 0;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4 mr-1" />
              Início
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin h-8 w-8 border-2 border-cantinho-terracotta border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedOrder) {
    const currentStepIndex = orderSteps.findIndex(step => step.id === selectedOrder.status);
    
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Acompanhar Pedido</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
              >
                <Home className="h-4 w-4 mr-1" />
                Início
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedOrder(null)}
              >
                Lista de Pedidos
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">Pedido #{selectedOrder.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-sm text-gray-600">
                  {formatDistanceToNow(new Date(selectedOrder.created_at), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatPrice(selectedOrder.total)}</p>
                <Badge variant="outline" className={getStatusColor(selectedOrder.status)}>
                  {getStatusName(selectedOrder.status)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progresso do Pedido</span>
              <span className="text-cantinho-terracotta font-semibold">
                {Math.round(getProgressPercentage(selectedOrder.status))}%
              </span>
            </div>
            <Progress value={getProgressPercentage(selectedOrder.status)} className="h-2" />
          </div>

          <div className="space-y-4">
            {orderSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
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
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pedidos em Andamento</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4 mr-1" />
              Início
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
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
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Acompanhar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};

export default OrderTracking;
