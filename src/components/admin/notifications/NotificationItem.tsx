import { Button } from "@/components/ui/button";
import { Check, ShoppingCart, Package, CreditCard, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface NotificationItemProps {
  notification: {
    id: string;
    orderId: string;
    message: string;
    status: string;
    createdAt: string;
    read: boolean;
  };
  onMarkAsRead: (id: string) => Promise<void>;
}

const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (notification.status) {
      case 'new':
        return <ShoppingCart className="h-4 w-4" />;
      case 'updated':
        return <Package className="h-4 w-4" />;
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      case 'event':
        return <CalendarDays className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (notification.status) {
      case 'new':
        return 'bg-green-100 text-green-600';
      case 'updated':
        return 'bg-blue-100 text-blue-600';
      case 'payment':
        return 'bg-yellow-100 text-yellow-600';
      case 'event':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (notification.orderId) {
      navigate(`/admin?view=orders&orderId=${notification.orderId}`);
    }
  };

  return (
    <div 
      className={cn(
        "p-3 hover:bg-gray-50 cursor-pointer transition-colors",
        !notification.read && "bg-blue-50/50"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        <div className={cn("flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center", getStatusColor())}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm", notification.read ? "text-gray-600" : "text-gray-900 font-medium")}>
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
              locale: ptBR
            })}
          </p>
        </div>
        {!notification.read && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;