import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DeliveryLocation } from '@/contexts/CartContext';

export const useDeliveryZones = () => {
  const [deliveryZones, setDeliveryZones] = useState<DeliveryLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeliveryZones = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('delivery_zones')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        const zones: DeliveryLocation[] = data.map((zone) => ({
          id: parseInt(zone.id.substring(0, 8), 16), // Convert UUID to number for compatibility
          name: zone.name,
          fee: Number(zone.fee),
          estimatedTime: zone.estimated_time
        }));
        setDeliveryZones(zones);
      } else {
        // Set default zones if none exist in database
        setDeliveryZones([
          { id: 1, name: "Centro da Cidade", fee: 1500, estimatedTime: "20-30 min" },
          { id: 2, name: "Marginal", fee: 2000, estimatedTime: "30-40 min" },
          { id: 3, name: "Talatona", fee: 2500, estimatedTime: "40-50 min" }
        ]);
      }
    } catch (err) {
      console.error('Error fetching delivery zones:', err);
      setError(err instanceof Error ? err.message : 'Error fetching delivery zones');
      
      // Set default zones on error
      setDeliveryZones([
        { id: 1, name: "Centro da Cidade", fee: 1500, estimatedTime: "20-30 min" },
        { id: 2, name: "Marginal", fee: 2000, estimatedTime: "30-40 min" },
        { id: 3, name: "Talatona", fee: 2500, estimatedTime: "40-50 min" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryZones();

    // Subscribe to delivery zone changes
    const subscription = supabase
      .channel('delivery_zones_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'delivery_zones' 
        }, 
        () => {
          console.log('Delivery zones changed, refetching...');
          fetchDeliveryZones();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { deliveryZones, loading, error, refetch: fetchDeliveryZones };
};