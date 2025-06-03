
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dish } from "@/types/dish";
import { useToast } from "@/hooks/use-toast";

export const useDishes = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchDishes();
    // Load favorites from local storage if available
    const savedFavorites = localStorage.getItem('dish_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const fetchDishes = async () => {
    try {
      setLoading(true);
      console.log("Fetching dishes from Supabase...");
      
      // Fetch products from Supabase with better error handling
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*, categories(id, name)');
      
      if (productsError) {
        console.error("Error fetching products:", productsError);
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
        // Continue without promotions
      }
      
      console.log("Fetched promotions:", promotionsData);
      
      // Create a map of product_id to promotion
      const promotionsMap: Record<string, { discount: number, label?: string }> = {};
      if (promotionsData && Array.isArray(promotionsData)) {
        promotionsData.forEach((promo: any) => {
          if (promo && promo.product_id) {
            promotionsMap[promo.product_id] = {
              discount: Number(promo.discount_percentage) || 10,
              label: `${promo.discount_percentage || 10}% OFF`
            };
          }
        });
      }
      
      if (productsData && Array.isArray(productsData) && productsData.length > 0) {
        // Map to the Dish format with proper null checks
        const mappedDishes: Dish[] = productsData.map((product: any) => {
          // Determine category from categories relation or fallback
          let category: 'appetizer' | 'main' | 'dessert' = 'main';
          
          if (product.categories && typeof product.categories === 'object' && product.categories !== null) {
            const categoryName = (product.categories.name || '').toLowerCase();
            
            if (categoryName.includes('entrada')) {
              category = 'appetizer';
            } else if (categoryName.includes('sobremesa') || categoryName.includes('doce')) {
              category = 'dessert';
            } else {
              category = 'main';
            }
          }
          
          // Ensure price is always a number with null safety
          const price = product.price ? 
            (typeof product.price === 'string' ? parseFloat(product.price) : Number(product.price)) 
            : 0;
          
          // Check if the product has a promotion
          const promotion = product.id && promotionsMap[product.id] 
            ? promotionsMap[product.id] 
            : undefined;
          
          return {
            id: product.id || '',
            name: product.name || 'Produto sem nome',
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
    } catch (error: any) {
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
  
  const toggleFavorite = (dishId: string) => {
    let newFavorites: string[];
    if (favorites.includes(dishId)) {
      newFavorites = favorites.filter(id => id !== dishId);
    } else {
      newFavorites = [...favorites, dishId];
    }
    setFavorites(newFavorites);
    
    // Save to localStorage for persistence
    localStorage.setItem('dish_favorites', JSON.stringify(newFavorites));
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
