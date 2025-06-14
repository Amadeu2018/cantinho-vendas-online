
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TicketPercent, ArrowRight, BadgePercent, Clock } from "lucide-react";
import { usePromotions } from "@/hooks/use-promotions";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const PromotionsSection = () => {
  const { promotions, loading } = usePromotions();
  const [activePromotion, setActivePromotion] = useState<string | null>(null);
  const { addItem } = useCart();

  const handleAddPromotionToCart = (promotionId: string) => {
    const promotion = promotions.find(p => p.id === promotionId);
    if (!promotion) return;
    
    // Add the dish to cart with applied discount
    const discountedPrice = Math.round(promotion.dish.price * (100 - promotion.discount) / 100);
    addItem({
      id: parseInt(promotion.dish.id),
      name: promotion.dish.name,
      price: discountedPrice,
      image: promotion.dish.image_url
    });

    // Show success toast
    toast.success("Promoção adicionada ao carrinho!", {
      description: `Item adicionado com ${promotion.discount}% de desconto`
    });
  };

  if (loading) {
    return (
      <section className="mb-10 bg-cantinho-cream/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TicketPercent className="h-6 w-6 text-cantinho-terracotta" />
          <h2 className="text-2xl font-bold text-cantinho-navy">Promoções Especiais</h2>
        </div>
        <div className="text-center py-8">
          <p>Carregando promoções...</p>
        </div>
      </section>
    );
  }

  if (promotions.length === 0) {
    return null; // Não mostrar a seção se não houver promoções ativas
  }

  return (
    <section className="mb-10 bg-cantinho-cream/30 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <TicketPercent className="h-6 w-6 text-cantinho-terracotta" />
        <h2 className="text-2xl font-bold text-cantinho-navy">Promoções Especiais</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-40 overflow-hidden relative">
              <img 
                src={promo.dish.image_url} 
                alt={promo.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 text-white">
                  <BadgePercent className="mr-1 h-3 w-3" /> {promo.discount}% OFF
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">{promo.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{promo.description}</p>
              <div className="flex items-center text-xs text-gray-500 mb-4">
                <Clock className="h-3 w-3 mr-1" /> 
                Válido até: {new Date(promo.validUntil).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setActivePromotion(activePromotion === promo.id ? null : promo.id)}
                  className="text-xs"
                >
                  Detalhes
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleAddPromotionToCart(promo.id)}
                  className="text-xs bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
                >
                  Adicionar ao Carrinho
                </Button>
              </div>
              
              {activePromotion === promo.id && (
                <div className="mt-4 pt-4 border-t text-sm">
                  <p className="font-medium mb-2">Item incluído:</p>
                  <div className="flex justify-between">
                    <span>{promo.dish.name}</span>
                    <div>
                      <span className="line-through text-gray-400 mr-2">{formatCurrency(promo.dish.price)}</span>
                      <span className="font-medium text-cantinho-terracotta">
                        {formatCurrency(Math.round(promo.dish.price * (100 - promo.discount) / 100))}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-6">
        <Button variant="link" className="text-cantinho-navy flex items-center mx-auto">
          Ver todas as promoções <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};

export default PromotionsSection;
