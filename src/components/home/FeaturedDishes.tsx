
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePaginatedDishes } from "@/hooks/use-paginated-dishes";
import { Button } from "@/components/ui/button";
import { Utensils, Star, TrendingUp, Heart, Users, Award } from "lucide-react";
import MenuCard from "../menu/MenuCard";
import LoadMoreButton from "../common/LoadMoreButton";

const FeaturedDishes = () => {
  const { 
    dishes: popularDishes, 
    loading, 
    hasMore, 
    totalCount, 
    loadMore,
    isFavorite, 
    toggleFavorite 
  } = usePaginatedDishes({ 
    pageSize: 6, 
    popular: true 
  });
  
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-cantinho-cream/30 py-12 sm:py-16 md:py-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-12 left-4 sm:top-20 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-cantinho-terracotta/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-12 right-4 sm:bottom-20 sm:right-10 w-24 h-24 sm:w-40 sm:h-40 bg-cantinho-navy/10 rounded-full blur-xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          {/* Mobile-first header */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-cantinho-terracotta/10 p-2 sm:p-3 rounded-full">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-cantinho-terracotta" />
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-cantinho-navy animate-fade-in text-center">
              Pratos Mais Populares
            </h2>
            <div className="bg-cantinho-terracotta/10 p-2 sm:p-3 rounded-full">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-cantinho-terracotta" />
            </div>
          </div>
          
          <p className="text-sm sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in leading-relaxed mb-6 sm:mb-8 px-2">
            Descubra os sabores autênticos da cozinha portuguesa e angolana que conquistaram o coração dos nossos clientes
          </p>

          {/* Mobile-optimized stats */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-8 mb-8 sm:mb-12 animate-fade-in">
            <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg flex-1 min-w-[90px] max-w-[110px] sm:max-w-none sm:flex-initial">
              <div className="flex items-center justify-center gap-1 text-cantinho-terracotta mb-1">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                <span className="text-lg sm:text-2xl font-bold">4.9</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Avaliação</div>
            </div>
            <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg flex-1 min-w-[90px] max-w-[110px] sm:max-w-none sm:flex-initial">
              <div className="flex items-center justify-center gap-1 text-cantinho-navy mb-1">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-lg sm:text-2xl font-bold">500+</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Pedidos/Mês</div>
            </div>
            <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg flex-1 min-w-[90px] max-w-[110px] sm:max-w-none sm:flex-initial">
              <div className="flex items-center justify-center gap-1 text-cantinho-terracotta mb-1">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-lg sm:text-2xl font-bold">98%</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Satisfação</div>
            </div>
          </div>
        </div>

        {loading && popularDishes.length === 0 ? (
          <div className="flex justify-center py-12 sm:py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-cantinho-terracotta border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">Carregando os melhores pratos...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile-first dishes grid with consistent height */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
              {popularDishes.map((dish, index) => (
                <div
                  key={dish.id}
                  className="animate-scale-in h-full flex"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <MenuCard dish={dish} />
                </div>
              ))}
            </div>

            {/* Load more button */}
            <LoadMoreButton
              onClick={loadMore}
              loading={loading}
              hasMore={hasMore}
              totalCount={totalCount}
              currentCount={popularDishes.length}
            />

            {/* Mobile-first call to action */}
            <div className="text-center px-4">
              <div className="bg-gradient-to-r from-cantinho-navy to-cantinho-terracotta p-6 sm:p-8 rounded-2xl text-white max-w-2xl mx-auto mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-3">Explore Todo o Nosso Menu</h3>
                <p className="text-white/90 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                  Mais de 100 pratos tradicionais esperando por você. Descubra sabores únicos da culinária lusófona.
                </p>
                <Button
                  onClick={() => navigate("/menu")}
                  className="bg-white text-cantinho-navy hover:bg-cantinho-sand transition-all duration-300 gap-2 px-6 py-3 sm:px-8 sm:py-3 text-base sm:text-lg font-semibold w-full sm:w-auto"
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
