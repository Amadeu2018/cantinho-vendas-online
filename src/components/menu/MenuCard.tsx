
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from '@/contexts/CartContext';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { Dish } from '@/types/dish';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type MenuCardProps = {
  dish: Dish;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

const MenuCard = ({ dish, isFavorite = false, onToggleFavorite }: MenuCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(isFavorite);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();

  React.useEffect(() => {
    setIsLiked(isFavorite);
  }, [isFavorite]);

  React.useEffect(() => {
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
    addToCart({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity,
      image: dish.image_url || ''
    });
    
    toast({
      title: "Item adicionado",
      description: `${dish.name} foi adicionado ao carrinho.`,
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
        variant: "destructive",
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
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seus favoritos.",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', { 
      style: 'currency', 
      currency: 'AOA',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <img
            src={dish.image_url || "/placeholder.svg"}
            alt={dish.name}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full bg-white ${isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
            onClick={toggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        {dish.category && (
          <Badge className="absolute bottom-2 left-2 bg-white/80 text-black hover:bg-white/70">
            {dish.category}
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{dish.name}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{dish.description}</p>
        
        <div className="flex items-center justify-between">
          <p className="font-bold text-lg">{formatPrice(dish.price)}</p>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <span className="w-8 text-center font-medium">{quantity}</span>
            
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Button 
          className="w-full mt-3 bg-cantinho-navy hover:bg-cantinho-navy/90"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </CardContent>
    </Card>
  );
};

export default MenuCard;
