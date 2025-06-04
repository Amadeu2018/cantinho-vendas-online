
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

export const useStockNotifications = () => {
  const { toast } = useToast();

  useEffect(() => {
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
      supabase.removeChannel(stockChannel);
    };
  }, [toast]);
};
