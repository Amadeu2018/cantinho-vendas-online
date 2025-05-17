
import { useState, useEffect } from "react";
import { Dish } from "@/types/dish";

type FilteredItems = {
  appetizer: Dish[];
  main: Dish[];
  dessert: Dish[];
};

export const useMenuFilters = (dishes: Dish[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [filteredItems, setFilteredItems] = useState<FilteredItems>({
    appetizer: [],
    main: [],
    dessert: []
  });
  
  useEffect(() => {
    // Filter menu items based on search term and price filter
    const filterItems = () => {
      const filtered = {
        appetizer: dishes.filter(dish => {
          const price = typeof dish.price === 'string' ? parseFloat(dish.price) : dish.price;
          return dish.category === "appetizer" && 
            dish.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (priceFilter === "" || priceFilter === "all" || applyPriceFilter(price, priceFilter));
        }),
        main: dishes.filter(dish => {
          const price = typeof dish.price === 'string' ? parseFloat(dish.price) : dish.price;
          return dish.category === "main" && 
            dish.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (priceFilter === "" || priceFilter === "all" || applyPriceFilter(price, priceFilter));
        }),
        dessert: dishes.filter(dish => {
          const price = typeof dish.price === 'string' ? parseFloat(dish.price) : dish.price;
          return dish.category === "dessert" && 
            dish.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (priceFilter === "" || priceFilter === "all" || applyPriceFilter(price, priceFilter));
        })
      };
      setFilteredItems(filtered);
    };

    filterItems();
  }, [dishes, searchTerm, priceFilter]);
  
  const applyPriceFilter = (price: number, filter: string): boolean => {
    switch (filter) {
      case "low":
        return price < 2000;
      case "medium":
        return price >= 2000 && price < 3500;
      case "high":
        return price >= 3500;
      default:
        return true;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceFilter("");
  };

  return {
    searchTerm,
    setSearchTerm,
    priceFilter,
    setPriceFilter,
    filteredItems,
    clearFilters
  };
};
