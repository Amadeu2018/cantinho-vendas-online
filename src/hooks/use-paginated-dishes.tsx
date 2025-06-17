
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dish } from "@/types/dish";

interface UsePaginatedDishesProps {
  pageSize?: number;
  searchTerm?: string;
  category?: string | null;
  featured?: boolean;
  popular?: boolean;
}

export const usePaginatedDishes = ({
  pageSize = 6,
  searchTerm = "",
  category = null,
  featured = false,
  popular = false
}: UsePaginatedDishesProps = {}) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchDishes = async (pageNumber: number, reset: boolean = false) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('products')
        .select(`
          *,
          categories:categories!products_category_id_fkey(name),
          promotions:promotions!promotions_product_id_fkey(discount_percentage, start_date, end_date)
        `, { count: 'exact' });

      // Apply filters
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (category && category !== "Todos") {
        query = query.eq('categories.name', category);
      }

      if (featured) {
        query = query.gte('stock_quantity', 20);
      }

      if (popular) {
        query = query.gte('stock_quantity', 15);
      }

      // Add pagination
      query = query
        .range(pageNumber * pageSize, (pageNumber + 1) * pageSize - 1)
        .order('created_at', { ascending: false });

      const { data: products, error, count } = await query;

      if (error) throw error;

      if (products) {
        const formattedDishes: Dish[] = products.map((product: any) => ({
          id: product.id,
          name: product.name || 'Produto sem nome',
          description: product.description || 'Descrição não disponível',
          price: Number(product.price) || 0,
          image_url: product.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3',
          image: product.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3',
          category: mapCategory(product.categories?.name || 'main'),
          popular: product.stock_quantity > 10,
          tags: product.categories ? [product.categories.name] : [],
          promotion: product.promotions && product.promotions.length > 0 ? {
            discount: Number(product.promotions[0].discount_percentage) || 0,
            label: `${product.promotions[0].discount_percentage}% OFF`
          } : undefined,
          rating: 4.5,
          prepTime: '20-30 min',
          serves: 2,
          isSpicy: false,
          isVegetarian: false,
          isPopular: product.stock_quantity > 10
        }));

        if (reset) {
          setDishes(formattedDishes);
        } else {
          setDishes(prev => [...prev, ...formattedDishes]);
        }

        setTotalCount(count || 0);
        setHasMore(formattedDishes.length === pageSize && (pageNumber + 1) * pageSize < (count || 0));
      }
    } catch (error: any) {
      console.error('Erro ao buscar pratos:', error);
      
      // Fallback com dados mock apenas se for a primeira página
      if (pageNumber === 0) {
        const mockDishes: Dish[] = [
          {
            id: "1",
            name: "Bacalhau à Brás",
            description: "Tradicional prato português com bacalhau desfiado, batata palha e ovos.",
            price: 2500,
            image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3",
            category: "main",
            tags: ["peixe", "tradicional"],
            popular: true,
            promotion: { discount: 15 },
            rating: 4.8,
            prepTime: '25-30 min',
            serves: 2,
            isSpicy: false,
            isVegetarian: false,
            isPopular: true
          },
          {
            id: "2",
            name: "Francesinha",
            description: "Sanduíche português com linguiça, presunto, carne e molho especial.",
            price: 1800,
            image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3",
            category: "main",
            tags: ["carne", "tradicional"],
            popular: true,
            rating: 4.6,
            prepTime: '20-25 min',
            serves: 1,
            isSpicy: false,
            isVegetarian: false,
            isPopular: true
          },
        ];
        
        setDishes(mockDishes);
        setTotalCount(mockDishes.length);
        setHasMore(false);
      }
      
      toast({
        title: "Aviso",
        description: "Carregando dados locais dos pratos.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('favorites')
        .select('dish_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data?.map(fav => fav.dish_id) || []);
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    }
  };

  const mapCategory = (categoryName: string): 'appetizer' | 'main' | 'dessert' => {
    const lowerCategory = categoryName.toLowerCase();
    if (lowerCategory.includes('entrada') || lowerCategory.includes('aperitivo')) return 'appetizer';
    if (lowerCategory.includes('sobremesa') || lowerCategory.includes('doce')) return 'dessert';
    return 'main';
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchDishes(nextPage);
    }
  };

  const reset = () => {
    setPage(0);
    setDishes([]);
    setHasMore(true);
    fetchDishes(0, true);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    reset();
  }, [searchTerm, category, featured, popular]);

  const toggleFavorite = async (dishId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Login necessário",
          description: "Faça login para adicionar favoritos",
          variant: "destructive",
        });
        return;
      }

      const isFavorite = favorites.includes(dishId);

      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('dish_id', dishId);

        if (error) throw error;

        setFavorites(prev => prev.filter(id => id !== dishId));
        toast({
          title: "Removido dos favoritos",
          description: "Prato removido da sua lista de favoritos",
        });
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, dish_id: dishId });

        if (error) throw error;

        setFavorites(prev => [...prev, dishId]);
        toast({
          title: "Adicionado aos favoritos",
          description: "Prato adicionado à sua lista de favoritos",
        });
      }
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o favorito",
        variant: "destructive",
      });
    }
  };

  const isFavorite = (dishId: string) => favorites.includes(dishId);

  return {
    dishes,
    loading,
    hasMore,
    totalCount,
    loadMore,
    reset,
    isFavorite,
    toggleFavorite
  };
};
