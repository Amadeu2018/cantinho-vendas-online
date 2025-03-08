
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

type Dish = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "appetizer" | "main" | "dessert";
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
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden">
        <img 
          src={dish.image} 
          alt={dish.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{dish.name}</h3>
        <p className="text-gray-600 text-sm mb-4 min-h-[40px]">{dish.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-cantinho-navy">{formatPrice(dish.price)}</span>
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
