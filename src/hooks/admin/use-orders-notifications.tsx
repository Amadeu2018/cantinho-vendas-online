
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

export const useOrdersNotifications = (refreshOrders: () => void) => {
  const { toast } = useToast();

  useEffect(() => {
    console.log('Configurando notificações de pedidos do admin...');
    
    // Set up realtime subscription for orders
    const ordersChannel = supabase
      .channel('admin-orders-notifications')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        async (payload) => {
          console.log('Admin: Order change detected:', payload);
          
          if (payload.eventType === 'INSERT') {
            console.log('Admin: Novo pedido detectado:', payload.new);
            
            // Get customer info for notification
            let customerName = 'Cliente';
            let customerInfo = {};
            
            try {
              if (payload.new.customer_info) {
                if (typeof payload.new.customer_info === 'string') {
                  customerInfo = JSON.parse(payload.new.customer_info);
                } else {
                  customerInfo = payload.new.customer_info;
                }
                customerName = customerInfo.name || 'Cliente';
              }
            } catch (e) {
              console.error('Error parsing customer info:', e);
            }

            // Create notification in database
            try {
              const { error: notificationError } = await supabase
                .from('notifications')
                .insert({
                  user_id: 'admin',
                  title: 'Novo pedido recebido',
                  message: `Pedido #${payload.new.id.slice(0, 8)} de ${customerName} - Total: ${Number(payload.new.total).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}`,
                  type: 'order',
                  read: false
                });

              if (notificationError) {
                console.error('Erro ao criar notificação:', notificationError);
              } else {
                console.log('Notificação criada com sucesso');
              }
            } catch (error) {
              console.error('Erro ao inserir notificação:', error);
            }

            // Show toast notification
            toast({
              title: 'Novo pedido recebido!',
              description: `Pedido #${payload.new.id.slice(0, 8)} de ${customerName} foi recebido.`,
              duration: 5000,
            });

            console.log('Admin: Toast exibido para novo pedido');
          }
          
          if (payload.eventType === 'UPDATE') {
            // Check if status changed
            if (payload.old && payload.old.status !== payload.new.status) {
              console.log('Admin: Status do pedido alterado:', payload.old.status, '->', payload.new.status);
              
              try {
                const { error: statusNotificationError } = await supabase
                  .from('notifications')
                  .insert({
                    user_id: 'admin',
                    title: 'Status do pedido atualizado',
                    message: `Pedido #${payload.new.id.slice(0, 8)} alterado para: ${payload.new.status}`,
                    type: 'status_update',
                    read: false
                  });

                if (statusNotificationError) {
                  console.error('Erro ao criar notificação de status:', statusNotificationError);
                }
              } catch (error) {
                console.error('Erro ao inserir notificação de status:', error);
              }
            }
          }
          
          // Always refresh orders when any change occurs
          console.log('Admin: Atualizando lista de pedidos...');
          refreshOrders();
        }
      )
      .subscribe((status) => {
        console.log('Admin notifications subscription status:', status);
      });

    return () => {
      console.log('Limpando subscription de notificações do admin');
      supabase.removeChannel(ordersChannel);
    };
  }, [refreshOrders, toast]);
};
