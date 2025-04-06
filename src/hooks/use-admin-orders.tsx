
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
        
        try {
          if (typeof order.customer_info === 'string') {
            customerInfo = JSON.parse(order.customer_info);
          } else if (order.customer_info) {
            customerInfo = order.customer_info;
          }
        } catch (e) {
          console.error("Error parsing customer info:", e);
        }
        
        // Extract payment method name - always returns a string
        const paymentMethodName = extractPaymentMethodName(order.payment_method);
        
        return {
          ...order,
          id: order.id,
          customerInfo,
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

  // Helper function to extract payment method name from any type
  const extractPaymentMethodName = (paymentMethod: any): string => {
    if (paymentMethod === null || paymentMethod === undefined) {
      return 'Desconhecido';
    }
    
    if (typeof paymentMethod === 'string') {
      return paymentMethod;
    }
    
    if (typeof paymentMethod === 'number') {
      return String(paymentMethod);
    }
    
    if (typeof paymentMethod === 'boolean') {
      return paymentMethod ? 'Confirmado' : 'Não Confirmado';
    }
    
    if (typeof paymentMethod === 'object') {
      if (Array.isArray(paymentMethod)) {
        return 'Lista de Métodos';
      }
      
      // It's an object - safely extract name property if it exists
      if (paymentMethod && 'name' in paymentMethod && typeof paymentMethod.name === 'string') {
        return paymentMethod.name;
      }
      
      return 'Objeto';
    }
    
    return 'Desconhecido';
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
