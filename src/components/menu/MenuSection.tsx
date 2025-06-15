
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
      <section>
        <div className="text-center py-20 bg-white/50 rounded-3xl">
          <div className="max-w-md mx-auto">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">Nenhum prato encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou buscar por outros termos.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-cantinho-navy mb-4 flex items-center justify-center gap-3">
          {icon}
          {title}
          {showCount && (
            <Badge variant="secondary" className="ml-3 px-4 py-2 text-lg bg-cantinho-sand text-cantinho-navy">
              {dishes.length} pratos disponíveis
            </Badge>
          )}
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {description}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dishes.map((dish) => (
          <div key={dish.id} className="transform hover:scale-105 transition-transform duration-300">
            <MenuCard dish={dish} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
