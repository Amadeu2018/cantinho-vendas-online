
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Order } from './use-orders-data';

export const useOrdersActions = (orders: Order[], setOrders: (orders: Order[]) => void) => {
  const { toast } = useToast();

  const updateOrderStatus = async (orderId: string, status: string): Promise<void> => {
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
      
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, status } 
          : order
      ) as Order[];
      
      setOrders(updatedOrders);
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Erro ao atualizar status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: string): Promise<void> => {
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
      
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, paymentStatus } 
          : order
      ) as Order[];
      
      setOrders(updatedOrders);
    } catch (error: any) {
      console.error('Error updating payment status:', error);
      toast({
        title: 'Erro ao atualizar pagamento',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return {
    updateOrderStatus,
    updatePaymentStatus
  };
};
