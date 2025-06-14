
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

export interface Order {
  id: string;
  items: any[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'completed' | 'cancelled';
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
  notes: string;
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

        // Map database status to compatible status
        let mappedStatus: Order['status'] = 'pending';
        switch (order.status) {
          case 'pending':
          case 'confirmed':
          case 'preparing':
          case 'delivered':
          case 'completed':
          case 'cancelled':
            mappedStatus = order.status;
            break;
          case 'ready':
            mappedStatus = 'preparing';
            break;
          default:
            mappedStatus = 'pending';
        }

        return {
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

  useEffect(() => {
    fetchOrders();
  }, []);

  return { 
    orders, 
    isLoading, 
    error, 
    refreshOrders: fetchOrders,
    setOrders
  };
};
