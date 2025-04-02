
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Dish } from '@/hooks/use-dishes';

export type Promotion = {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  validUntil: string;
  image_url: string;
  dishes: Dish[];
};

export const usePromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      
      // Get current date in ISO format
      const now = new Date().toISOString();
      
      // Fetch active promotions
      const { data: promotionsData, error: promotionsError } = await supabase
        .from('promotions')
        .select(`
          *
        `)
        .gte('valid_until', now);
        
      if (promotionsError) throw promotionsError;
      
      if (!promotionsData || promotionsData.length === 0) {
        setPromotions([]);
        return;
      }
      
      // For each promotion, fetch the associated dishes
      const promotionsWithDishes = await Promise.all(
        promotionsData.map(async (promotion: any) => {
          // Get dishes associated with this promotion
          const { data: promotionDishes, error: pdError } = await supabase
            .from('promotion_dishes')
            .select(`
              dish_id
            `)
            .eq('promotion_id', promotion.id);
            
          if (pdError) throw pdError;
          
          // Get the actual dish data
          const dishIds = promotionDishes?.map((pd: any) => pd.dish_id) || [];
          
          if (dishIds.length === 0) {
            return null; // Skip promotions with no dishes
          }
          
          const { data: dishes, error: dishesError } = await supabase
            .from('dishes')
            .select('*')
            .in('id', dishIds);
            
          if (dishesError) throw dishesError;
          
          // Map to the expected Promotion type
          return {
            id: promotion.id,
            title: promotion.title,
            description: promotion.description,
            discountPercentage: promotion.discount_percentage,
            validUntil: promotion.valid_until,
            image_url: promotion.image_url,
            dishes: dishes || []
          } as Promotion;
        }) || []
      );
      
      // Filter out null values (promotions with no dishes)
      const filteredPromotions = promotionsWithDishes.filter(Boolean) as Promotion[];
      setPromotions(filteredPromotions);
    } catch (error: any) {
      console.error('Error fetching promotions:', error);
      toast({
        title: 'Erro ao carregar promoções',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return {
    promotions,
    loading,
    fetchPromotions,
  };
};
