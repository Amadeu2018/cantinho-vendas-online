
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, Minus } from "lucide-react";
import { Dish } from "@/types/dish";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

  // Ensure price is always a number - dish.price is already a number according to Dish type
  const dishPrice = dish.price;
  
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

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transform transition-transform hover:scale-[1.02]">
      <div className="relative">
        <img
          src={dish.image_url || "/placeholder.svg"}
          alt={dish.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleToggleFavorite}
          disabled={isAddingToFavorites}
          className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md transition-colors hover:bg-gray-100"
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
        {dish.promotion && (
          <Badge className="absolute bottom-2 left-2 bg-cantinho-terracotta">
            Destaque
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{dish.name}</h3>
        <p className="text-gray-700 text-sm mb-2 line-clamp-2">
          {dish.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-cantinho-navy">
            {dishPrice.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
          </span>
          <div className="flex items-center gap-2">
            {quantity > 0 && (
              <>
                <button
                  onClick={() => removeItem(dish.id)}
                  className="bg-cantinho-navy text-white p-1 rounded-full"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-medium w-5 text-center">{quantity}</span>
              </>
            )}
            <button
              onClick={() => addItem({
                id: dish.id,
                name: dish.name,
                price: dishPrice,
                image: dish.image_url || "/placeholder.svg",
                quantity: 1,
              })}
              className="bg-cantinho-navy text-white p-1 rounded-full"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
