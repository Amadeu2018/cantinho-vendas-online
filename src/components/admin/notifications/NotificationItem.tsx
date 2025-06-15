
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShoppingCart, Package, Clock } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { OrderNotification } from "@/hooks/admin/use-notifications-data";

interface NotificationItemProps {
  notification: OrderNotification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  const getNotificationIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case 'updated':
        return <Package className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <DropdownMenuItem
      className={`p-3 cursor-pointer flex gap-3 ${!notification.read ? 'bg-muted/50' : ''}`}
      onClick={() => {
        if (!notification.read) {
          onMarkAsRead(notification.id);
        }
      }}
    >
      <div>
        {getNotificationIcon(notification.status)}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{notification.message}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
            locale: ptBR
          })}
        </p>
      </div>
      {!notification.read && (
        <div className="self-center">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
        </div>
      )}
    </DropdownMenuItem>
  );
};

export default NotificationItem;
