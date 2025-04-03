
export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: 'appetizer' | 'main' | 'dessert';
  promotion?: {
    discount: number;
    label: string;
  };
};
