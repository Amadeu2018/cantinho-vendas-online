
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

type Dish = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "appetizer" | "main" | "dessert";
};

const FEATURED_DISHES: Dish[] = [
  {
    id: 1,
    name: "Bacalhau à Brás",
    description: "Bacalhau desfiado, batata palha, cebola, ovos e azeitonas.",
    price: 3500,
    image: "https://source.unsplash.com/random/300x200/?codfish",
    category: "main"
  },
  {
    id: 2,
    name: "Cataplana de Marisco",
    description: "Camarões, amêijoas, mexilhões e peixe fresco em molho de tomate aromático.",
    price: 4200,
    image: "https://source.unsplash.com/random/300x200/?seafood",
    category: "main"
  },
  {
    id: 3,
    name: "Feijoada à Transmontana",
    description: "Feijão, carne de porco, chouriço e carnes fumadas.",
    price: 3800,
    image: "https://source.unsplash.com/random/300x200/?stew",
    category: "main"
  },
  {
    id: 4,
    name: "Pastéis de Nata",
    description: "Doce tradicional português com massa folhada e creme de leite.",
    price: 800,
    image: "https://source.unsplash.com/random/300x200/?custard",
    category: "dessert"
  }
];

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 0
  }).format(price);
};

const FeaturedDishes = () => {
  const { addItem } = useCart();

  const handleAddToCart = (dish: Dish) => {
    addItem({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image
    });
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3">Pratos em Destaque</h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Descubra alguns dos nossos pratos mais populares, preparados com ingredientes frescos e técnicas tradicionais.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_DISHES.map((dish) => (
            <Card key={dish.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={dish.image} 
                  alt={dish.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{dish.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{dish.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-cantinho-navy">{formatPrice(dish.price)}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleAddToCart(dish)}
                    className="text-cantinho-terracotta hover:text-cantinho-terracotta/90 hover:bg-cantinho-terracotta/10"
                  >
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button asChild className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90">
            <Link to="/menu">Ver Menu Completo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDishes;
