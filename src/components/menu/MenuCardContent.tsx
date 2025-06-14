
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

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
  is

  isFirstOrder, 
  onAddToCart 
}: MenuCardContentProps) => {
  return (
    <div className="p-4 space-y-3">
      <div className="space-y-1">
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-lg text-cantinho-navy leading-tight group-hover:text-cantinho-terracotta transition-colors">
            {name}
          </h3>
          <div className="flex gap-1">
            {isSpicy && <span className="text-red-500 text-sm">🌶️</span>}
            {isVegetarian && <span className="text-green-500 text-sm">🌱</span>}
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {category}
        </Badge>
      </div>

      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
        {description}
      </p>

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
                  {price.toLocaleString('pt-AO', { 
                    style: 'currency', 
                    currency: 'AOA' 
                  })}
                </div>
              </div>
            ) : (
              <span className="text-lg font-bold text-cantinho-navy">
                {price.toLocaleString('pt-AO', { 
                  style: 'currency', 
                  currency: 'AOA' 
                })}
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={onAddToCart}
          className="w-full bg-gradient-to-r from-cantinho-terracotta to-cantinho-terracotta/90 hover:from-cantinho-terracotta/90 hover:to-cantinho-terracotta text-white font-semibold py-2.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isFirstOrder && savings > 0 ? 'Adicionar com Desconto' : 'Adicionar ao Carrinho'}
        </Button>
      </div>

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
    </div>
  );
};

export default MenuCardContent;
