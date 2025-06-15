
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface MenuFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  categories: string[];
}

const MenuFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  categories 
}: MenuFiltersProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-12">
      <div className="flex flex-col space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Buscar pratos deliciosos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-cantinho-terracotta rounded-2xl shadow-sm"
          />
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category || (category === "Todos" && selectedCategory === null) ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category === "Todos" ? null : category)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category || (category === "Todos" && selectedCategory === null)
                  ? "bg-gradient-to-r from-cantinho-terracotta to-cantinho-sand text-white shadow-lg"
                  : "bg-white hover:bg-cantinho-cream border-2 border-gray-200 hover:border-cantinho-terracotta text-gray-700"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuFilters;
