
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Dish } from '@/types/dish';
import QuantitySelector from './QuantitySelector';

type DishDetailsProps = {
  dish: Dish;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onAddToCart: () => void;
  formatPrice: (price: number) => string;
};

const DishDetails: React.FC<DishDetailsProps> = ({ 
  dish, 
  quantity, 
  onIncrease, 
  onDecrease, 
  onAddToCart,
  formatPrice 
}) => {
  return (
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-1 line-clamp-1">{dish.name}</h3>
      <p className="text-gray-500 text-sm mb-3 line-clamp-2">{dish.description}</p>
      
      <div className="flex items-center justify-between">
        <p className="font-bold text-lg">{formatPrice(dish.price)}</p>
        <QuantitySelector 
          quantity={quantity} 
          onIncrease={onIncrease} 
          onDecrease={onDecrease} 
        />
      </div>
      
      <Button 
        className="w-full mt-3 bg-cantinho-navy hover:bg-cantinho-navy/90"
        onClick={onAddToCart}
      >
        <ShoppingBag className="h-4 w-4 mr-2" />
        Adicionar
      </Button>
    </div>
  );
};

export default DishDetails;
