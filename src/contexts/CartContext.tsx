
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Carregar dados do carrinho do localStorage ao iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("cantinho-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
      }
    }
  }, []);

  // Salvar dados do carrinho no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("cantinho-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems(currentItems => {
      // Verificar se o item já existe no carrinho
      const existingItemIndex = currentItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex > -1) {
        // Atualizar a quantidade se já existir
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += 1;
        toast({
          title: "Item atualizado",
          description: `Quantidade de ${item.name} aumentada para ${updatedItems[existingItemIndex].quantity}`,
        });
        return updatedItems;
      } else {
        // Adicionar novo item se não existir
        toast({
          title: "Item adicionado",
          description: `${item.name} foi adicionado ao carrinho`,
        });
        return [...currentItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeItem = (id: number) => {
    setItems(currentItems => {
      const itemToRemove = currentItems.find(item => item.id === id);
      if (itemToRemove) {
        toast({
          title: "Item removido",
          description: `${itemToRemove.name} foi removido do carrinho`,
        });
      }
      return currentItems.filter(item => item.id !== id);
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Carrinho limpo",
      description: "Todos os itens foram removidos do carrinho",
    });
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
