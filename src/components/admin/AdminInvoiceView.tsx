
import React from "react";
import AdminInvoice from "@/components/admin/AdminInvoice";
import { Order as CartOrder } from "@/contexts/CartContext";

interface AdminInvoiceViewProps {
  order: CartOrder;
  onBack: () => void;
}

const AdminInvoiceView = ({ order, onBack }: AdminInvoiceViewProps) => {
  return (
    <div>
      <button 
        onClick={onBack}
        className="mb-4 text-cantinho-terracotta hover:text-cantinho-terracotta/80 flex items-center"
      >
        &larr; Voltar para administração
      </button>
      <AdminInvoice order={order} />
    </div>
  );
};

export default AdminInvoiceView;
