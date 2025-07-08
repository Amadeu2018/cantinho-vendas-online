import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Clock, Users, Percent } from "lucide-react";
import { Dish } from "@/types/dish";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface GrillPromotionsSectionProps {
  promotions: {
    id: string;
    title: string;
    description: string;
    discount: number;
    validUntil: string;
    dishes: Dish[];
    isActive: boolean;
  }[];
  loading?: boolean;
}

const GrillPromotionsSection = ({ promotions, loading }: GrillPromotionsSectionProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (dish: Dish) => {
    addItem({
      id: parseInt(dish.id),
      name: dish.name,
      price: dish.price,
      image: dish.image,
    });

    toast({
      title: "Produto adicionado!",
      description: `${dish.name} foi adicionado ao carrinho com desconto`,
    });
  };

  if (loading) {
    return (
      <section className="mb-12 sm:mb-16">
        <div className="text-center mb-8 sm:mb-10 px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cantinho-navy mb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <Percent className="h-6 w-6 sm:h-8 sm:w-8 text-cantinho-terracotta" />
              <span>Promoções Churrascaria</span>
            </div>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Carregando promoções...
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
      </section>
    );
  }

  if (promotions.length === 0) {
    return null;
  }

  return (
    <section className="mb-12 sm:mb-16">
      <div className="text-center mb-8 sm:mb-10 px-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cantinho-navy mb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <Percent className="h-6 w-6 sm:h-8 sm:w-8 text-cantinho-terracotta" />
            <span>Promoções Churrascaria</span>
          </div>
          {promotions.length > 0 && (
            <Badge variant="secondary" className="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-lg">
              {promotions.length} promoções ativas
            </Badge>
          )}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
          Aproveite nossas ofertas especiais da churrascaria
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
        {promotions.map((promotion) => (
          <Card key={promotion.id} className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-0 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-cantinho-terracotta text-white flex items-center gap-1">
                  <Flame className="h-3 w-3" />
                  {promotion.discount}% OFF
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Válida até {new Date(promotion.validUntil).toLocaleDateString('pt-BR')}
                </Badge>
              </div>
              <CardTitle className="text-lg text-cantinho-navy group-hover:text-cantinho-terracotta transition-colors">
                {promotion.title}
              </CardTitle>
              <p className="text-sm text-cantinho-navy/70">
                {promotion.description}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {promotion.dishes.map((dish) => (
                <div key={dish.id} className="flex items-center gap-3 p-3 bg-cantinho-sand/20 rounded-lg">
                  <img 
                    src={dish.image} 
                    alt={dish.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-cantinho-navy">{dish.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-cantinho-navy/60 line-through">
                        {dish.price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                      </span>
                      <span className="text-sm font-bold text-cantinho-terracotta">
                        {(dish.price * (1 - promotion.discount / 100)).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      {dish.prep_time_minutes && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-cantinho-navy/60" />
                          <span className="text-xs text-cantinho-navy/60">{dish.prep_time_minutes} min</span>
                        </div>
                      )}
                      {dish.combo_serves && dish.combo_serves > 1 && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-cantinho-navy/60" />
                          <span className="text-xs text-cantinho-navy/60">{dish.combo_serves} pessoas</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    size="sm"
                    onClick={() => handleAddToCart(dish)}
                    className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 text-white text-xs px-3"
                  >
                    Adicionar
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default GrillPromotionsSection;