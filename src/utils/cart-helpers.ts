import { DeliveryLocation, PaymentMethod } from "@/contexts/CartContext";

// Default payment methods - these are static configurations
export const paymentMethods: PaymentMethod[] = [
  {
    id: "cash",
    name: "Dinheiro na Entrega",
    icon: "💰"
  },
  {
    id: "multicaixa",
    name: "Multicaixa",
    icon: "💳"
  },
  {
    id: "bank_transfer",
    name: "Transferência Bancária",
    icon: "🏦"
  }
];

// Default delivery locations - will be replaced by dynamic data from Supabase
export const deliveryLocations: DeliveryLocation[] = [
  {
    id: 1,
    name: "Centro da Cidade",
    fee: 1500,
    estimatedTime: "20-30 min"
  },
  {
    id: 2,
    name: "Marginal",
    fee: 2000,
    estimatedTime: "30-40 min"
  },
  {
    id: 3,
    name: "Talatona",
    fee: 2500,
    estimatedTime: "40-50 min"
  }
];