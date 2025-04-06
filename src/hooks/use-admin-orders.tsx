
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);
  const { toast } = useToast();
  
  const fetchOrders = async () => {
    try {
      setFetchingOrders(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedOrders = data.map(order => {
        let customerInfo = { name: 'Cliente' };
        let paymentMethodName = 'Desconhecido';
        
        try {
          if (typeof order.customer_info === 'string') {
            customerInfo = JSON.parse(order.customer_info);
          } else if (order.customer_info) {
            customerInfo = order.customer_info;
          }
          
          // Handle payment method to ensure it always results in a valid object with a name property
          if (order.payment_method !== null && order.payment_method !== undefined) {
            if (typeof order.payment_method === 'string') {
              paymentMethodName = order.payment_method;
            } else if (typeof order.payment_method === 'number') {
              paymentMethodName = String(order.payment_method);
            } else if (typeof order.payment_method === 'boolean') {
              paymentMethodName = order.payment_method ? 'Confirmado' : 'Não Confirmado';
            } else if (typeof order.payment_method === 'object') {
              // Handle object or array case
              if (Array.isArray(order.payment_method)) {
                paymentMethodName = 'Lista de Métodos';
              } else {
                // It's an object
                const pm = order.payment_method as Record<string, any>;
                paymentMethodName = pm.name && typeof pm.name === 'string' 
                  ? pm.name 
                  : 'Objeto';
              }
            }
          }
        } catch (e) {
          console.error("Error parsing order data:", e);
        }
        
        return {
          ...order,
          id: order.id,
          customerInfo,
          // Always ensure paymentMethod is an object with a name property
          paymentMethod: { name: paymentMethodName },
          total: order.total,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
          status: order.status || 'pending',
          paymentStatus: order.payment_status || 'pending',
          items: typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || [])
        };
      });
      
      setOrders(formattedOrders);
      
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      toast({
        title: "Erro ao carregar pedidos",
        description: "Não foi possível carregar a lista de pedidos.",
        variant: "destructive"
      });
    } finally {
      setFetchingOrders(false);
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      
      toast({
        title: "Status atualizado",
        description: `O status do pedido foi atualizado para ${status}.`
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o status do pedido.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const handlePaymentStatusChange = async (orderId: string, status: "pending" | "completed") => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: status })
        .eq('id', orderId);
      
      if (error) throw error;
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, paymentStatus: status } : order
      ));
      
      toast({
        title: "Status de pagamento atualizado",
        description: `O status de pagamento foi atualizado para ${status === 'completed' ? 'pago' : 'pendente'}.`
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao atualizar status de pagamento:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o status de pagamento.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    orders,
    fetchingOrders,
    fetchOrders,
    handleStatusChange,
    handlePaymentStatusChange
  };
}
