
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNotificationsData } from "@/hooks/admin/use-notifications-data";
import NotificationItem from "./notifications/NotificationItem";

const NotificationsDropdown = () => {
  const { toast } = useToast();
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    handleNewNotification,
    markAsRead,
    markAllAsRead
  } = useNotificationsData();

  useEffect(() => {
    fetchNotifications();
    
    const channel = supabase
      .channel('admin-notifications-dropdown')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: 'user_id=eq.admin'
        }, 
        handleNewNotification
      )
      .subscribe((status) => {
        console.log('Notifications dropdown subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMarkAllAsRead = async () => {
    const success = await markAllAsRead();
    if (success) {
      toast({
        title: "Notificações",
        description: "Todas as notificações foram marcadas como lidas.",
      });
    }
  };

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
          <span>Notificações de Pedidos</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              className="text-xs h-7 px-2"
              onClick={handleMarkAllAsRead}
            >
              Marcar tudo como lido
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
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
                  notification={notification}
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
