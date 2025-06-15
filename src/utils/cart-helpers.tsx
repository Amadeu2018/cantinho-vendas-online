
import { DeliveryLocation, PaymentMethod } from "@/contexts/CartContext";

export const deliveryLocations: DeliveryLocation[] = [
  { id: 1, name: "Bairro Azul", fee: 1000, estimatedTime: "20-30 min" },
  { id: 2, name: "Maculusso", fee: 1500, estimatedTime: "25-35 min" },
  { id: 3, name: "Maianga", fee: 1500, estimatedTime: "25-35 min" },
  { id: 4, name: "Talatona", fee: 2500, estimatedTime: "35-50 min" },
  { id: 5, name: "Miramar", fee: 1800, estimatedTime: "30-40 min" },
  { id: 6, name: "Kilamba", fee: 3000, estimatedTime: "40-60 min" }
];

export const paymentMethods: PaymentMethod[] = [
  { id: "cash", name: "Dinheiro na Entrega", icon: "banknote" },
  { id: "multicaixa", name: "Multicaixa Express", icon: "credit-card" },
  { id: "transfer", name: "Transferência Bancária", icon: "landmark" }
];
