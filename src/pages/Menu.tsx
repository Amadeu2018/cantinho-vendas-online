
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type Dish = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "appetizer" | "main" | "dessert";
};

const MENU_ITEMS: Dish[] = [
  // Appetizers
  {
    id: 1,
    name: "Pastéis de Bacalhau",
    description: "Bolinhos de bacalhau desfiado, batata, cebola e salsa.",
    price: 1800,
    image: "https://source.unsplash.com/random/300x200/?codfish",
    category: "appetizer"
  },
  {
    id: 2,
    name: "Chouriço Assado",
    description: "Chouriço português assado na tradicional assadeira de barro.",
    price: 2000,
    image: "https://source.unsplash.com/random/300x200/?chorizo",
    category: "appetizer"
  },
  {
    id: 3,
    name: "Camarão ao Alho",
    description: "Camarão salteado em azeite, alho e piri-piri.",
    price: 2500,
    image: "https://source.unsplash.com/random/300x200/?garlic,shrimp",
    category: "appetizer"
  },
  // Main Dishes
  {
    id: 4,
    name: "Bacalhau à Brás",
    description: "Bacalhau desfiado, batata palha, cebola, ovos e azeitonas.",
    price: 3500,
    image: "https://source.unsplash.com/random/300x200/?codfish,dish",
    category: "main"
  },
  {
    id: 5,
    name: "Cataplana de Marisco",
    description: "Camarões, amêijoas, mexilhões e peixe fresco em molho de tomate aromático.",
    price: 4200,
    image: "https://source.unsplash.com/random/300x200/?seafood,stew",
    category: "main"
  },
  {
    id: 6,
    name: "Arroz de Marisco",
    description: "Arroz cremoso com diversos frutos do mar e especiarias.",
    price: 3800,
    image: "https://source.unsplash.com/random/300x200/?seafood,rice",
    category: "main"
  },
  {
    id: 7,
    name: "Feijoada à Transmontana",
    description: "Feijão, carne de porco, chouriço e carnes fumadas.",
    price: 3800,
    image: "https://source.unsplash.com/random/300x200/?stew,beans",
    category: "main"
  },
  {
    id: 8,
    name: "Francesinha",
    description: "Sanduíche com carnes variadas, queijo, molho de tomate e cerveja.",
    price: 3200,
    image: "https://source.unsplash.com/random/300x200/?sandwich",
    category: "main"
  },
  // Desserts
  {
    id: 9,
    name: "Pastéis de Nata",
    description: "Doce tradicional português com massa folhada e creme de leite.",
    price: 800,
    image: "https://source.unsplash.com/random/300x200/?custard,tart",
    category: "dessert"
  },
  {
    id: 10,
    name: "Pudim Flan",
    description: "Pudim de leite condensado com calda de caramelo.",
    price: 1000,
    image: "https://source.unsplash.com/random/300x200/?pudding,caramel",
    category: "dessert"
  },
  {
    id: 11,
    name: "Arroz Doce",
    description: "Arroz cozido com leite, açúcar, limão e canela.",
    price: 1200,
    image: "https://source.unsplash.com/random/300x200/?rice,pudding",
    category: "dessert"
  }
];

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 0
  }).format(price);
};

const Menu = () => {
  const [cartItems, setCartItems] = useState<{ dishId: number, quantity: number }[]>([]);

  const addToCart = (dishId: number) => {
    const existingItem = cartItems.find(item => item.dishId === dishId);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.dishId === dishId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCartItems([...cartItems, { dishId, quantity: 1 }]);
    }
    
    console.log(`Added dish #${dishId} to cart`);
  };

  const appetizers = MENU_ITEMS.filter(dish => dish.category === "appetizer");
  const mains = MENU_ITEMS.filter(dish => dish.category === "main");
  const desserts = MENU_ITEMS.filter(dish => dish.category === "dessert");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3 text-cantinho-navy">Nosso Menu</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubra os melhores sabores da culinária portuguesa e angolana, preparados com ingredientes frescos e técnicas tradicionais.
            </p>
          </div>

          <Tabs defaultValue="main" className="w-full">
            <TabsList className="w-full flex justify-center mb-8">
              <TabsTrigger value="appetizer" className="px-6">Entradas</TabsTrigger>
              <TabsTrigger value="main" className="px-6">Pratos Principais</TabsTrigger>
              <TabsTrigger value="dessert" className="px-6">Sobremesas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appetizer">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appetizers.map(dish => (
                  <MenuCard key={dish.id} dish={dish} onAddToCart={addToCart} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="main">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mains.map(dish => (
                  <MenuCard key={dish.id} dish={dish} onAddToCart={addToCart} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="dessert">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {desserts.map(dish => (
                  <MenuCard key={dish.id} dish={dish} onAddToCart={addToCart} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

type MenuCardProps = {
  dish: Dish;
  onAddToCart: (id: number) => void;
};

const MenuCard = ({ dish, onAddToCart }: MenuCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden">
        <img 
          src={dish.image} 
          alt={dish.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{dish.name}</h3>
        <p className="text-gray-600 text-sm mb-4 min-h-[40px]">{dish.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-cantinho-navy">{formatPrice(dish.price)}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onAddToCart(dish.id)}
            className="text-cantinho-terracotta hover:text-cantinho-terracotta/90 hover:bg-cantinho-terracotta/10"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Menu;
