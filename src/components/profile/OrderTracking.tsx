
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import OrderTrackingList from "./tracking/OrderTrackingList";
import OrderTrackingDetail from "./tracking/OrderTrackingDetail";

// Interface mais flexível que aceita dados do Supabase
interface SupabaseOrder {
  id: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  customer_info: any;
  items: any; // Pode ser array ou string JSON
  payment_method: string;
  [key: string]: any; // Para outras propriedades do Supabase
}

interface OrderTrackingProps {
  userId: string;
}

const OrderTracking = ({ userId }: OrderTrackingProps) => {
  const [orders, setOrders] = useState<SupabaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<SupabaseOrder | null>(null);
  const { toast } = useToast();

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
      console.log("Buscando pedidos EM ANDAMENTO para OrderTracking:", userId);
      
      // Buscar apenas pedidos em andamento para o componente de tracking
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', userId)
        .in('status', ['pending', 'confirmed', 'preparing', 'delivering'])
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      console.log("Pedidos em andamento encontrados:", data?.length || 0);
      
      // Processar os dados dos pedidos para compatibilidade
      const processedOrders: SupabaseOrder[] = (data || []).map(order => {
        let processedItems = [];
        
        try {
          if (Array.isArray(order.items)) {
            processedItems = order.items;
          } else if (typeof order.items === 'string') {
            processedItems = JSON.parse(order.items);
          } else if (order.items && typeof order.items === 'object') {
            processedItems = [order.items];
          }
        } catch (e) {
          console.error("Erro ao processar items do pedido:", order.id, e);
          processedItems = [];
        }
        
        return {
          ...order,
          items: processedItems
        };
      });
      
      setOrders(processedOrders);
      console.log("Pedidos em andamento processados:", processedOrders.length);
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
    const orderSteps = ['pending', 'confirmed', 'preparing', 'delivering', 'completed'];
    const stepIndex = orderSteps.findIndex(step => step === status);
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
        <div className="p-6">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin h-8 w-8 border-2 border-cantinho-terracotta border-t-transparent rounded-full"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {selectedOrder ? (
        <OrderTrackingDetail
          order={selectedOrder}
          onBack={() => setSelectedOrder(null)}
          formatPrice={formatPrice}
          getStatusName={getStatusName}
          getStatusColor={getStatusColor}
          getProgressPercentage={getProgressPercentage}
        />
      ) : (
        <>
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Pedidos em Andamento</h2>
          </div>
          <div className="p-6">
            <OrderTrackingList
              orders={orders}
              onSelectOrder={setSelectedOrder}
              formatPrice={formatPrice}
              getStatusName={getStatusName}
              getStatusColor={getStatusColor}  
              getProgressPercentage={getProgressPercentage}
            />
          </div>
        </>
      )}
    </Card>
  );
};

export default OrderTracking;
