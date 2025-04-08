
export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: 'appetizer' | 'main' | 'dessert';
  image?: string; // Include for backward compatibility
  popular?: boolean; // Add property for featured dishes
  tags?: string[];
  promotion?: {
    discount: number;
    label?: string;
  };
};
