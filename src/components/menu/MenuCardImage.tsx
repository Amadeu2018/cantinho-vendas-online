
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Clock, Users } from "lucide-react";

interface MenuCardImageProps {
  image: string;
  name: string;
  isPopular?: boolean;
  isFirstOrder: boolean;
  isFav: boolean;
  rating?: number;
  prepTime?: string;
  serves?: number;
  onToggleFavorite: () => void;
}

const MenuCardImage = ({ 
  image, 
  name, 
  isPopular, 
  isFirstOrder, 
  isFav, 
  rating, 
  prepTime, 
  serves, 
  onToggleFavorite 
}: MenuCardImageProps) => {
  return (
    <div className="relative overflow-hidden">
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        {isPopular && (
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

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200"
        onClick={onToggleFavorite}
      >
        <Heart 
          className={`h-4 w-4 transition-colors ${
            isFav ? "fill-red-500 text-red-500" : "text-gray-600"
          }`} 
        />
      </Button>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
        <div className="flex items-center justify-between text-white text-xs">
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{rating}</span>
            </div>
          )}
          {prepTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{prepTime}</span>
            </div>
          )}
          {serves && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{serves} pessoas</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCardImage;
