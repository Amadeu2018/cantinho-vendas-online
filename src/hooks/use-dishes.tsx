
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dish } from "@/types/dish";

// Remove the duplicate interface since we're importing the type
export const useDishes = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      setLoading(true);
      
      // Fetch products from Supabase with a specific relationship hint to resolve ambiguity
      const { data, error } = await supabase
        .from('products')
        .select('*, categories:category_id(id, name)');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Map to the Dish format
        const mappedDishes: Dish[] = data.map(product => {
          // Determine category from categories relation or fallback
          let category: 'appetizer' | 'main' | 'dessert' = 'main';
          
          if (product.categories && typeof product.categories === 'object') {
            // Safely access the name property with type checking
            const categoryObj = product.categories as { name?: string } | null;
            const categoryName = categoryObj?.name?.toLowerCase() || '';
            
            if (categoryName.includes('entrada')) {
              category = 'appetizer';
            } else if (categoryName.includes('sobremesa') || categoryName.includes('doce')) {
              category = 'dessert';
            } else {
              category = 'main';
            }
          }
          
          // Ensure price is always a number
          const price = typeof product.price === 'string' 
            ? parseFloat(product.price) 
            : (typeof product.price === 'number' ? product.price : 0);
          
          return {
            id: product.id,
            name: product.name,
            description: product.description || '',
            price: price,
            image_url: product.image_url || '/placeholder.svg',
            category,
            popular: Math.random() > 0.7, // Just for demo - some random items are popular
            tags: []
          };
        });
        
        setDishes(mappedDishes);
      }
    } catch (error) {
      console.error("Error fetching dishes:", error);
      // Fallback to static data in case of error
      setDishes([
        {
          id: "1",
          name: "Feijoada Completa",
          description: "Tradicional feijoada brasileira com todas as carnes e acompanhamentos",
          price: 15.9,
          image_url: "/placeholder.svg",
          category: "main",
          tags: ["Brasileiro", "Tradicional"],
          popular: true
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
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const featuredDishes = dishes.filter(dish => dish.popular);
  
  const isFavorite = (dishId: string) => favorites.includes(dishId);
  
  const toggleFavorite = (dishId: string) => {
    if (favorites.includes(dishId)) {
      setFavorites(favorites.filter(id => id !== dishId));
    } else {
      setFavorites([...favorites, dishId]);
    }
  };

  return { 
    dishes, 
    featuredDishes, 
    loading, 
    isFavorite, 
    toggleFavorite 
  };
};

export default useDishes;
