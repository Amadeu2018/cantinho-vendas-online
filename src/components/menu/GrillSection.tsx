import React from "react";
import { Flame, Clock } from "lucide-react";
import { Dish } from "@/types/dish";
import MenuCard from "./MenuCard";

interface GrillSectionProps {
  grillProducts: Dish[];
  loading?: boolean;
}

const GrillSection = ({ grillProducts, loading }: GrillSectionProps) => {
  if (loading) {
    return (
      <section className="mb-12 sm:mb-16">
        <div className="text-center mb-8 sm:mb-10 px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cantinho-navy mb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <Flame className="h-6 w-6 sm:h-8 sm:w-8 text-cantinho-terracotta" />
              <span>Churrascaria</span>
            </div>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Carregando produtos da churrascaria...
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
      </section>
    );
  }

  if (grillProducts.length === 0) {
    return (
      <section className="mb-12 sm:mb-16">
        <div className="text-center mb-8 sm:mb-10 px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cantinho-navy mb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <Flame className="h-6 w-6 sm:h-8 sm:w-8 text-cantinho-terracotta" />
              <span>Churrascaria</span>
            </div>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Produtos da churrascaria em breve!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12 sm:mb-16">
      <div className="text-center mb-8 sm:mb-10 px-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cantinho-navy mb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <Flame className="h-6 w-6 sm:h-8 sm:w-8 text-cantinho-terracotta" />
            <span>Churrascaria</span>
          </div>
          {grillProducts.length > 0 && (
            <div className="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-lg bg-cantinho-sand text-cantinho-navy mt-2 sm:mt-0 sm:ml-3 rounded-full">
              {grillProducts.length} produtos
            </div>
          )}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
          Produtos frescos da nossa churrascaria, prontos para entrega
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
        {grillProducts.map((product) => (
          <div key={product.id} className="transform hover:scale-105 transition-transform duration-300 h-full">
            <MenuCard dish={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GrillSection;