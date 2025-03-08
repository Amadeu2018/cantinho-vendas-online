
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type DeliveryLocation = {
  id: number;
  name: string;
  fee: number;
  estimatedTime: string;
};

export type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryLocations: DeliveryLocation[];
  selectedLocation: DeliveryLocation | null;
  setSelectedLocation: (location: DeliveryLocation | null) => void;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  setSelectedPaymentMethod: (method: PaymentMethod | null) => void;
  processPayment: (customerInfo: CustomerInfo) => Promise<boolean>;
};

export type CustomerInfo = {
  name: string;
  address: string;
  phone: string;
  notes?: string;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<DeliveryLocation | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  
  // Dados de localização disponíveis para entrega
  const deliveryLocations: DeliveryLocation[] = [
    { id: 1, name: "Bairro Azul", fee: 1000, estimatedTime: "20-30 min" },
    { id: 2, name: "Maculusso", fee: 1500, estimatedTime: "25-35 min" },
    { id: 3, name: "Maianga", fee: 1500, estimatedTime: "25-35 min" },
    { id: 4, name: "Talatona", fee: 2500, estimatedTime: "35-50 min" },
    { id: 5, name: "Miramar", fee: 1800, estimatedTime: "30-40 min" },
    { id: 6, name: "Kilamba", fee: 3000, estimatedTime: "40-60 min" }
  ];
  
  // Métodos de pagamento disponíveis
  const paymentMethods: PaymentMethod[] = [
    { id: "cash", name: "Dinheiro na Entrega", icon: "banknote" },
    { id: "multicaixa", name: "Multicaixa Express", icon: "credit-card" },
    { id: "transfer", name: "Transferência Bancária", icon: "landmark" }
  ];
  
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
    setSelectedLocation(null);
    setSelectedPaymentMethod(null);
    toast({
      title: "Carrinho limpo",
      description: "Todos os itens foram removidos do carrinho",
    });
  };

  // Simular processamento de pagamento
  const processPayment = async (customerInfo: CustomerInfo): Promise<boolean> => {
    if (!selectedLocation || !selectedPaymentMethod) {
      toast({
        title: "Não foi possível processar",
        description: "Por favor, selecione uma localização e um método de pagamento",
        variant: "destructive"
      });
      return false;
    }

    // Aqui seria integrado um verdadeiro gateway de pagamento
    return new Promise((resolve) => {
      setTimeout(() => {
        toast({
          title: "Pagamento processado",
          description: `Seu pedido foi confirmado e será entregue em ${selectedLocation.estimatedTime}`,
        });
        
        console.log("Pedido processado:", {
          items,
          subtotal,
          deliveryFee: selectedLocation.fee,
          total: subtotal + selectedLocation.fee,
          paymentMethod: selectedPaymentMethod,
          customerInfo
        });
        
        resolve(true);
      }, 2000);
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
        deliveryLocations,
        selectedLocation,
        setSelectedLocation,
        paymentMethods,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        processPayment
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
