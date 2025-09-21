
import React, { createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCartState } from "@/hooks/use-cart-state";
import { useNotifications } from "@/hooks/use-notifications";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  customizations?: any;
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
  details?: {
    bank_name?: string;
    account_name?: string;
    account_iban?: string;
    swift_code?: string;
    phone_number?: string;
  };
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
  email?: string;
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
    setFavorites,
    deliveryLocations,
    paymentMethods
  } = useCartState();

  const { createNotification } = useNotifications();

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex > -1) {
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += 1;
        console.log(`Item atualizado - Quantidade de ${item.name} aumentada para ${updatedItems[existingItemIndex].quantity}`);
        return updatedItems;
      } else {
        console.log(`Item adicionado - ${item.name} foi adicionado ao carrinho`);
        return [...currentItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeItem = (id: number) => {
    setItems(currentItems => {
      const itemToRemove = currentItems.find(item => item.id === id);
      if (itemToRemove) {
        console.log(`Item removido - ${itemToRemove.name} foi removido do carrinho`);
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
    console.log("Carrinho limpo - Todos os itens foram removidos do carrinho");
  };

  const submitOrder = async (customerInfo: CustomerInfo): Promise<string> => {
    if (!selectedLocation || !selectedPaymentMethod) {
      console.error("Não foi possível processar - Por favor, selecione uma localização e um método de pagamento");
      throw new Error("Localização ou método de pagamento não selecionado");
    }

    // Get current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Generate a proper UUID for the order ID using crypto.randomUUID()
    const orderId = crypto.randomUUID();
    
    const orderData = {
      id: orderId,
      customer_id: user.id, // Add customer_id for RLS policy
      items: items,
      customer_info: customerInfo,
      subtotal: subtotal,
      delivery_fee: selectedLocation.fee,
      total: subtotal + selectedLocation.fee,
      status: "pending" as const,
      payment_status: "pending" as const,
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

      // Create notifications for order
      await createNotification(
        "Novo Pedido Recebido",
        `Pedido #${orderId.substring(0, 8)} no valor de ${subtotal + selectedLocation.fee} AOA foi criado`,
        "order"
      );

      // Log security event
      await supabase.rpc('log_security_event', {
        _action: `Novo pedido criado: #${orderId.substring(0, 8)}`,
        _details: { 
          order_id: orderId,
          customer_name: customerInfo.name,
          total: subtotal + selectedLocation.fee,
          items_count: items.length,
          payment_method: selectedPaymentMethod.name,
          delivery_location: selectedLocation.name
        }
      });

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
        notes: customerInfo.notes || ""
      };
      
      setOrders(prev => [...prev, newOrder]);
      
      console.log("Pedido recebido - Seu pedido foi registrado e está aguardando confirmação.");
      
      console.log("Novo pedido criado:", newOrder);
      
      return orderId;
    } catch (error: any) {
      console.error('Erro ao processar pedido:', error);
      console.error('Erro ao processar pedido:', error.message || "Ocorreu um erro. Tente novamente.");
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
    
    // Create notification for status update
    createNotification(
      "Status do Pedido Atualizado",
      `Pedido #${orderId.substring(0, 8)} foi atualizado para "${status}"`,
      "order_update"
    );

    // Log security event
    supabase.rpc('log_security_event', {
      _action: `Status do pedido atualizado: #${orderId.substring(0, 8)} para ${status}`,
      _details: { order_id: orderId, new_status: status }
    });
    
    console.log(`Status atualizado - O pedido ${orderId} foi atualizado para "${status}".`);
  };
  
  const updateOrderPaymentStatus = (orderId: string, paymentStatus: "pending" | "completed") => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, paymentStatus } : order
      )
    );
    
    // Create notification for payment status update
    createNotification(
      "Status de Pagamento Atualizado",
      `Pagamento do pedido #${orderId.substring(0, 8)} foi marcado como "${paymentStatus === 'completed' ? 'pago' : 'pendente'}"`,
      "payment_update"
    );

    // Log security event
    supabase.rpc('log_security_event', {
      _action: `Status de pagamento atualizado: #${orderId.substring(0, 8)} para ${paymentStatus}`,
      _details: { order_id: orderId, payment_status: paymentStatus }
    });
    
    console.log(`Pagamento atualizado - O pagamento do pedido ${orderId} foi marcado como "${paymentStatus}".`);
  };

  const addToFavorites = (dishId: number) => {
    if (!favorites.includes(dishId)) {
      setFavorites(prev => [...prev, dishId]);
      console.log("Adicionado aos favoritos - Prato adicionado à sua lista de favoritos");
    }
  };

  const removeFromFavorites = (dishId: number) => {
    setFavorites(prev => prev.filter(id => id !== dishId));
    console.log("Removido dos favoritos - Prato removido da sua lista de favoritos");
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
