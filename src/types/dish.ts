export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  image: string;
  category: string;
  categoryName?: string;
  tags: string[];
  popular: boolean;
  promotion?: {
    discount: number;
    label?: string;
  };
  rating: number;
  prepTime: string;
  serves: number;
  isSpicy: boolean;
  isVegetarian: boolean;
  isPopular: boolean;
  productType?: 'food' | 'grill' | 'beverage';
};
