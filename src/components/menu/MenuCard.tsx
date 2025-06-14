
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Plus, Minus, Star, Clock, ChefHat } from "lucide-react";
import { Dish } from "@/types/dish";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useFirstOrder } from "@/hooks/use-first-order";

type MenuCardProps = {
  dish: Dish;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

const MenuCard = ({ dish, isFavorite = false, onToggleFavorite }: MenuCardProps) => {
  const { user } = useAuth();
  const { addItem, removeItem, items } = useCart();
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  const { toast } = useToast();
  const { isFirstOrder } = useFirstOrder();

  // Ensure price is always a number
  const dishPrice = typeof dish.price === 'string' ? parseFloat(dish.price) || 0 : (dish.price || 0);
  
  // Count how many of this dish is in the cart
  const itemInCart = items.find((item) => item.id === dish.id);
  const quantity = itemInCart ? itemInCart.quantity : 0;

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para adicionar aos favoritos.",
        variant: "destructive",
      });
      return;
    }

    if (onToggleFavorite) {
      onToggleFavorite();
      return;
    }

    setIsAddingToFavorites(true);
    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("dish_id", dish.id);

        if (error) throw error;

        toast({
          title: "Removido dos favoritos",
          description: `${dish.name} foi removido dos seus favoritos`,
        });
      } else {
        // Add to favorites
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          dish_id: dish.id,
        });

        if (error) throw error;

        toast({
          title: "Adicionado aos favoritos",
          description: `${dish.name} foi adicionado aos seus favoritos`,
        });
      }
    } catch (error: any) {
      console.error("Erro ao modificar favoritos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível modificar os favoritos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: dish.id,
      name: dish.name,
      price: dishPrice,
      image: dish.image_url || "/placeholder.svg"
    });

    if (isFirstOrder && quantity === 0) {
      toast({
        title: "Adicionado ao carrinho!",
        description: "Lembre-se: use o código PRIMEIRO10 para 10% de desconto no seu primeiro pedido.",
        duration: 4000,
      });
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-gray-100">
      <div className="relative">
        <img
          src={dish.image_url || "/placeholder.svg"}
          alt={dish.name}
          className="w-full h-56 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        
        {/* Overlay with quick info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>15-20 min</span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-1">
              <ChefHat className="w-4 h-4" />
              <span>Receita tradicional</span>
            </div>
          </div>
        </div>

        {/* Favorite button */}
        <button
          onClick={handleToggleFavorite}
          disabled={isAddingToFavorites}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg transition-all duration-300 hover:bg-white hover:scale-110"
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"
            }`}
          />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {dish.promotion && (
            <Badge className="bg-red-500 text-white shadow-lg animate-pulse">
              {dish.promotion.label || "Promoção"}
            </Badge>
          )}
          {dish.popular && (
            <Badge className="bg-cantinho-terracotta text-white shadow-lg">
              <Star className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}
          {isFirstOrder && (
            <Badge className="bg-green-500 text-white shadow-lg">
              10% OFF
            </Badge>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <h3 className="font-bold text-xl mb-2 text-cantinho-navy line-clamp-1">
            {dish.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
            {dish.description}
          </p>
          
          {/* Tags */}
          {dish.tags && dish.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {dish.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-cantinho-cream/50 border-cantinho-terracotta/30">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-bold text-xl text-cantinho-navy">
              {dishPrice.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
            </span>
            {isFirstOrder && (
              <span className="text-sm text-green-600 font-medium">
                Com desconto: {(dishPrice * 0.9).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {quantity > 0 && (
              <>
                <Button
                  onClick={() => removeItem(dish.id)}
                  size="sm"
                  variant="outline"
                  className="h-10 w-10 p-0 border-cantinho-navy text-cantinho-navy hover:bg-cantinho-navy hover:text-white"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-bold text-lg w-8 text-center text-cantinho-navy">
                  {quantity}
                </span>
              </>
            )}
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="h-10 w-10 p-0 bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* First order message */}
        {isFirstOrder && quantity === 0 && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-700 text-center font-medium">
              Primeiro pedido? Ganhe 10% de desconto!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCard;
