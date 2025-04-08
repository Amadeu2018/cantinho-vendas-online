
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PlusCircle, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useDishes, Dish } from "@/hooks/use-dishes";
import { Skeleton } from "@/components/ui/skeleton";

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 0
  }).format(price);
};

const FeaturedDishes = () => {
  const { addItem } = useCart();
  const { featuredDishes, loading, isFavorite, toggleFavorite } = useDishes();

  const handleAddToCart = (dish: Dish) => {
    addItem({
      id: dish.id,
      name: dish.name,
      price: typeof dish.price === 'string' ? parseFloat(dish.price) : dish.price,
      image: dish.image_url || '/placeholder.svg'
    });
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3">Pratos em Destaque</h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Descubra alguns dos nossos pratos mais populares, preparados com ingredientes frescos e técnicas tradicionais.
        </p>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="relative">
            <ScrollArea className="w-full pb-4">
              <div className="flex space-x-4 pb-4">
                {featuredDishes.map((dish) => {
                  // Ensure price is a number
                  const price = typeof dish.price === 'string' ? parseFloat(dish.price) : dish.price;
                  
                  return (
                    <Card key={dish.id} className="overflow-hidden hover:shadow-lg transition-shadow min-w-[280px] max-w-[320px]">
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={dish.image_url || '/placeholder.svg'} 
                          alt={dish.name} 
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600"
                          onClick={() => toggleFavorite(dish.id)}
                        >
                          <Heart className={cn("h-5 w-5", isFavorite(dish.id) ? "fill-red-500 text-red-500" : "")} />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{dish.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{dish.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-cantinho-navy">
                            {formatPrice(price)}
                          </span>
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
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}
        
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
