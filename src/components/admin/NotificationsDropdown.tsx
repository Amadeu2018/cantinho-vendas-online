
import { useState, useEffect } from "react";
import { Bell, Package, ShoppingCart, CheckCircle, XCircle, Clock } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type OrderNotification = {
  id: string;
  orderId: string;
  message: string;
  status: string;
  createdAt: string;
  read: boolean;
};

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
    
    // Set up realtime subscription for new notifications
    const channel = supabase
      .channel('admin-notifications')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'notifications' }, 
        handleNewNotification
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('type', 'order')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;

      const formattedNotifications = data.map((notification: any): OrderNotification => ({
        id: notification.id,
        orderId: notification.message.split(' ')[1] || '',
        message: notification.message,
        status: notification.title.toLowerCase().includes('novo') ? 'new' : 
                notification.title.toLowerCase().includes('atualizado') ? 'updated' : 'other',
        createdAt: notification.created_at,
        read: notification.read
      }));

      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.filter(n => !n.read).length);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewNotification = (payload: any) => {
    const newNotif = payload.new;
    
    if (newNotif && newNotif.type === 'order') {
      // Add new notification to the list
      const formattedNotification: OrderNotification = {
        id: newNotif.id,
        orderId: newNotif.message.split(' ')[1] || '',
        message: newNotif.message,
        status: newNotif.title.toLowerCase().includes('novo') ? 'new' : 
                newNotif.title.toLowerCase().includes('atualizado') ? 'updated' : 'other',
        createdAt: newNotif.created_at,
        read: newNotif.read
      };
      
      setNotifications(prev => [formattedNotification, ...prev].slice(0, 10));
      setUnreadCount(prev => prev + 1);
      
      // Show toast for new notification
      toast({
        title: newNotif.title,
        description: newNotif.message,
      });
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
        
      if (error) throw error;
      
      // Update local state
      setNotifications(
        notifications.map(notification =>
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const notificationIds = notifications
        .filter(n => !n.read)
        .map(n => n.id);
        
      if (notificationIds.length === 0) return;
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', notificationIds);
        
      if (error) throw error;
      
      // Update local state
      setNotifications(
        notifications.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
      
      toast({
        title: "Notificações",
        description: "Todas as notificações foram marcadas como lidas.",
      });
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
    }
  };

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
              onClick={markAllAsRead}
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
                <DropdownMenuItem
                  key={notification.id}
                  className={`p-3 cursor-pointer flex gap-3 ${!notification.read ? 'bg-muted/50' : ''}`}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id);
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
              ))}
            </DropdownMenuGroup>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
