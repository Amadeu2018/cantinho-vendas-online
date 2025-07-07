
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dish } from "@/types/dish";

export const useDishes = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchDishes();
    fetchFavorites();
  }, []);

  const fetchDishes = async () => {
    try {
      setLoading(true);
      
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          categories:categories!products_category_id_fkey(name),
          promotions:promotions!promotions_product_id_fkey(discount_percentage, start_date, end_date)
        `);

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

        setDishes(formattedDishes);
      }
    } catch (error: any) {
      console.error('Erro ao buscar pratos:', error);
      
      // Fallback com dados mock
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
          promotion: {
            discount: 15
          },
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
        {
          id: "3",
          name: "Caldo Verde",
          description: "Sopa tradicional portuguesa com couve, batata e chouriço.",
          price: 800,
          image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3",
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3",
          category: "main",
          tags: ["sopa", "tradicional"],
          popular: true,
          rating: 4.4,
          prepTime: '15-20 min',
          serves: 1,
          isSpicy: false,
          isVegetarian: false,
          isPopular: true
        },
        {
          id: "4",
          name: "Pastéis de Nata",
          description: "Deliciosos pastéis de nata com canela e açúcar em pó.",
          price: 150,
          image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3",
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3",
          category: "appetizer",
          tags: ["doce", "tradicional"],
          popular: false,
          rating: 4.9,
          prepTime: '5 min',
          serves: 1,
          isSpicy: false,
          isVegetarian: true,
          isPopular: false
        },
        {
          id: "5",
          name: "Pudim Flan",
          description: "Sobremesa cremosa com calda de caramelo.",
          price: 450,
          image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3",
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3",
          category: "dessert",
          tags: ["doce", "sobremesa"],
          popular: false,
          rating: 4.3,
          prepTime: '10 min',
          serves: 2,
          isSpicy: false,
          isVegetarian: true,
          isPopular: false
        }
      ];
      
      setDishes(mockDishes);
      
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
    isFavorite,
    toggleFavorite,
    refetch: fetchDishes
  };
};
