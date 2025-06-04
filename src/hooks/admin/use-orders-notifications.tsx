
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

export const useOrdersNotifications = (refreshOrders: () => void) => {
  const { toast } = useToast();

  useEffect(() => {
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
              user_id: 'admin',
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
          
          refreshOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, [refreshOrders, toast]);
};
