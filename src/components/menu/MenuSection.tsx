
import React from "react";
import { Badge } from "@/components/ui/badge";
import MenuCard from "@/components/menu/MenuCard";
import { Search } from "lucide-react";

interface MenuSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  dishes: any[];
  showCount?: boolean;
}

const MenuSection = ({ title, description, icon, dishes, showCount = false }: MenuSectionProps) => {
  if (dishes.length === 0) {
    return (
      <section className="mb-12 sm:mb-16">
        <div className="text-center py-16 sm:py-20 bg-white/50 rounded-2xl sm:rounded-3xl">
          <div className="max-w-md mx-auto px-4">
            <Search className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-2">Nenhum prato encontrado</h3>
            <p className="text-gray-500 text-sm sm:text-base">Tente ajustar os filtros ou buscar por outros termos.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12 sm:mb-16">
      <div className="text-center mb-8 sm:mb-10 px-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cantinho-navy mb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            {icon}
            <span>{title}</span>
          </div>
          {showCount && (
            <Badge variant="secondary" className="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-lg bg-cantinho-sand text-cantinho-navy mt-2 sm:mt-0 sm:ml-3">
              {dishes.length} pratos
            </Badge>
          )}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
        {dishes.map((dish) => (
          <div key={dish.id} className="transform hover:scale-105 transition-transform duration-300 h-full">
            <MenuCard dish={dish} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
