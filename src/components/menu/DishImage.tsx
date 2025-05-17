
import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Dish } from '@/types/dish';

type DishImageProps = {
  dish: Dish;
  isLiked: boolean;
  onToggleFavorite: () => void;
};

const DishImage: React.FC<DishImageProps> = ({ dish, isLiked, onToggleFavorite }) => {
  return (
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
          onClick={onToggleFavorite}
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
  );
};

export default DishImage;
