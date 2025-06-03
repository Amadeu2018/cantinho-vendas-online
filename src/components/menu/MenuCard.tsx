
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from '@/contexts/CartContext';
import { Dish } from '@/types/dish';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import DishImage from './DishImage';
import DishDetails from './DishDetails';
import { formatPrice } from '@/utils/formatter';

type MenuCardProps = {
  dish: Dish;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

const MenuCard = ({ dish, isFavorite = false, onToggleFavorite }: MenuCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(isFavorite);
  const { addItem } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    setIsLiked(isFavorite);
  }, [isFavorite]);

  const handleAddToCart = () => {
    addItem({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity,
      image: dish.image_url || ''
    });
    
    toast({
      title: "Item adicionado",
      description: `${dish.name} foi adicionado ao carrinho.`,
      variant: "default"
    });
  };

  const toggleFavorite = async () => {
    if (onToggleFavorite) {
      onToggleFavorite();
      return;
    }
    
    // If no onToggleFavorite function is provided, just update local state
    setIsLiked(!isLiked);
    
    if (!user) {
      toast({
        title: "Salvo localmente",
        description: `${dish.name} foi ${!isLiked ? 'adicionado aos' : 'removido dos'} favoritos.`,
        variant: "default"
      });
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <DishImage 
        dish={dish} 
        isLiked={isLiked} 
        onToggleFavorite={toggleFavorite} 
      />
      
      <CardContent className="p-0">
        <DishDetails
          dish={dish}
          quantity={quantity}
          onIncrease={() => setQuantity(quantity + 1)}
          onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
          onAddToCart={handleAddToCart}
          formatPrice={formatPrice}
        />
      </CardContent>
    </Card>
  );
};

export default MenuCard;
