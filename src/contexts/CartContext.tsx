import React, { createContext, useContext } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCartState } from "@/hooks/use-cart-state";
import { deliveryLocations, paymentMethods } from "@/utils/cart-helpers";

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

export type OrderStatus = 
  | "pending" 
  | "confirmed" 
  | "preparing" 
  | "delivering" 
  | "delivered"
  | "completed" 
  | "cancelled";

export type Order = {
  id: string;
  items: CartItem[];
  customerInfo: CustomerInfo;
  location: DeliveryLocation;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
  paymentStatus: "pending" | "completed" | "failed" | "cancelled";
  isProforma?: boolean;
};

export type CustomerInfo = {
  name: string;
  address: string;
  phone: string;
  notes?: string;
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
  submitOrder: (customerInfo: CustomerInfo) => Promise<string>;
  orders: Order[];
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderPaymentStatus: (orderId: string, status: "pending" | "completed") => void;
  favorites: number[];
  addToFavorites: (dishId: number) => void;
  removeFromFavorites: (dishId: number) => void;
  isFavorite: (dishId: number) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    items,
    setItems,
    selectedLocation,
    setSelectedLocation,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    orders,
    setOrders,
    favorites,
    setFavorites
  } = useCartState();

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex > -1) {
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += 1;
        toast({
          title: "Item atualizado",
          description: `Quantidade de ${item.name} aumentada para ${updatedItems[existingItemIndex].quantity}`,
        });
        return updatedItems;
      } else {
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

  const submitOrder = async (customerInfo: CustomerInfo): Promise<string> => {
    if (!selectedLocation || !selectedPaymentMethod) {
      toast({
        title: "Não foi possível processar",
        description: "Por favor, selecione uma localização e um método de pagamento",
        variant: "destructive"
      });
      throw new Error("Localização ou método de pagamento não selecionado");
    }

    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const orderData = {
      id: orderId,
      items: items,
      customer_info: JSON.stringify(customerInfo),
      subtotal: subtotal,
      delivery_fee: selectedLocation.fee,
      total: subtotal + selectedLocation.fee,
      status: "pending",
      payment_status: "pending",
      payment_method: selectedPaymentMethod.name,
      notes: customerInfo.notes || ""
    };

    try {
      console.log('Submitting order to Supabase:', orderData);
      
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select();

      if (error) {
        console.error('Erro ao salvar pedido no Supabase:', error);
        throw error;
      }

      console.log('Order saved successfully:', data);

      const newOrder: Order = {
        id: orderId,
        items: [...items],
        customerInfo,
        location: selectedLocation,
        paymentMethod: selectedPaymentMethod,
        subtotal,
        deliveryFee: selectedLocation.fee,
        total: subtotal + selectedLocation.fee,
        status: "pending",
        createdAt: new Date().toISOString(),
        paymentStatus: "pending",
        notes: customerInfo.notes
      };
      
      setOrders(prev => [...prev, newOrder]);
      
      toast({
        title: "Pedido recebido",
        description: "Seu pedido foi registrado e está aguardando confirmação.",
      });
      
      console.log("Novo pedido criado:", newOrder);
      
      return orderId;
    } catch (error: any) {
      console.error('Erro ao processar pedido:', error);
      toast({
        title: "Erro ao processar pedido",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const getOrderById = (id: string): Order | undefined => {
    return orders.find(order => order.id === id);
  };
  
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
    
    toast({
      title: "Status atualizado",
      description: `O pedido ${orderId} foi atualizado para "${status}".`,
    });
  };
  
  const updateOrderPaymentStatus = (orderId: string, paymentStatus: "pending" | "completed") => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, paymentStatus } : order
      )
    );
    
    toast({
      title: "Pagamento atualizado",
      description: `O pagamento do pedido ${orderId} foi marcado como "${paymentStatus}".`,
    });
  };

  const addToFavorites = (dishId: number) => {
    if (!favorites.includes(dishId)) {
      setFavorites(prev => [...prev, dishId]);
      toast({
        title: "Adicionado aos favoritos",
        description: "Prato adicionado à sua lista de favoritos"
      });
    }
  };

  const removeFromFavorites = (dishId: number) => {
    setFavorites(prev => prev.filter(id => id !== dishId));
    toast({
      title: "Removido dos favoritos",
      description: "Prato removido da sua lista de favoritos"
    });
  };

  const isFavorite = (dishId: number) => favorites.includes(dishId);

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
        submitOrder,
        orders,
        getOrderById,
        updateOrderStatus,
        updateOrderPaymentStatus,
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
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
