
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Dish } from '@/types/dish';

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
        .from('products')
        .select('*');
      
      if (dishesError) throw dishesError;
      
      // Fetch active promotions
      const now = new Date().toISOString();
      const { data: promotionsData, error: promotionsError } = await supabase
        .from('promotions')
        .select('id, discount_percentage, end_date, product_id')
        .gte('end_date', now);
        
      if (promotionsError) throw promotionsError;
      
      // Create a map of dish_id to promotion
      const promotionMap = new Map();
      promotionsData?.forEach((promotion: any) => {
        if (promotion.product_id) {
          promotionMap.set(promotion.product_id, {
            discount: promotion.discount_percentage,
            label: "Promoção"
          });
        }
      });
      
      // Transform products to dishes format
      const dishesWithPromotions = dishesData?.map((product: any) => {
        const promotion = promotionMap.get(product.id);
        return {
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          image_url: product.image_url || 'https://source.unsplash.com/random/300x200/?food',
          category: mapCategoryFromProduct(product),
          promotion: promotion || undefined
        } as Dish;
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

  // Helper function to map product categories
  const mapCategoryFromProduct = (product: any): 'appetizer' | 'main' | 'dessert' => {
    // Default to 'main' if category is missing
    if (!product.category) return 'main';
    
    const category = product.category.toLowerCase();
    if (category.includes('entrada') || category.includes('appetizer')) return 'appetizer';
    if (category.includes('sobremesa') || category.includes('dessert')) return 'dessert';
    return 'main';
  };

  const fetchFavorites = async () => {
    if (!user) {
      setFavorites([]);
      return;
    }
    
    try {
      // Since favorites table might not exist yet, we handle the error silently
      const { data } = await supabase.rpc('get_user_favorites', { user_id: user.id });
      setFavorites(data?.map((fav: any) => fav.product_id) || []);
    } catch (error: any) {
      console.error('Error fetching favorites:', error);
      // Quietly handle this error as the favorites table might not exist yet
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
    
    // For now we'll just update the UI without trying to store in database
    // as the favorites table might not be set up yet
    if (isFavorite) {
      setFavorites(favorites.filter(id => id !== dishId));
      toast({
        title: 'Removido dos favoritos',
        description: 'Prato removido da sua lista de favoritos',
      });
    } else {
      setFavorites([...favorites, dishId]);
      toast({
        title: 'Adicionado aos favoritos',
        description: 'Prato adicionado à sua lista de favoritos',
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
