
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { CartItem, CustomerInfo, DeliveryLocation, Order, OrderStatus, PaymentMethod, PaymentStatus, OrderFromDatabase } from '@/types/cart';

export const submitOrder = async (
  items: CartItem[],
  customerInfo: CustomerInfo,
  deliveryLocation: DeliveryLocation,
  paymentMethod: PaymentMethod,
  userId?: string
): Promise<string> => {
  // Calculate total including delivery fee
  const deliveryFee = deliveryLocation?.fee || 0;
  const subtotalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotalAmount + deliveryFee;

  // Create order ID
  const orderId = uuidv4();

  // Create order object
  const order: Order = {
    id: orderId,
    items: [...items],
    customerInfo,
    subtotal: subtotalAmount,
    deliveryFee,
    total,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: paymentMethod,
    type: 'Pedido',
    createdAt: new Date().toISOString(),
    location: deliveryLocation
  };

  try {
    // If user is authenticated, save order to database
    if (userId) {
      const { error } = await supabase.from('orders').insert({
        id: order.id,
        customer_id: userId,
        items: order.items,
        total: order.total,
        customer_info: order.customerInfo,
        payment_method: order.paymentMethod.id,
        status: order.status,
        payment_status: order.paymentStatus,
        created_at: order.createdAt,
        subtotal: order.subtotal,
        delivery_fee: order.deliveryFee,
        location: order.location
      });

      if (error) {
        console.error("Error submitting order to Supabase:", error);
        throw error;
      }
    }

    // Save order to local storage for anonymous users or as a backup
    const savedOrders = localStorage.getItem('orders');
    const orders = savedOrders ? JSON.parse(savedOrders) : [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    return orderId;
  } catch (error) {
    console.error('Error submitting order:', error);
    throw error;
  }
};

export const getOrderById = async (orderId: string, userId?: string): Promise<Order | null> => {
  try {
    // Try to get order from Supabase if user is authenticated
    if (userId) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (!error && data) {
        // Transform database order into app Order type
        const dbOrder = data as OrderFromDatabase;
        const defaultCustomerInfo: CustomerInfo = {
          name: "Cliente",
          address: "Endereço não fornecido",
          phone: "Telefone não fornecido"
        };

        const defaultDeliveryLocation: DeliveryLocation = {
          id: 'luanda',
          name: 'Luanda',
          fee: 500,
          estimatedTime: '30-45 min'
        };

        return {
          id: dbOrder.id,
          items: dbOrder.items as CartItem[] || [],
          customerInfo: dbOrder.customer_info as CustomerInfo || defaultCustomerInfo,
          total: dbOrder.total,
          subtotal: dbOrder.subtotal || 0,
          deliveryFee: dbOrder.delivery_fee || 0,
          status: dbOrder.status as OrderStatus,
          paymentStatus: dbOrder.payment_status as PaymentStatus,
          paymentMethod: {
            id: dbOrder.payment_method || 'unknown',
            name: dbOrder.payment_method || 'Método de Pagamento',
            icon: 'credit-card'
          },
          type: dbOrder.type || 'Pedido',
          createdAt: dbOrder.created_at || new Date().toISOString(),
          location: dbOrder.location || defaultDeliveryLocation
        };
      }
    }
    
    // Fallback to local storage
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      const order = orders.find((o: any) => o.id === orderId);
      if (order) {
        return order as Order;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting order:', error);
    return null;
  }
};
