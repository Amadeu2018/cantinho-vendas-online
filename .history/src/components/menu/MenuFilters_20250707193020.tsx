import React, { useState } from "react";
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
  const [selectedCategoryState, setSelectedCategoryState] = useState("Todos");

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredDishes = allDishes.filter(dish => {
    const matchesCategory = selectedCategory === "Todos" || dish.category === selectedCategory;
    const matchesSearchTerm = dish.title && dish.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  return (
    <div className="mb-6 sm:mb-8 space-y-4">
      {/* Search bar - Mobile first */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Pesquisar pratos, ingredientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 sm:py-2 border-2 border-border rounded-xl focus:border-primary focus:outline-none text-base sm:text-sm bg-background shadow-sm transition-colors"
        />
      </div>

      {/* Results count and filter toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-foreground">
            {totalCount > 0 ? `${totalCount} pratos encontrados` : 'Carregando...'}
          </h3>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              Limpar filtros
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filtros
        </button>
      </div>

      {/* Category filters */}
      <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const isSelected = selectedCategory === category || (selectedCategory === null && category === "Todos");
            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category === "Todos" ? null : category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-300 flex-shrink-0 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-lg transform scale-105'
                    : 'bg-background text-foreground border border-border hover:border-primary hover:text-primary hover:shadow-md'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MenuFilters;
