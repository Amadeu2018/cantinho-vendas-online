
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dish } from "@/types/dish";

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  validUntil: string;
  dish: Dish;
  isActive: boolean;
}

export const usePromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('promotions')
        .select(`
          *,
          products:products!promotions_product_id_fkey(*)
        `)
        .gte('end_date', new Date().toISOString());

      if (error) throw error;

      if (data) {
        const formattedPromotions: Promotion[] = data.map((promo: any) => ({
          id: promo.id,
          title: `${promo.discount_percentage}% OFF`,
          description: `Desconto especial em ${promo.products?.name || 'produto'}`,
          discount: Number(promo.discount_percentage) || 0,
          validUntil: promo.end_date,
          isActive: new Date(promo.end_date) > new Date(),
          dish: {
            id: promo.products?.id || promo.id,
            name: promo.products?.name || 'Produto',
            description: promo.products?.description || 'Descrição não disponível',
            price: Number(promo.products?.price) || 0,
            image_url: promo.products?.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3',
            image: promo.products?.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3',
            category: "main",
            rating: 4.5,
            prepTime: '20-30 min',
            serves: 2,
            isSpicy: false,
            isVegetarian: false,
            isPopular: false
          }
        }));

        setPromotions(formattedPromotions);
      }
    } catch (error) {
      console.error('Erro ao buscar promoções:', error);
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  return { promotions, loading, refetch: fetchPromotions };
};
