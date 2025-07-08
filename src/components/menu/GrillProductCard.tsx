import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Users, Clock, Scale, Zap } from "lucide-react";
import { Dish, MeatDoneness, SaleUnit } from "@/types/dish";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import MenuCardImage from "./MenuCardImage";
import GrillCustomizationModal from "./GrillCustomizationModal";

interface GrillProductCardProps {
  dish: Dish;
}

const GrillProductCard = ({ dish }: GrillProductCardProps) => {
  const { toast } = useToast();
  const { addItem } = useCart();
  const [showCustomization, setShowCustomization] = useState(false);

  const getSaleUnitLabel = (unit: SaleUnit) => {
    switch (unit) {
      case 'kg': return 'por Kg';
      case 'combo': return 'Combo';
      case 'rodizio': return 'por pessoa';
      default: return 'unidade';
    }
  };

  const getSpiceLevelBadge = (level: number = 0) => {
    if (level === 0) return null;
    const spiceText = level <= 2 ? 'Suave' : level <= 4 ? 'Médio' : 'Picante';
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Zap className="h-3 w-3" />
        {spiceText}
      </Badge>
    );
  };

  const handleAddToCart = (customizations?: any) => {
    addItem({
      id: parseInt(dish.id),
      name: dish.name,
      price: dish.price,
      image: dish.image,
      customizations
    });

    toast({
      title: "Produto adicionado!",
      description: `${dish.name} foi adicionado ao carrinho`,
    });
  };

  const handleQuickAdd = () => {
    if (dish.meat_options && dish.meat_options.length > 0) {
      setShowCustomization(true);
    } else {
      handleAddToCart();
    }
  };

  return (
    <>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-0 bg-white flex flex-col h-full">
        <MenuCardImage
          image={dish.image}
          name={dish.name}
          isPopular={dish.isPopular}
          isFirstOrder={false}
          isFav={false}
          rating={dish.rating}
          prepTime={dish.prepTime}
          serves={dish.combo_serves || dish.serves}
          onToggleFavorite={() => {}}
        />

        <div className="flex-grow flex flex-col p-4">
          {/* Header com badges */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="flex items-center gap-1 text-cantinho-terracotta border-cantinho-terracotta">
              <Flame className="h-3 w-3" />
              Churrascaria
            </Badge>
            {getSpiceLevelBadge(dish.spice_level)}
          </div>

          {/* Nome e categoria */}
          <h3 className="font-bold text-lg text-cantinho-navy mb-1 line-clamp-2 group-hover:text-cantinho-terracotta transition-colors">
            {dish.name}
          </h3>
          
          <p className="text-sm text-cantinho-navy/70 mb-3 line-clamp-2">
            {dish.description}
          </p>

          {/* Informações específicas da churrascaria */}
          <div className="flex flex-wrap gap-2 mb-3">
            {dish.combo_serves && dish.combo_serves > 1 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {dish.combo_serves} pessoas
              </Badge>
            )}
            {dish.prep_time_minutes && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {dish.prep_time_minutes} min
              </Badge>
            )}
            {dish.sale_unit === 'kg' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Scale className="h-3 w-3" />
                Por Kg
              </Badge>
            )}
          </div>

          {/* Opções de carne disponíveis */}
          {dish.meat_options && dish.meat_options.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-cantinho-navy/60 mb-1">Pontos disponíveis:</p>
              <div className="flex flex-wrap gap-1">
                {dish.meat_options.map((option, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {option}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Preço e ação */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-2xl font-bold text-cantinho-navy">
                  {dish.price.toLocaleString('pt-AO', { 
                    style: 'currency', 
                    currency: 'AOA' 
                  })}
                </span>
                <span className="text-sm text-cantinho-navy/60 ml-1">
                  {getSaleUnitLabel(dish.sale_unit || 'unit')}
                </span>
              </div>
            </div>

            <Button 
              onClick={handleQuickAdd}
              className="w-full bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 text-white"
            >
              {dish.meat_options && dish.meat_options.length > 0 ? 'Personalizar' : 'Adicionar'}
            </Button>
          </div>
        </div>
      </Card>

      {showCustomization && (
        <GrillCustomizationModal
          dish={dish}
          isOpen={showCustomization}
          onClose={() => setShowCustomization(false)}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
};

export default GrillProductCard;