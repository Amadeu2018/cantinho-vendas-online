
import React from "react";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useFirstOrder } from "@/hooks/use-first-order";
import { useToast } from "@/hooks/use-toast";
import MenuCardImage from "./MenuCardImage";
import MenuCardContent from "./MenuCardContent";

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  prepTime?: string;
  serves?: number;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isPopular?: boolean;
}

interface MenuCardProps {
  dish: Dish;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const MenuCard = ({ dish, isFavorite: propIsFavorite, onToggleFavorite: propOnToggleFavorite }: MenuCardProps) => {
  const { toast } = useToast();
  const { addItem, isFavorite, addToFavorites, removeFromFavorites } = useCart();
  const { isFirstOrder, discount } = useFirstOrder();
  
  // Use prop values if provided, otherwise use cart context
  const isFav = propIsFavorite !== undefined ? propIsFavorite : isFavorite(parseInt(dish.id));
  const finalPrice = isFirstOrder ? dish.price * (1 - discount) : dish.price;
  const savings = dish.price - finalPrice;

  const handleAddToCart = () => {
    addItem({
      id: parseInt(dish.id),
      name: dish.name,
      price: finalPrice,
      image: dish.image,
    });

    if (isFirstOrder && savings > 0) {
      toast({
        title: "Primeiro pedido!",
        description: `Você economizou ${savings.toLocaleString('pt-AO', { 
          style: 'currency', 
          currency: 'AOA' 
        })} neste prato! 🎉`,
      });
    }
  };

  const toggleFavorite = () => {
    if (propOnToggleFavorite) {
      propOnToggleFavorite();
    } else {
      if (isFav) {
        removeFromFavorites(parseInt(dish.id));
      } else {
        addToFavorites(parseInt(dish.id));
      }
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-0 bg-white">
      <MenuCardImage
        image={dish.image}
        name={dish.name}
        isPopular={dish.isPopular}
        isFirstOrder={isFirstOrder}
        isFav={isFav}
        rating={dish.rating}
        prepTime={dish.prepTime}
        serves={dish.serves}
        onToggleFavorite={toggleFavorite}
      />

      <MenuCardContent
        name={dish.name}
        category={dish.category}
        description={dish.description}
        price={dish.price}
        finalPrice={finalPrice}
        savings={savings}
        isSpicy={dish.isSpicy}
        isVegetarian={dish.isVegetarian}
        isFirstOrder={isFirstOrder}
        onAddToCart={handleAddToCart}
      />
    </Card>
  );
};

export default MenuCard;
