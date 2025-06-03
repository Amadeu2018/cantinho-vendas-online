
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDishes } from "@/hooks/use-dishes";
import { Button } from "@/components/ui/button";
import { Utensils } from "lucide-react";
import MenuCard from "../menu/MenuCard";
import { Dish } from "@/types/dish";

const FeaturedDishes = () => {
  const { dishes, loading, isFavorite, toggleFavorite } = useDishes();
  const navigate = useNavigate();
  const [popularDishes, setPopularDishes] = useState<Dish[]>([]);

  useEffect(() => {
    console.log("FeaturedDishes: dishes updated", dishes);
    if (dishes && dishes.length > 0) {
      // Filter out popular dishes, or just take the first 3 if none are marked as popular
      const popular = dishes.filter((dish) => dish.popular);
      const displayDishes = popular.length > 0 ? popular.slice(0, 3) : dishes.slice(0, 3);
      setPopularDishes(displayDishes);
      console.log("FeaturedDishes: setting popular dishes", displayDishes);
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
        ) : popularDishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularDishes.map((dish) => (
              <MenuCard 
                key={dish.id}
                dish={dish}
                isFavorite={isFavorite(dish.id)}
                onToggleFavorite={() => toggleFavorite(dish.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Nenhum prato encontrado</p>
            <p className="text-sm text-gray-500">Adicione produtos no painel de administração para vê-los aqui.</p>
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
