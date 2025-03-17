
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: 'appetizer' | 'main' | 'dessert';
  promotion?: {
    discount: number;
    label?: string;
  };
};

export const useDishes = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useAuth();

  const fetchDishes = async () => {
    try {
      setLoading(true);
      
      // Fetch all dishes
      const { data: dishesData, error: dishesError } = await supabase
        .from('dishes')
        .select('*');
      
      if (dishesError) throw dishesError;
      
      // Fetch active promotions
      const now = new Date().toISOString();
      const { data: promotionsData, error: promotionsError } = await supabase
        .from('promotions')
        .select(`
          id, 
          title, 
          discount_percentage,
          promotion_dishes(dish_id)
        `)
        .lte('start_date', now)
        .gte('valid_until', now);
        
      if (promotionsError) throw promotionsError;
      
      // Create a map of dish_id to promotion
      const promotionMap = new Map();
      promotionsData?.forEach(promotion => {
        promotion.promotion_dishes?.forEach((pd: any) => {
          promotionMap.set(pd.dish_id, {
            discount: promotion.discount_percentage,
            label: promotion.title
          });
        });
      });
      
      // Apply promotions to dishes
      const dishesWithPromotions = dishesData?.map(dish => {
        const promotion = promotionMap.get(dish.id);
        return {
          ...dish,
          promotion: promotion || undefined
        };
      }) || [];
      
      setDishes(dishesWithPromotions);
    } catch (error: any) {
      console.error('Error fetching dishes:', error);
      toast({
        title: 'Erro ao carregar pratos',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) {
      setFavorites([]);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('dish_id')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setFavorites(data?.map(fav => fav.dish_id) || []);
    } catch (error: any) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (dishId: string) => {
    if (!user) {
      toast({
        title: 'Ação não permitida',
        description: 'Faça login para adicionar favoritos',
        variant: 'destructive',
      });
      return;
    }
    
    const isFavorite = favorites.includes(dishId);
    
    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('dish_id', dishId);
          
        if (error) throw error;
        
        setFavorites(favorites.filter(id => id !== dishId));
        
        toast({
          title: 'Removido dos favoritos',
          description: 'Prato removido da sua lista de favoritos',
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            dish_id: dishId
          });
          
        if (error) throw error;
        
        setFavorites([...favorites, dishId]);
        
        toast({
          title: 'Adicionado aos favoritos',
          description: 'Prato adicionado à sua lista de favoritos',
        });
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const isFavorite = (dishId: string) => favorites.includes(dishId);

  useEffect(() => {
    fetchDishes();
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  return {
    dishes,
    loading,
    fetchDishes,
    isFavorite,
    toggleFavorite,
    favorites,
  };
};
