
export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  image_url?: string;
};

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed';

export type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
};

export type CustomerInfo = {
  name: string;
  address: string;
  phone: string;
  notes?: string;
};

export type DeliveryLocation = {
  id: string;
  name: string;
  fee: number;
  estimatedTime?: string;
};

export type Order = {
  id: string;
  items: CartItem[];
  customerInfo: CustomerInfo;
  total: number;
  subtotal: number;
  deliveryFee: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  type: string;
  createdAt: string;
  location: DeliveryLocation;
  isProforma?: boolean;
};

export type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  subtotal: number;
  itemCount: (id: string) => number;
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  deliveryLocations: DeliveryLocation[];
  selectedLocation: DeliveryLocation | null;
  setSelectedLocation: React.Dispatch<React.SetStateAction<DeliveryLocation | null>>;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  setSelectedPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod | null>>;
  submitOrder: (customerInfo: CustomerInfo) => Promise<string>;
  getOrderById: (orderId: string) => Promise<Order | null>;
};

export interface OrderFromDatabase {
  id: string;
  customer_id: string;
  total: number;
  created_at: string;
  updated_at: string;
  items: any;
  customer_info: any;
  delivery_address_id: string | null;
  estimated_delivery: string | null;
  payment_details: any;
  processing_notes: any[] | null;
  status: string;
  payment_status: string;
  tracking_code: string | null;
  delivery_status: string | null;
  payment_reference: string | null;
  payment_method: string | null;
  processing_status: string | null;
  subtotal?: number;
  delivery_fee?: number;
  location?: any;
  type?: string;
}
