
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dish } from "@/types/dish";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useDishes = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchDishes();
    if (user) {
      fetchUserFavorites();
    } else {
      // Load favorites from local storage for non-authenticated users
      const savedFavorites = localStorage.getItem('dish_favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, [user]);

  const fetchUserFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('dish_id')
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error fetching user favorites:", error);
        return;
      }
      
      if (data) {
        const favoriteIds = data.map(fav => fav.dish_id);
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const fetchDishes = async () => {
    try {
      setLoading(true);
      console.log("Fetching dishes from Supabase...");
      
      // Fetch products from Supabase with category information
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name
          )
        `);
      
      if (productsError) {
        throw productsError;
      }
      
      console.log("Fetched products:", productsData);
      
      // Fetch active promotions
      const now = new Date().toISOString();
      const { data: promotionsData, error: promotionsError } = await supabase
        .from('promotions')
        .select('*')
        .lte('start_date', now)
        .gte('end_date', now);
      
      if (promotionsError) {
        console.error("Error fetching promotions:", promotionsError);
      }
      
      console.log("Fetched promotions:", promotionsData);
      
      // Create a map of product_id to promotion
      const promotionsMap: Record<string, { discount: number, label?: string }> = {};
      if (promotionsData) {
        promotionsData.forEach((promo: any) => {
          if (promo.product_id) {
            promotionsMap[promo.product_id] = {
              discount: promo.discount_percentage || 10,
              label: `${promo.discount_percentage}% OFF`
            };
          }
        });
      }
      
      if (productsData && productsData.length > 0) {
        // Map to the Dish format
        const mappedDishes: Dish[] = productsData.map((product: any) => {
          // Determine category from categories relation or fallback
          let category: 'appetizer' | 'main' | 'dessert' = 'main';
          
          if (product.categories && typeof product.categories === 'object') {
            const categoryName = product.categories.name?.toLowerCase() || '';
            
            if (categoryName.includes('entrada') || categoryName.includes('appetizer')) {
              category = 'appetizer';
            } else if (categoryName.includes('sobremesa') || categoryName.includes('doce') || categoryName.includes('dessert')) {
              category = 'dessert';
            } else {
              category = 'main';
            }
          }
          
          // Ensure price is always a number
          const price = typeof product.price === 'string' 
            ? parseFloat(product.price) 
            : (typeof product.price === 'number' ? product.price : 0);
          
          // Check if the product has a promotion
          const promotion = product.id && product.id in promotionsMap 
            ? promotionsMap[product.id] 
            : undefined;
          
          return {
            id: product.id,
            name: product.name,
            description: product.description || '',
            price: price,
            image_url: product.image_url || '/placeholder.svg',
            category,
            popular: Math.random() > 0.7, // Random for demo, ideally this would be a field in the database
            tags: [],
            promotion
          };
        });
        
        console.log("Mapped dishes:", mappedDishes);
        setDishes(mappedDishes);
      } else {
        console.log("No products found, using fallback data");
        // Fallback to static data if no products found
        setDishes(getFallbackDishes());
        
        // Show a toast to inform the user
        toast({
          title: "Dados de demonstração",
          description: "Usando dados de exemplo. Adicione produtos no painel de administração.",
        });
      }
    } catch (error) {
      console.error("Error fetching dishes:", error);
      // Fallback to static data in case of error
      setDishes(getFallbackDishes());
      
      // Show a toast to inform the user
      toast({
        title: "Erro ao carregar produtos",
        description: "Usando dados de exemplo. Verifique a conexão com o banco de dados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Function to get fallback dishes in case of error
  const getFallbackDishes = (): Dish[] => {
    return [
      {
        id: "1",
        name: "Feijoada Completa",
        description: "Tradicional feijoada brasileira com todas as carnes e acompanhamentos",
        price: 15.9,
        image_url: "/placeholder.svg",
        category: "main",
        tags: ["Brasileiro", "Tradicional"],
        popular: true,
        promotion: { discount: 10 }
      },
      {
        id: "2",
        name: "Moqueca de Peixe",
        description: "Peixe fresco preparado com leite de coco, dendê, tomate e pimentão",
        price: 18.5,
        image_url: "/placeholder.svg",
        category: "main",
        tags: ["Frutos do Mar", "Especialidade"],
        popular: true
      },
      {
        id: "3",
        name: "Picanha na Brasa",
        description: "Corte nobre de picanha grelhada, acompanhada de vinagrete e farofa",
        price: 24.9,
        image_url: "/placeholder.svg",
        category: "main",
        tags: ["Churrasco"],
        popular: true
      },
      {
        id: "4",
        name: "Coxinha",
        description: "Tradicional salgado brasileiro recheado com frango desfiado",
        price: 3.5,
        image_url: "/placeholder.svg",
        category: "appetizer",
        tags: ["Salgados"]
      },
      {
        id: "5",
        name: "Mousse de Maracujá",
        description: "Sobremesa cremosa de maracujá com calda fresca",
        price: 6.9,
        image_url: "/placeholder.svg",
        category: "dessert",
        tags: ["Doces"]
      }
    ];
  };
  
  const featuredDishes = dishes.filter(dish => dish.popular);
  
  const isFavorite = (dishId: string) => favorites.includes(dishId);
  
  const toggleFavorite = async (dishId: string) => {
    if (user) {
      // For authenticated users, save to database
      try {
        if (favorites.includes(dishId)) {
          // Remove from favorites
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('dish_id', dishId);
          
          if (error) throw error;
          
          setFavorites(prev => prev.filter(id => id !== dishId));
          
          toast({
            title: "Removido dos favoritos",
            description: "Item removido dos seus favoritos.",
            variant: "default"
          });
        } else {
          // Add to favorites
          const { error } = await supabase
            .from('favorites')
            .insert([{ user_id: user.id, dish_id: dishId }]);
          
          if (error) throw error;
          
          setFavorites(prev => [...prev, dishId]);
          
          toast({
            title: "Adicionado aos favoritos",
            description: "Item adicionado aos seus favoritos.",
            variant: "default"
          });
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar favoritos.",
          variant: "destructive"
        });
      }
    } else {
      // For non-authenticated users, save to localStorage
      let newFavorites: string[];
      if (favorites.includes(dishId)) {
        newFavorites = favorites.filter(id => id !== dishId);
      } else {
        newFavorites = [...favorites, dishId];
      }
      setFavorites(newFavorites);
      
      // Save to localStorage for persistence
      localStorage.setItem('dish_favorites', JSON.stringify(newFavorites));
    }
  };

  return { 
    dishes, 
    featuredDishes, 
    loading, 
    isFavorite, 
    toggleFavorite,
    refetch: fetchDishes
  };
};

export default useDishes;
