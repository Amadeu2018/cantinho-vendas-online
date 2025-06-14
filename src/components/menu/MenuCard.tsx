import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useFirstOrder } from "@/hooks/use-first-order";
import { Heart, Plus, Star, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Dish {
  id: number;
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
}

const MenuCard = ({ dish }: MenuCardProps) => {
  const { toast } = useToast();
  const { addItem, isFavorite, addToFavorites, removeFromFavorites } = useCart();
  const { isFirstOrder, discount } = useFirstOrder();
  
  const isFav = isFavorite(dish.id);
  const finalPrice = isFirstOrder ? dish.price * (1 - discount) : dish.price;
  const savings = dish.price - finalPrice;

  const handleAddToCart = () => {
    addItem({
      id: dish.id,
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
    if (isFav) {
      removeFromFavorites(dish.id);
    } else {
      addToFavorites(dish.id);
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-0 bg-white">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {dish.isPopular && (
            <Badge className="bg-red-500 text-white px-2 py-1 text-xs">
              🔥 Popular
            </Badge>
          )}
          {isFirstOrder && (
            <Badge className="bg-green-500 text-white px-2 py-1 text-xs animate-pulse">
              -10% Primeiro Pedido
            </Badge>
          )}
        </div>

        {/* Favorite button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200"
          onClick={toggleFavorite}
        >
          <Heart 
            className={`h-4 w-4 transition-colors ${
              isFav ? "fill-red-500 text-red-500" : "text-gray-600"
            }`} 
          />
        </Button>

        {/* Quick info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <div className="flex items-center justify-between text-white text-xs">
            {dish.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{dish.rating}</span>
              </div>
            )}
            {dish.prepTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{dish.prepTime}</span>
              </div>
            )}
            {dish.serves && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{dish.serves} pessoas</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title and category */}
        <div className="space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-lg text-cantinho-navy leading-tight group-hover:text-cantinho-terracotta transition-colors">
              {dish.name}
            </h3>
            <div className="flex gap-1">
              {dish.isSpicy && <span className="text-red-500 text-sm">🌶️</span>}
              {dish.isVegetarian && <span className="text-green-500 text-sm">🌱</span>}
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {dish.category}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {dish.description}
        </p>

        {/* Price and discount */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {isFirstOrder && savings > 0 ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600">
                      {finalPrice.toLocaleString('pt-AO', { 
                        style: 'currency', 
                        currency: 'AOA' 
                      })}
                    </span>
                    <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0.5">
                      -10%
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 line-through">
                    {dish.price.toLocaleString('pt-AO', { 
                      style: 'currency', 
                      currency: 'AOA' 
                    })}
                  </div>
                </div>
              ) : (
                <span className="text-lg font-bold text-cantinho-navy">
                  {dish.price.toLocaleString('pt-AO', { 
                    style: 'currency', 
                    currency: 'AOA' 
                  })}
                </span>
              )}
            </div>
          </div>

          {/* Add to cart button */}
          <Button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-cantinho-terracotta to-cantinho-terracotta/90 hover:from-cantinho-terracotta/90 hover:to-cantinho-terracotta text-white font-semibold py-2.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isFirstOrder && savings > 0 ? 'Adicionar com Desconto' : 'Adicionar ao Carrinho'}
          </Button>
        </div>

        {/* First order savings highlight */}
        {isFirstOrder && savings > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
            <p className="text-green-700 text-sm font-medium">
              🎉 Você economiza{' '}
              <span className="font-bold">
                {savings.toLocaleString('pt-AO', { 
                  style: 'currency', 
                  currency: 'AOA' 
                })}
              </span>
              {' '}no seu primeiro pedido!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MenuCard;
