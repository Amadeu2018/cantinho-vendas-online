
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Promotion } from '@/types/promotion';
import { Dish } from '@/types/dish';

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
        .select('*')
        .gte('end_date', now);
        
      if (promotionsError) throw promotionsError;
      
      if (!promotionsData || promotionsData.length === 0) {
        setPromotions([]);
        return;
      }
      
      // For each promotion, fetch the associated product
      const promotionsWithDishes = await Promise.all(
        promotionsData.map(async (promotion: any) => {
          if (!promotion.product_id) return null;
          
          // Get the actual product data
          const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', promotion.product_id)
            .single();
            
          if (productError) return null;
          
          // Convert product to dish format
          const dish: Dish = {
            id: product.id,
            name: product.name,
            description: product.description || '',
            price: product.price,
            image_url: product.image_url || 'https://source.unsplash.com/random/300x200/?food',
            category: 'main' // Default category
          };
          
          // Map to the expected Promotion type
          return {
            id: promotion.id,
            title: promotion.title || `${product.name} em promoção!`,
            description: promotion.description || `Aproveite ${promotion.discount_percentage}% de desconto`,
            discountPercentage: promotion.discount_percentage,
            validUntil: promotion.end_date,
            image_url: promotion.image_url || product.image_url || 'https://source.unsplash.com/random/400x200/?promotion',
            dishes: [dish]
          } as Promotion;
        })
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
