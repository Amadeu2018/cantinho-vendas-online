
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

export interface Order {
  id: string;
  items: any[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: {
    name: string;
    id?: string;
    icon?: string;
  };
  customerInfo: {
    name: string;
    address: string;
    phone: string;
  };
  createdAt: string;
  notes: string;
  location: {
    id: number;
    name: string;
    fee: number;
    estimatedTime: string;
  };
}

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        () => {
          fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;

      const formattedOrders: Order[] = data.map((order: any) => ({
        id: order.id,
        items: order.items,
        subtotal: order.subtotal,
        deliveryFee: order.delivery_fee,
        total: order.total,
        status: order.status,
        paymentStatus: order.payment_status,
        paymentMethod: { 
          name: order.payment_method || '',
          id: 'payment-' + order.id,
          icon: 'credit-card'
        },
        customerInfo: {
          name: order.customer_name || '',
          address: order.customer_address || '',
          phone: order.customer_phone || ''
        },
        createdAt: order.created_at,
        notes: order.notes || '',
        location: {
          id: 1, // Default location info
          name: order.customer_address || 'Not specified',
          fee: order.delivery_fee || 0,
          estimatedTime: '30-45 min'
        }
      }));

      setOrders(formattedOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setError(error.message);
      toast({
        title: 'Erro ao carregar pedidos',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
        
      if (error) throw error;
      
      toast({
        title: 'Status atualizado',
        description: `Pedido marcado como "${status}"`,
      });
      
      // Update the local state
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, status } 
          : order
      ) as Order[];
      
      setOrders(updatedOrders);
      
      return true;
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Erro ao atualizar status',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: paymentStatus })
        .eq('id', orderId);
        
      if (error) throw error;
      
      toast({
        title: 'Pagamento atualizado',
        description: `Pagamento marcado como "${paymentStatus}"`,
      });
      
      // Update the local state
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, paymentStatus } 
          : order
      ) as Order[];
      
      setOrders(updatedOrders);
      
      return true;
    } catch (error: any) {
      console.error('Error updating payment status:', error);
      toast({
        title: 'Erro ao atualizar pagamento',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  return { 
    orders, 
    isLoading, 
    error, 
    refreshOrders: fetchOrders,
    updateOrderStatus,
    updatePaymentStatus
  };
};

export default useAdminOrders;
