
import React from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Flame, Leaf } from "lucide-react";

interface MenuCardContentProps {
  name: string;
  category: string;
  description: string;
  price: number;
  finalPrice: number;
  savings: number;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isFirstOrder: boolean;
  onAddToCart: () => void;
}

const MenuCardContent = ({
  name,
  category,
  description,
  price,
  finalPrice,
  savings,
  isSpicy,
  isVegetarian,
  isFirstOrder,
  onAddToCart
}: MenuCardContentProps) => {
  return (
    <CardContent className="p-6 bg-gradient-to-br from-white to-gray-50/30">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-cantinho-navy transition-colors">
            {name}
          </h3>
          <p className="text-xs text-cantinho-terracotta font-medium uppercase tracking-wide mb-2">
            {category}
          </p>
        </div>
        <div className="flex gap-1">
          {isSpicy && (
            <Badge variant="secondary" className="bg-red-100 text-red-600 border-red-200">
              <Flame className="w-3 h-3" />
            </Badge>
          )}
          {isVegetarian && (
            <Badge variant="secondary" className="bg-green-100 text-green-600 border-green-200">
              <Leaf className="w-3 h-3" />
            </Badge>
          )}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          {isFirstOrder && savings > 0 ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-cantinho-navy">
                  {finalPrice.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                </span>
                <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2 py-1">
                  Primeiro pedido!
                </Badge>
              </div>
              <span className="text-sm text-gray-500 line-through">
                {price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-cantinho-navy">
              {price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
            </span>
          )}
        </div>

        <Button 
          onClick={onAddToCart}
          className="bg-gradient-to-r from-cantinho-terracotta to-cantinho-sand hover:from-cantinho-sand hover:to-cantinho-terracotta text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Adicionar
        </Button>
      </div>
    </CardContent>
  );
};

export default MenuCardContent;
