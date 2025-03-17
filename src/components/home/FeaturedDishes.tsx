
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useDishes } from "@/hooks/use-dishes";
import { useState, useEffect } from "react";
import { Dish } from "@/hooks/use-dishes";
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
  const { dishes, loading, isFavorite, toggleFavorite } = useDishes();
  const [featuredDishes, setFeaturedDishes] = useState<Dish[]>([]);

  useEffect(() => {
    if (!loading && dishes.length > 0) {
      // Selecionar até 4 pratos em destaque, dando preferência a pratos principais
      // Se não houver pratos suficientes, pegue de outras categorias
      const mainDishes = dishes.filter(dish => dish.category === 'main');
      const otherDishes = dishes.filter(dish => dish.category !== 'main');
      
      let selected = mainDishes.slice(0, 4);
      
      if (selected.length < 4) {
        selected = [...selected, ...otherDishes.slice(0, 4 - selected.length)];
      }
      
      setFeaturedDishes(selected);
    }
  }, [dishes, loading]);

  const handleAddToCart = (dish: Dish) => {
    addItem({
      id: parseInt(dish.id), // Convert UUID to number for compatibility
      name: dish.name,
      price: dish.price,
      image: dish.image_url
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDishes.map((dish) => (
              <Card key={dish.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={dish.image_url} 
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
