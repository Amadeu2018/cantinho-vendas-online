import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseOrdersNotificationsProps {
  refreshOrders?: () => void;
}

export const useOrdersNotifications = ({ refreshOrders }: UseOrdersNotificationsProps = {}) => {
  useEffect(() => {
    // Subscribe to real-time order changes
    const subscription = supabase
      .channel('orders_notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'orders' 
        }, 
        async (payload) => {
          console.log('New order received:', payload);
          
          const order = payload.new;
          const customerInfo = order.customer_info || {};
          const customerName = customerInfo.name || 'Cliente';
          const orderTotal = order.total || 0;

          // Create notification for admins/sellers
          try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (!userError && user) {
              await supabase
                .from('notifications')
                .insert([{
                  user_id: user.id,
                  title: 'Novo Pedido Recebido',
                  message: `Novo pedido de ${customerName} no valor de ${new Intl.NumberFormat('pt-AO', {
                    style: 'currency',
                    currency: 'AOA',
                    minimumFractionDigits: 0,
                  }).format(orderTotal)}`,
                  type: 'order',
                  read: false
                }]);
            }
          } catch (error) {
            console.error('Error creating notification:', error);
          }

          // Show toast notification
          toast.success(
            `Novo pedido recebido de ${customerName}`,
            {
              description: `Valor: ${new Intl.NumberFormat('pt-AO', {
                style: 'currency',
                currency: 'AOA',
                minimumFractionDigits: 0,
              }).format(orderTotal)}`,
              duration: 5000,
            }
          );

          // Refresh orders list if callback provided
          if (refreshOrders) {
            refreshOrders();
          }
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders'
        },
        async (payload) => {
          console.log('Order updated:', payload);
          
          const oldOrder = payload.old;
          const newOrder = payload.new;
          
          // Check if status changed
          if (oldOrder.status !== newOrder.status) {
            const customerInfo = newOrder.customer_info || {};
            const customerName = customerInfo.name || 'Cliente';
            
            try {
              const { data: { user }, error: userError } = await supabase.auth.getUser();
              
              if (!userError && user) {
                await supabase
                  .from('notifications')
                  .insert([{
                    user_id: user.id,
                    title: 'Status do Pedido Atualizado',
                    message: `Pedido de ${customerName} alterado para: ${newOrder.status}`,
                    type: 'order_update',
                    read: false
                  }]);
              }
            } catch (error) {
              console.error('Error creating notification:', error);
            }
          }

          // Refresh orders list if callback provided
          if (refreshOrders) {
            refreshOrders();
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshOrders]);
};