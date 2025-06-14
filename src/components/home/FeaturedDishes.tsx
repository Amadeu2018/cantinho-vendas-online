
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDishes } from "@/hooks/use-dishes";
import { Button } from "@/components/ui/button";
import { Utensils, Star, TrendingUp, Heart } from "lucide-react";
import MenuCard from "../menu/MenuCard";
import { Dish } from "@/types/dish";

const FeaturedDishes = () => {
  const { dishes, loading, isFavorite, toggleFavorite } = useDishes();
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
    <section className="bg-gradient-to-br from-gray-50 via-white to-cantinho-cream/30 py-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-cantinho-terracotta/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-cantinho-navy/10 rounded-full blur-xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          {/* Enhanced header with icons and stats */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-cantinho-terracotta/10 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-cantinho-terracotta" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-cantinho-navy animate-fade-in">
              Pratos Mais Populares
            </h2>
            <div className="bg-cantinho-terracotta/10 p-3 rounded-full">
              <Heart className="w-6 h-6 text-cantinho-terracotta" />
            </div>
          </div>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in leading-relaxed mb-8">
            Descubra os sabores autênticos da cozinha portuguesa e angolana que conquistaram o coração dos nossos clientes
          </p>

          {/* Popular stats */}
          <div className="flex justify-center gap-8 mb-12 animate-fade-in">
            <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-center gap-1 text-cantinho-terracotta mb-1">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-2xl font-bold">4.9</span>
              </div>
              <div className="text-sm text-gray-600">Avaliação Média</div>
            </div>
            <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="text-2xl font-bold text-cantinho-navy mb-1">500+</div>
              <div className="text-sm text-gray-600">Pedidos/Mês</div>
            </div>
            <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="text-2xl font-bold text-cantinho-terracotta mb-1">98%</div>
              <div className="text-sm text-gray-600">Satisfação</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-cantinho-terracotta border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando os melhores pratos...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {popularDishes.map((dish, index) => (
                <div
                  key={dish.id}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <MenuCard 
                    dish={dish}
                    isFavorite={isFavorite(dish.id)}
                    onToggleFavorite={() => toggleFavorite(dish.id)}
                  />
                </div>
              ))}
            </div>

            {/* Enhanced call to action */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-cantinho-navy to-cantinho-terracotta p-8 rounded-2xl text-white max-w-2xl mx-auto mb-8">
                <h3 className="text-2xl font-bold mb-3">Explore Todo o Nosso Menu</h3>
                <p className="text-white/90 mb-6">
                  Mais de 100 pratos tradicionais esperando por você. Descubra sabores únicos da culinária lusófona.
                </p>
                <Button
                  onClick={() => navigate("/menu")}
                  className="bg-white text-cantinho-navy hover:bg-cantinho-sand transition-all duration-300 gap-2 px-8 py-3 text-lg font-semibold"
                  size="lg"
                >
                  <Utensils size={20} />
                  <span>Ver Menu Completo</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedDishes;
