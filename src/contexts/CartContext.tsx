
import React, { createContext, useState, useContext, useEffect } from 'react';

// Types
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  image_url?: string;
  notes?: string;
}

export interface CustomerInfo {
  name: string;
  address: string;
  phone: string;
  notes?: string;
}

export interface DeliveryLocation {
  id: number;
  name: string;
  fee: number;
  estimatedTime: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: {
    id: string;
    name: string;
    icon: string;
  };
  customerInfo: CustomerInfo;
  createdAt: string;
  notes?: string;
  type?: string;
  location: {
    id: number;
    name: string;
    fee: number;
    estimatedTime: string;
  };
  isProforma?: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  subtotal: number;
  total: number;
  deliveryFee: number;
  setDeliveryFee: (fee: number) => void;
  itemCount: number;
  totalItems: number;
  order: Order | null;
  createOrder: (orderData: Partial<Order>) => Promise<string>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  updateItemNotes: (id: string, notes: string) => void;
  deliveryLocations: DeliveryLocation[];
  selectedLocation: DeliveryLocation | null;
  setSelectedLocation: (location: DeliveryLocation | null) => void;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  setSelectedPaymentMethod: (method: PaymentMethod | null) => void;
  submitOrder: (customerInfo: CustomerInfo) => Promise<string>;
  addToCart: (item: CartItem) => void;
}

// Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Default delivery locations
const defaultDeliveryLocations: DeliveryLocation[] = [
  {
    id: 1,
    name: 'Luanda - Centro',
    fee: 1500,
    estimatedTime: '30-45 min'
  },
  {
    id: 2,
    name: 'Luanda - Talatona',
    fee: 2000,
    estimatedTime: '45-60 min'
  },
  {
    id: 3,
    name: 'Luanda - Viana',
    fee: 2500,
    estimatedTime: '60-75 min'
  },
  {
    id: 4,
    name: 'Retirada no local',
    fee: 0,
    estimatedTime: '15-20 min'
  }
];

// Default payment methods
const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: 'cash',
    name: 'Dinheiro',
    icon: 'banknote'
  },
  {
    id: 'card',
    name: 'Cartão de Crédito/Débito',
    icon: 'credit-card'
  },
  {
    id: 'transfer',
    name: 'Transferência Bancária',
    icon: 'landmark'
  }
];

// Provider
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];

    const storedItems = localStorage.getItem('cartItems');
    return storedItems ? JSON.parse(storedItems) : [];
  });
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [order, setOrder] = useState<Order | null>(null);
  const [deliveryLocations] = useState<DeliveryLocation[]>(defaultDeliveryLocations);
  const [selectedLocation, setSelectedLocation] = useState<DeliveryLocation | null>(null);
  const [paymentMethods] = useState<PaymentMethod[]>(defaultPaymentMethods);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    const existingItemIndex = items.findIndex((i) => i.id === item.id);

    if (existingItemIndex !== -1) {
      const newItems = [...items];
      newItems[existingItemIndex].quantity += item.quantity;
      setItems(newItems);
    } else {
      setItems([...items, item]);
    }
  };

  // Alias for addItem to maintain compatibility
  const addToCart = addItem;

  const updateItemQuantity = (id: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
      )
    );
  };

  // Alias for updateItemQuantity to maintain compatibility
  const updateQuantity = updateItemQuantity;

  const updateItemNotes = (id: string, notes: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, notes: notes } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalItems = itemCount; // Alias for itemCount to maintain compatibility

  const createOrder = async (orderData: Partial<Order>): Promise<string> => {
    // Generate a unique ID for the order
    const id = Math.random().toString(36).substring(2, 15);
    const createdAt = new Date().toISOString();

    const newOrder: Order = {
      id,
      items: items,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      total: total,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: selectedPaymentMethod || {
        id: 'default-payment-method',
        name: 'Default Payment',
        icon: 'credit-card',
      },
      customerInfo: {
        name: 'Customer Name',
        address: 'Customer Address',
        phone: 'Customer Phone',
      },
      createdAt: createdAt,
      notes: '',
      type: 'Pedido',
      location: selectedLocation || {
        id: 1,
        name: 'Default Location',
        fee: 5,
        estimatedTime: '30-45 min',
      },
      ...orderData,
    };

    setOrder(newOrder);
    clearCart();
    return id;
  };

  const submitOrder = async (customerInfo: CustomerInfo): Promise<string> => {
    // Create a new order with the customer information
    return createOrder({
      customerInfo,
      paymentMethod: selectedPaymentMethod || {
        id: 'default-payment-method',
        name: 'Default Payment',
        icon: 'credit-card',
      },
      location: selectedLocation || {
        id: 1,
        name: 'Default Location',
        fee: 0,
        estimatedTime: '30-45 min',
      }
    });
  };

  const getOrderById = async (orderId: string): Promise<Order | null> => {
    // This is a placeholder, replace with actual data fetching logic
    return new Promise((resolve) => {
      setTimeout(() => {
        if (order && order.id === orderId) {
          resolve(order);
        } else {
          resolve(null);
        }
      }, 500);
    });
  };

  const value: CartContextType = {
    items,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    subtotal,
    total,
    deliveryFee,
    setDeliveryFee,
    itemCount,
    totalItems,
    order,
    createOrder,
    getOrderById,
    updateItemNotes,
    updateQuantity,
    deliveryLocations,
    selectedLocation,
    setSelectedLocation,
    paymentMethods,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    submitOrder,
    addToCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
