
export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  image: string;
  category: 'appetizer' | 'main' | 'dessert';
  popular?: boolean;
  tags?: string[];
  promotion?: {
    discount: number;
    label?: string;
  };
  rating?: number;
  prepTime?: string;
  serves?: number;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isPopular?: boolean;
};
