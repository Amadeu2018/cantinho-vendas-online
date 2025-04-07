
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  image_url?: string; 
  category?: string;
  tags?: string[];
  popular?: boolean;
  promotion?: {
    discount: number;
    label?: string;
  };
}

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
      
      // Fetch products from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Map to the Dish format
        const mappedDishes: Dish[] = data.map(product => {
          // Determine category from categories relation or fallback
          let category = 'main';
          if (product.categories && product.categories.name) {
            const categoryName = product.categories.name.toLowerCase();
            if (categoryName.includes('entrada')) {
              category = 'appetizer';
            } else if (categoryName.includes('sobremesa') || categoryName.includes('doce')) {
              category = 'dessert';
            } else {
              category = 'main';
            }
          }
          
          return {
            id: product.id,
            name: product.name,
            description: product.description || '',
            price: Number(product.price) || 0,
            image: product.image_url || '/placeholder.svg',
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
          image: "/placeholder.svg",
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
          image: "/placeholder.svg",
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
          image: "/placeholder.svg",
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
          image: "/placeholder.svg",
          image_url: "/placeholder.svg",
          category: "appetizer",
          tags: ["Salgados"]
        },
        {
          id: "5",
          name: "Mousse de Maracujá",
          description: "Sobremesa cremosa de maracujá com calda fresca",
          price: 6.9,
          image: "/placeholder.svg",
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
