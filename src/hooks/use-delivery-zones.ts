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
      
      console.log('Fetching delivery zones...');
      
      const { data, error: fetchError } = await supabase
        .from('delivery_zones')
        .select('id, name, fee, estimated_time, is_active')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      console.log('Delivery zones response:', { data, error: fetchError });

      if (fetchError) {
        console.error('Supabase fetch error:', fetchError);
        throw fetchError;
      }

      if (data && data.length > 0) {
        console.log('Processing zones data:', data);
        const zones: DeliveryLocation[] = data.map((zone) => ({
          id: zone.id,
          name: zone.name,
          fee: Number(zone.fee),
          estimatedTime: zone.estimated_time
        }));
        console.log('Mapped zones:', zones);
        setDeliveryZones(zones);
      } else {
        console.log('No zones found, using defaults');
        // No zones found - this should not happen as we have data in DB
        setDeliveryZones([]);
      }
    } catch (err) {
      console.error('Error fetching delivery zones:', err);
      setError(err instanceof Error ? err.message : 'Error fetching delivery zones');
      // On error, set empty array to show the "no zones" state
      setDeliveryZones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useDeliveryZones: Initializing hook');
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
        (payload) => {
          console.log('Delivery zones changed, refetching...', payload);
          fetchDeliveryZones();
        }
      )
      .subscribe();

    return () => {
      console.log('useDeliveryZones: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  return { deliveryZones, loading, error, refetch: fetchDeliveryZones };
};