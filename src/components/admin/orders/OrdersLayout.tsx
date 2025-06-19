
import { ReactNode } from "react";
import OrdersNavigation from "./OrdersNavigation";

interface OrdersLayoutProps {
  children: ReactNode;
  selectedOrderId: string | null;
  onBackToList: () => void;
  totalOrders: number;
  pendingOrders: number;
  onExport?: () => void;
}

const OrdersLayout = ({
  children,
  selectedOrderId,
  onBackToList,
  totalOrders,
  pendingOrders,
  onExport
}: OrdersLayoutProps) => {
  return (
    <div className="space-y-4">
      <OrdersNavigation
        selectedOrderId={selectedOrderId}
        onBackToList={onBackToList}
        totalOrders={totalOrders}
        pendingOrders={pendingOrders}
        onExport={onExport}
      />
      
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default OrdersLayout;
