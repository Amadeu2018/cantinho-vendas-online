
import React from "react";
import UnifiedInvoiceView from "./UnifiedInvoiceView";
import { Order as CartOrder } from "@/contexts/CartContext";

interface AdminInvoiceViewProps {
  order: CartOrder;
  onBack: () => void;
}

const AdminInvoiceView = ({ order, onBack }: AdminInvoiceViewProps) => {
  return (
    <UnifiedInvoiceView 
      order={order}
      onBack={onBack}
    />
  );
};

export default AdminInvoiceView;
