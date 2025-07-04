
import { useEffect } from "react";
import { Bell } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminNotifications } from "@/hooks/use-admin-notifications";
import NotificationItem from "./notifications/NotificationItem";

const NotificationsDropdown = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead
  } = useAdminNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 md:w-96" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              className="text-xs h-7 px-2"
              onClick={markAllAsRead}
            >
              Marcar tudo como lido
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin h-5 w-5 border-2 border-cantinho-terracotta border-t-transparent rounded-full"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhuma notificação encontrada
            </div>
          ) : (
            <DropdownMenuGroup>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={{
                    id: notification.id,
                    orderId: notification.order_id || '',
                    message: notification.message,
                    status: notification.type,
                    createdAt: notification.created_at,
                    read: notification.read
                  }}
                  onMarkAsRead={markAsRead}
                />
              ))}
            </DropdownMenuGroup>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
