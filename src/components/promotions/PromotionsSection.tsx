
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TicketPercent, ArrowRight, BadgePercent, Clock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

// Define the promotion type
type Promotion = {
  id: number;
  title: string;
  description: string;
  discountPercentage: number;
  validUntil: string;
  image: string;
  dishIds: number[];
};

// Sample promotions data
const PROMOTIONS: Promotion[] = [
  {
    id: 1,
    title: "Combo Português",
    description: "Desconto especial em dois pratos tradicionais portugueses",
    discountPercentage: 15,
    validUntil: "2023-12-31",
    image: "https://source.unsplash.com/random/400x200/?portuguese,food",
    dishIds: [4, 5] // Bacalhau à Brás and Cataplana de Marisco
  },
  {
    id: 2,
    title: "Sobremesa Especial",
    description: "Experimente nossos doces tradicionais com desconto",
    discountPercentage: 20,
    validUntil: "2023-12-15",
    image: "https://source.unsplash.com/random/400x200/?dessert",
    dishIds: [9, 10] // Pastéis de Nata and Pudim Flan
  },
  {
    id: 3,
    title: "Entradas com Desconto",
    description: "Entradas selecionadas com preço especial",
    discountPercentage: 10,
    validUntil: "2023-12-20",
    image: "https://source.unsplash.com/random/400x200/?appetizer",
    dishIds: [1, 2, 3] // All appetizers
  }
];

// Get menu items from MENU_ITEMS in Menu.tsx
const getPromotionDishes = (dishIds: number[]) => {
  // This is just a placeholder, as we don't have direct access to MENU_ITEMS here
  // In a real app, you'd fetch this data from a shared source or prop
  return dishIds.map(id => ({
    id,
    name: `Prato #${id}`,
    price: 1000 + (id * 500)
  }));
};

const PromotionsSection = () => {
  const [activePromotion, setActivePromotion] = useState<Promotion | null>(null);
  const { addItem } = useCart();

  const handleAddPromotionToCart = (promotion: Promotion) => {
    // Get the dishes for this promotion
    const dishes = getPromotionDishes(promotion.dishIds);
    
    // Add each dish to cart with applied discount
    dishes.forEach(dish => {
      const discountedPrice = Math.round(dish.price * (100 - promotion.discountPercentage) / 100);
      addItem({
        id: dish.id,
        name: dish.name,
        price: discountedPrice,
        image: `https://source.unsplash.com/random/300x200/?dish-${dish.id}` // Placeholder image
      });
    });

    // Show success toast
    toast.success("Promoção adicionada ao carrinho!", {
      description: `${dishes.length} itens adicionados com ${promotion.discountPercentage}% de desconto`
    });
  };

  return (
    <section className="mb-10 bg-cantinho-cream/30 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <TicketPercent className="h-6 w-6 text-cantinho-terracotta" />
        <h2 className="text-2xl font-bold text-cantinho-navy">Promoções Especiais</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROMOTIONS.map((promo) => (
          <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-40 overflow-hidden relative">
              <img 
                src={promo.image} 
                alt={promo.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 text-white">
                  <BadgePercent className="mr-1 h-3 w-3" /> {promo.discountPercentage}% OFF
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
                  onClick={() => setActivePromotion(activePromotion?.id === promo.id ? null : promo)}
                  className="text-xs"
                >
                  Detalhes
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleAddPromotionToCart(promo)}
                  className="text-xs bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
                >
                  Adicionar ao Carrinho
                </Button>
              </div>
              
              {activePromotion?.id === promo.id && (
                <div className="mt-4 pt-4 border-t text-sm">
                  <p className="font-medium mb-2">Itens incluídos:</p>
                  <ul className="space-y-2">
                    {getPromotionDishes(promo.dishIds).map((dish) => (
                      <li key={dish.id} className="flex justify-between">
                        <span>{dish.name}</span>
                        <div>
                          <span className="line-through text-gray-400 mr-2">{formatCurrency(dish.price)}</span>
                          <span className="font-medium text-cantinho-terracotta">
                            {formatCurrency(Math.round(dish.price * (100 - promo.discountPercentage) / 100))}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
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
