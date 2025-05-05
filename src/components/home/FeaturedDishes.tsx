
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDishes } from "@/hooks/use-dishes";
import { Button } from "@/components/ui/button";
import { Utensils } from "lucide-react";
import MenuCard from "../menu/MenuCard";
import { Dish } from "@/types/dish";

const FeaturedDishes = () => {
  const { dishes, loading, isFavorite } = useDishes();
  const navigate = useNavigate();
  const [popularDishes, setPopularDishes] = useState<Dish[]>([]);

  useEffect(() => {
    if (dishes) {
      // Filter out popular dishes, or just take the first 3 if none are marked as popular
      const popular = dishes.filter((dish) => dish.popular);
      setPopularDishes(popular.length ? popular.slice(0, 3) : dishes.slice(0, 3));
    }
  }, [dishes]);

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cantinho-navy">
            Pratos Populares
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra os sabores autênticos da cozinha portuguesa que os nossos clientes mais adoram.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cantinho-terracotta"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularDishes.map((dish) => (
              <MenuCard 
                key={dish.id} 
                id={dish.id}
                name={dish.name}
                description={dish.description}
                price={typeof dish.price === 'string' ? parseFloat(dish.price) : dish.price} 
                imageUrl={dish.image_url}
                category={dish.category}
                isFavorite={isFavorite(dish.id)}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button
            onClick={() => navigate("/menu")}
            variant="default"
            size="lg"
            className="gap-2"
          >
            <Utensils size={18} />
            <span>Ver Menu Completo</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDishes;
