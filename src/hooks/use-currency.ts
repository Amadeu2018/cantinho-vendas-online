import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCurrency = () => {
  const [currency, setCurrency] = useState('AOA');
  
  useEffect(() => {
    const fetchCurrencySettings = async () => {
      try {
        const { data, error } = await supabase
          .from('company_settings')
          .select('currency')
          .limit(1)
          .single();
        
        if (data && !error) {
          setCurrency(data.currency || 'AOA');
        }
      } catch (error) {
        console.error('Error fetching currency settings:', error);
      }
    };
    
    fetchCurrencySettings();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return { currency, formatPrice };
};