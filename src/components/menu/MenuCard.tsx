
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from '@/contexts/CartContext';
import { Dish } from '@/types/dish';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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

  useEffect(() => {
    if (!onToggleFavorite) {
      const checkIfLiked = async () => {
        if (!user) return;
        
        try {
          const { data, error } = await supabase
            .from('favorites')
            .select('dish_id')
            .eq('user_id', user.id)
            .eq('dish_id', dish.id)
            .single();
          
          if (!error && data) {
            setIsLiked(true);
          }
        } catch (error) {
          console.error('Erro ao verificar favorito:', error);
        }
      };
      
      checkIfLiked();
    }
  }, [dish.id, user, onToggleFavorite]);

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
    
    if (!user) {
      toast({
        title: "Não autenticado",
        description: "Faça login para adicionar aos favoritos.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (isLiked) {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('dish_id', dish.id);
          
        setIsLiked(false);
        toast({
          title: "Removido dos favoritos",
          description: `${dish.name} foi removido dos seus favoritos.`,
          variant: "default"
        });
      } else {
        // Add to favorites
        await supabase
          .from('favorites')
          .insert([
            { user_id: user.id, dish_id: dish.id }
          ]);
          
        setIsLiked(true);
        toast({
          title: "Adicionado aos favoritos",
          description: `${dish.name} foi adicionado aos seus favoritos.`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seus favoritos.",
        variant: "destructive"
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
