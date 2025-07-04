
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface MenuFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  categories: string[];
  totalCount: number;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const MenuFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  categories,
  totalCount,
  showFilters,
  setShowFilters
}: MenuFiltersProps) => {
  return (
    <div className="mb-6 sm:mb-8 space-y-4">
      {/* Search bar - Mobile first */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Pesquisar pratos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 sm:py-2 border-2 border-gray-200 rounded-xl focus:border-cantinho-terracotta focus:outline-none text-base sm:text-sm bg-white shadow-sm"
        />
      </div>

      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between sm:hidden">
        <h3 className="text-lg font-semibold text-cantinho-navy">
          {totalCount > 0 ? `${totalCount} pratos encontrados` : 'Carregando...'}
        </h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-cantinho-terracotta text-white rounded-lg font-medium"
        >
          <Filter className="w-4 h-4" />
          Filtros
        </button>
      </div>

      {/* Category filters */}
      <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === "Todos" ? null : category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-300 flex-shrink-0 ${
                (selectedCategory === category || (selectedCategory === null && category === "Todos"))
                  ? 'bg-cantinho-terracotta text-white shadow-lg'
                  : 'bg-white text-cantinho-navy border border-gray-200 hover:border-cantinho-terracotta hover:text-cantinho-terracotta'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuFilters;
