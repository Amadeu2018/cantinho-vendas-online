
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Heart, Tag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import DishReviews from "@/components/reviews/DishReviews";

type Dish = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "appetizer" | "main" | "dessert";
  promotion?: {
    discount: number;
    label?: string;
  };
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 0
  }).format(price);
};

type MenuCardProps = {
  dish: Dish;
};

const MenuCard = ({ dish }: MenuCardProps) => {
  const { addItem, isFavorite, addToFavorites, removeFromFavorites } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image
    });
    
    toast.success(`${dish.name} adicionado ao carrinho!`, {
      duration: 2000,
    });
  };

  const handleToggleFavorite = () => {
    if (isFavorite(dish.id)) {
      removeFromFavorites(dish.id);
      toast.info(`${dish.name} removido dos favoritos`);
    } else {
      addToFavorites(dish.id);
      toast.success(`${dish.name} adicionado aos favoritos!`);
    }
  };

  const favorite = isFavorite(dish.id);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={dish.image} 
          alt={dish.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600"
          onClick={handleToggleFavorite}
        >
          <Heart className={cn("h-5 w-5", favorite ? "fill-red-500 text-red-500" : "")} />
        </Button>
        
        {dish.promotion && (
          <div className="absolute top-2 left-2">
            <span className="bg-cantinho-terracotta text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              {dish.promotion.label || `${dish.promotion.discount}% OFF`}
            </span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{dish.name}</h3>
        <p className="text-gray-600 text-sm mb-4 min-h-[40px]">{dish.description}</p>
        <div className="border-t border-gray-100 pt-3 mb-3">
          <DishReviews dishId={dish.id} dishName={dish.name} />
        </div>
        <div className="flex justify-between items-center">
          <div>
            {dish.promotion ? (
              <div className="flex flex-col">
                <span className="text-sm line-through text-gray-400">
                  {formatPrice(dish.price)}
                </span>
                <span className="font-bold text-cantinho-navy">
                  {formatPrice(Math.round(dish.price * (100 - dish.promotion.discount) / 100))}
                </span>
              </div>
            ) : (
              <span className="font-bold text-cantinho-navy">{formatPrice(dish.price)}</span>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleAddToCart}
            className="text-cantinho-terracotta hover:text-cantinho-terracotta/90 hover:bg-cantinho-terracotta/10"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuCard;

export type { Dish };
