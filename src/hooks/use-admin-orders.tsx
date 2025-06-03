
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
    
    // Set up realtime subscription for orders
    const ordersChannel = supabase
      .channel('orders-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        async (payload) => {
          console.log('Order change detected:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Get customer info for notification
            let customerName = 'Cliente';
            try {
              if (payload.new.customer_info && typeof payload.new.customer_info === 'string') {
                const customerInfo = JSON.parse(payload.new.customer_info);
                customerName = customerInfo.name || 'Cliente';
              } else if (payload.new.customer_name) {
                customerName = payload.new.customer_name;
              }
            } catch (e) {
              console.error('Error parsing customer info:', e);
            }

            // Create notification in database
            await supabase.from('notifications').insert({
              user_id: 'admin', // You might want to get actual admin user IDs
              title: 'Novo pedido recebido',
              message: `Pedido #${payload.new.id.slice(0, 8)} de ${customerName} - Total: ${Number(payload.new.total).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}`,
              type: 'order'
            });

            // Show toast notification
            toast({
              title: 'Novo pedido recebido',
              description: `Pedido #${payload.new.id.slice(0, 8)} de ${customerName} foi recebido.`
            });
          }
          
          if (payload.eventType === 'UPDATE') {
            // Check if status changed
            if (payload.old.status !== payload.new.status) {
              await supabase.from('notifications').insert({
                user_id: 'admin',
                title: 'Status do pedido atualizado',
                message: `Pedido #${payload.new.id.slice(0, 8)} alterado para: ${payload.new.status}`,
                type: 'status_update'
              });
            }
          }
          
          fetchOrders();
        }
      )
      .subscribe();

    // Set up realtime subscription for low stock alerts
    const stockChannel = supabase
      .channel('stock-changes')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products' },
        async (payload) => {
          console.log('Stock change detected:', payload);
          
          const newStock = payload.new.stock_quantity;
          const minStock = payload.new.min_stock_quantity || 5;
          
          if (newStock <= minStock && newStock > 0) {
            await supabase.from('notifications').insert({
              user_id: 'admin',
              title: 'Estoque baixo',
              message: `${payload.new.name} está com estoque baixo: ${newStock} unidades restantes`,
              type: 'low_stock'
            });
            
            toast({
              title: 'Alerta de estoque',
              description: `${payload.new.name} está com estoque baixo: ${newStock} unidades`,
              variant: 'destructive'
            });
          }
          
          if (newStock === 0) {
            await supabase.from('notifications').insert({
              user_id: 'admin',
              title: 'Produto esgotado',
              message: `${payload.new.name} está esgotado!`,
              type: 'out_of_stock'
            });
            
            toast({
              title: 'Produto esgotado',
              description: `${payload.new.name} está esgotado!`,
              variant: 'destructive'
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(stockChannel);
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

      const formattedOrders: Order[] = data.map((order: any) => {
        let customerInfo = {
          name: 'Cliente',
          address: 'Endereço não informado',
          phone: 'Telefone não informado'
        };

        // Parse customer info safely
        try {
          if (order.customer_info && typeof order.customer_info === 'string') {
            const parsed = JSON.parse(order.customer_info);
            customerInfo = {
              name: parsed.name || customerInfo.name,
              address: parsed.address || customerInfo.address,
              phone: parsed.phone || customerInfo.phone
            };
          } else if (order.customer_info && typeof order.customer_info === 'object') {
            customerInfo = {
              name: order.customer_info.name || customerInfo.name,
              address: order.customer_info.address || customerInfo.address,
              phone: order.customer_info.phone || customerInfo.phone
            };
          }
          
          // Fallback to individual fields if they exist
          if (order.customer_name) customerInfo.name = order.customer_name;
          if (order.customer_address) customerInfo.address = order.customer_address;
          if (order.customer_phone) customerInfo.phone = order.customer_phone;
        } catch (e) {
          console.error('Error parsing customer info:', e);
        }

        return {
          id: order.id,
          items: order.items || [],
          subtotal: Number(order.subtotal) || 0,
          deliveryFee: Number(order.delivery_fee) || 0,
          total: Number(order.total) || 0,
          status: order.status || 'pending',
          paymentStatus: order.payment_status || 'pending',
          paymentMethod: { 
            name: order.payment_method || 'Não informado',
            id: 'payment-' + order.id,
            icon: 'credit-card'
          },
          customerInfo,
          createdAt: order.created_at,
          notes: order.notes || '',
          location: {
            id: 1,
            name: customerInfo.address,
            fee: Number(order.delivery_fee) || 0,
            estimatedTime: '30-45 min'
          }
        };
      });

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
    orders, 
    isLoading, 
    error, 
    refreshOrders: fetchOrders,
    updateOrderStatus,
    updatePaymentStatus
  };
};

export default useAdminOrders;
