
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShoppingBag, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface MenuCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

const MenuCard = ({ id, name, description, price, imageUrl, category }: MenuCardProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price,
      quantity: 1,
      imageUrl
    });
    
    toast({
      title: "Item adicionado",
      description: `${name} foi adicionado ao seu carrinho.`,
    });
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar itens aos favoritos.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFavorite) {
        // Remover dos favoritos
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('dish_id', id);
      } else {
        // Adicionar aos favoritos
        await supabase
          .from('favorites')
          .insert([
            { user_id: user.id, dish_id: id }
          ]);
      }
      
      setIsFavorite(!isFavorite);
      
      toast({
        title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
        description: isFavorite 
          ? `${name} foi removido dos seus favoritos.` 
          : `${name} foi adicionado aos seus favoritos.`,
      });
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seus favoritos.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div 
          className="h-48 bg-cover bg-center cursor-pointer" 
          style={{ backgroundImage: `url(${imageUrl || '/placeholder.svg'})` }}
          onClick={() => setShowDialog(true)}
        />
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 
              className="text-lg font-bold cursor-pointer hover:text-cantinho-terracotta"
              onClick={() => setShowDialog(true)}
            >
              {name}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100"
              onClick={toggleFavorite}
            >
              <Heart 
                className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
              />
            </Button>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
          <div className="flex justify-between items-center">
            <span className="font-bold text-cantinho-navy">{formatCurrency(price)}</span>
            <Button 
              size="sm" 
              onClick={handleAddToCart}
              className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
            >
              <ShoppingBag className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
        </div>
      </div>

      {/* Dialog with dish details */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="h-48 w-full bg-cover bg-center rounded-t-lg mb-4" 
            style={{ backgroundImage: `url(${imageUrl || '/placeholder.svg'})` }} 
          />
          <DialogTitle className="text-xl flex justify-between items-center">
            {name}
            <span className="text-cantinho-navy">{formatCurrency(price)}</span>
          </DialogTitle>
          <DialogDescription className="text-gray-700">{description}</DialogDescription>
          <div className="mt-2">
            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2">
              {category}
            </span>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Fechar
            </Button>
            <Button onClick={() => {
              handleAddToCart();
              setShowDialog(false);
            }}>
              <ShoppingBag className="h-4 w-4 mr-1" />
              Adicionar ao carrinho
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MenuCard;
