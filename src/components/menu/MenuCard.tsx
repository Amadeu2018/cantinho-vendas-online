
import { useState } from "react";
import { Heart, ShoppingCart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface MenuCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  isFavorite: boolean;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  }).format(price);
};

const MenuCard: React.FC<MenuCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  category,
  isFavorite: initialIsFavorite,
}) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Aviso",
        description: "Faça login para adicionar aos favoritos.",
        variant: "default",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("dish_id", id);

        if (error) throw error;
        setIsFavorite(false);
      } else {
        // Add to favorites
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          dish_id: id,
        });

        if (error) throw error;
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar os favoritos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      quantity: 1,
      notes: "",
      image: imageUrl,
    });

    toast({
      title: "Adicionado ao carrinho",
      description: `${name} foi adicionado ao seu carrinho.`,
    });
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
          onClick={toggleFavorite}
          disabled={isLoading}
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </Button>
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg line-clamp-1">{name}</h3>
          <span className="font-bold text-cantinho-terracotta">
            {formatPrice(price)}
          </span>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs md:text-sm"
          asChild
        >
          <Link to={`/menu/reviews/${id}`}>
            <MessageSquare className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Avaliações</span>
            <span className="sm:hidden">Ver</span>
          </Link>
        </Button>
        <Button
          size="sm"
          className="flex-1 text-xs md:text-sm bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">Adicionar</span>
          <span className="sm:hidden">+</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuCard;
