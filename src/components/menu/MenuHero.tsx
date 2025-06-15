
import React from "react";
import { ChefHat, Star, Clock, Users } from "lucide-react";

const MenuHero = () => {
  return (
    <div className="relative text-center mb-16 py-12">
      <div className="absolute inset-0 bg-gradient-to-r from-cantinho-navy/5 to-cantinho-terracotta/5 rounded-3xl"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-6">
          <ChefHat className="h-12 w-12 text-cantinho-terracotta mr-4" />
          <h1 className="text-5xl md:text-6xl font-bold text-cantinho-navy">
            Nosso <span className="text-cantinho-terracotta bg-gradient-to-r from-cantinho-terracotta to-cantinho-sand bg-clip-text text-transparent">Cardápio</span>
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Descubra os sabores autênticos da culinária algarvia, preparados com ingredientes frescos 
          e receitas tradicionais passadas de geração em geração.
        </p>
        <div className="flex items-center justify-center mt-6 space-x-6 text-sm text-gray-500">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span>Pratos Premiados</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-cantinho-terracotta mr-1" />
            <span>Entrega Rápida</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-cantinho-navy mr-1" />
            <span>+1000 Clientes Satisfeitos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuHero;
