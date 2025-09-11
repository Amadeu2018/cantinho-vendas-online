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
  promotion?: {
    discount: number;
    label?: string;
  };
}

interface MenuCardProps {
  dish: Dish;
}

const MenuCard = ({ dish }: MenuCardProps) => {
  const { toast } = useToast();
  const { addItem, isFavorite, addToFavorites, removeFromFavorites } =
    useCart();
  const { isFirstOrder, discount } = useFirstOrder();

  const isFav = isFavorite(parseInt(dish.id));
  
  // Calculate price with promotions
  let promotionalPrice = dish.price;
  if (dish.promotion && dish.promotion.discount > 0) {
    promotionalPrice = dish.price * (1 - dish.promotion.discount / 100);
  }
  
  const finalPrice = isFirstOrder ? promotionalPrice * (1 - discount) : promotionalPrice;
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
        description: `Você economizou ${savings.toLocaleString("pt-AO", {
          style: "currency",
          currency: "AOA",
        })} neste prato! 🎉`,
      });
    }
  };

  const toggleFavorite = () => {
    if (isFav) {
      removeFromFavorites(parseInt(dish.id));
    } else {
      addToFavorites(parseInt(dish.id));
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.03] border border-gray-100 bg-white flex flex-col h-full rounded-xl backdrop-blur-sm hover:border-cantinho-terracotta/20">
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

      <div className="flex-grow flex flex-col p-1">
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
          promotion={dish.promotion}
          onAddToCart={handleAddToCart}
        />
      </div>
    </Card>
  );
};

export default MenuCard;
