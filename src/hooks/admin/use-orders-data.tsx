
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

export interface Order {
  id: string;
  items: any[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: {
    id: string;
    name: string;
    icon: string;
  };
  customerInfo: {
    name: string;
    address: string;
    phone: string;
  };
  createdAt: string;
  notes?: string; // Made optional to match CartContext
  location: {
    id: number;
    name: string;
    fee: number;
    estimatedTime: string;
  };
}

export const useOrdersData = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching orders from Supabase...');
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Raw orders data:', data);

      const formattedOrders: Order[] = (data || []).map((order: any) => {
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
        } catch (e) {
          console.error('Error parsing customer info:', e);
        }

        // Map database status to compatible status
        let mappedStatus: Order['status'] = 'pending';
        switch (order.status) {
          case 'pending':
          case 'confirmed':
          case 'preparing':
          case 'delivering':
          case 'delivered':
          case 'completed':
          case 'cancelled':
            mappedStatus = order.status;
            break;
          default:
            mappedStatus = 'pending';
        }

        const formattedOrder = {
          id: order.id,
          items: order.items || [],
          subtotal: Number(order.subtotal) || 0,
          deliveryFee: Number(order.delivery_fee) || 0,
          total: Number(order.total) || 0,
          status: mappedStatus,
          paymentStatus: order.payment_status || 'pending',
          paymentMethod: { 
            id: 'payment-' + order.id,
            name: order.payment_method || 'Não informado',
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

        console.log('Formatted order:', formattedOrder);
        return formattedOrder;
      });

      console.log('All formatted orders:', formattedOrders);
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

  // Set up real-time subscription for orders
  useEffect(() => {
    fetchOrders();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('orders_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders' 
        }, 
        (payload) => {
          console.log('Real-time order change:', payload);
          fetchOrders(); // Refetch orders when changes occur
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { 
    orders, 
    isLoading, 
    error, 
    refreshOrders: fetchOrders,
    setOrders
  };
};
