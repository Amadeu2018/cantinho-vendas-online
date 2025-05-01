
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface MenuCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  promotion?: {
    type: string;
    value: number;
  };
  isFavorite?: boolean;
}

const MenuCard = ({ id, name, description, price, imageUrl, category, promotion, isFavorite: initialIsFavorite }: MenuCardProps) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite || false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar aos favoritos",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFavorite) {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('dish_id', id);
      } else {
        // Add to favorites
        await supabase
          .from('favorites')
          .insert([{ user_id: user.id, dish_id: id }]);
      }

      setIsFavorite(!isFavorite);
      toast({
        title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
        description: "",
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os favoritos",
        variant: "destructive",
      });
    }
  };

  const handleViewDish = () => {
    navigate(`/menu/${id}`);
  };

  const getDiscountedPrice = () => {
    if (promotion && promotion.type === "percentage") {
      return price - (price * promotion.value) / 100;
    }
    if (promotion && promotion.type === "fixed") {
      return price - promotion.value;
    }
    return price;
  };

  const getCategoryLabel = () => {
    switch (category) {
      case "appetizer":
        return "Entrada";
      case "main":
        return "Prato Principal";
      case "dessert":
        return "Sobremesa";
      default:
        return category;
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart
            size={18}
            className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/90 text-xs font-medium">
            {getCategoryLabel()}
          </Badge>
        </div>
        {promotion && (
          <div className="absolute bottom-0 left-0 bg-cantinho-terracotta text-white px-2 py-1 text-xs font-bold">
            {promotion.type === "percentage"
              ? `${promotion.value}% OFF`
              : `${formatCurrency(promotion.value)} OFF`}
          </div>
        )}
      </div>
      <CardContent className="pt-4 pb-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1">
            {promotion ? (
              <>
                <span className="font-bold text-lg text-cantinho-navy">
                  {formatCurrency(getDiscountedPrice())}
                </span>
                <span className="text-gray-400 text-sm line-through">
                  {formatCurrency(price)}
                </span>
              </>
            ) : (
              <span className="font-bold text-lg text-cantinho-navy">
                {formatCurrency(price)}
              </span>
            )}
          </div>
          <Button
            size="sm"
            variant="default"
            className="bg-cantinho-navy hover:bg-cantinho-navy/90"
            onClick={handleViewDish}
          >
            Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuCard;
