
import React from 'react';
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
  quantity, 
  onIncrease, 
  onDecrease 
}) => {
  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={onDecrease}
        disabled={quantity <= 1}
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <span className="w-8 text-center font-medium">{quantity}</span>
      
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={onIncrease}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuantitySelector;
