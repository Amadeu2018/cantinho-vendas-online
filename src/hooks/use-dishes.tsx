
import { useState } from "react";

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  image_url?: string; // Adicionando para compatibilidade
  category?: string;
  tags?: string[];
  popular?: boolean;
  promotion?: {
    discount: number;
    label?: string;
  };
}

export const useDishes = () => {
  const [dishes] = useState<Dish[]>([
    {
      id: "1",
      name: "Feijoada Completa",
      description: "Tradicional feijoada brasileira com todas as carnes e acompanhamentos",
      price: 15.9,
      image: "/placeholder.svg",
      image_url: "/placeholder.svg", // Adicionando para compatibilidade
      category: "Principal",
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
      category: "Principal",
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
      category: "Carnes",
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
      category: "Petiscos",
      tags: ["Salgados"]
    },
    {
      id: "5",
      name: "Mousse de Maracujá",
      description: "Sobremesa cremosa de maracujá com calda fresca",
      price: 6.9,
      image: "/placeholder.svg",
      image_url: "/placeholder.svg",
      category: "Sobremesas",
      tags: ["Doces"]
    },
    {
      id: "6",
      name: "Caipirinha",
      description: "Drink tradicional brasileiro com limão, cachaça e açúcar",
      price: 8.5,
      image: "/placeholder.svg",
      image_url: "/placeholder.svg",
      category: "Bebidas",
      tags: ["Alcoólico"]
    }
  ]);

  // Simulando carregamento e favoritos
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

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

// Exportando as interfaces/tipos que serão usadas em outros componentes
export default useDishes;
