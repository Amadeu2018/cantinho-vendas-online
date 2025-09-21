import { DeliveryLocation } from "@/contexts/CartContext";

// Default delivery locations - will be replaced by dynamic data from Supabase
export const deliveryLocations: DeliveryLocation[] = [
  {
    id: "default-1",
    name: "Centro da Cidade",
    fee: 1500,
    estimatedTime: "20-30 min"
  },
  {
    id: "default-2",
    name: "Marginal",
    fee: 2000,
    estimatedTime: "30-40 min"
  },
  {
    id: "default-3",
    name: "Talatona",
    fee: 2500,
    estimatedTime: "40-50 min"
  }
];