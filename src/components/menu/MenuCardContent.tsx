
import React from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Flame, Leaf } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";

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
  promotion?: {
    discount: number;
    label?: string;
  };
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
  promotion,
  onAddToCart
}: MenuCardContentProps) => {
  const { formatPrice } = useCurrency();
  return (
    <CardContent className="p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50/30 flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-1 group-hover:text-cantinho-navy transition-colors line-clamp-2">
            {name}
          </h3>
          <p className="text-xs text-cantinho-terracotta font-medium uppercase tracking-wide mb-2">
            {category}
          </p>
        </div>
        <div className="flex gap-1 ml-2 flex-shrink-0">
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

      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
        {description}
      </p>

      <div className="flex items-end justify-between mt-auto pt-2">
        <div className="flex flex-col justify-end">
          {(promotion && promotion.discount > 0) || (isFirstOrder && savings > 0) ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg sm:text-xl font-bold text-cantinho-navy">
                  {formatPrice(finalPrice)}
                </span>
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1">
                  {promotion && promotion.discount > 0 ? 
                    `${promotion.discount}% OFF` : 
                    '-10%'
                  }
                </Badge>
              </div>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(price)}
              </span>
              {promotion && promotion.label && (
                <span className="text-xs text-green-600 font-medium">
                  {promotion.label}
                </span>
              )}
            </>
          ) : (
            <span className="text-lg sm:text-xl font-bold text-cantinho-navy">
              {formatPrice(price)}
            </span>
          )}
        </div>

        <Button 
          onClick={onAddToCart}
          className="bg-gradient-to-r from-cantinho-terracotta to-cantinho-sand hover:from-cantinho-sand hover:to-cantinho-terracotta text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ml-3 flex-shrink-0"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span className="hidden xs:inline">Adicionar</span>
          <span className="xs:hidden">+</span>
        </Button>
      </div>
    </CardContent>
  );
};

export default MenuCardContent;
