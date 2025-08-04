
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export type OrderNotification = {
  id: string;
  orderId: string;
  message: string;
  status: string;
  createdAt: string;
  read: boolean;
};

export const useNotificationsData = () => {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      console.log('Buscando notificações do admin...');
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (error) throw error;

      console.log('Notificações encontradas:', data?.length || 0);

      const formattedNotifications = (data || []).map((notification: any): OrderNotification => ({
        id: notification.id,
        orderId: notification.message.split(' ')[1] || '',
        message: notification.message,
        status: notification.title.toLowerCase().includes('novo') ? 'new' : 
                notification.title.toLowerCase().includes('atualizado') ? 'updated' : 'other',
        createdAt: notification.created_at,
        read: notification.read || false
      }));

      setNotifications(formattedNotifications);
      const unread = formattedNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
      console.log('Notificações não lidas:', unread);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewNotification = async (payload: any) => {
    console.log('Nova notificação recebida no dropdown:', payload);
    const newNotif = payload.new;
    const currentUser = await supabase.auth.getUser();
    
    if (newNotif && newNotif.user_id === currentUser.data.user?.id) {
      const formattedNotification: OrderNotification = {
        id: newNotif.id,
        orderId: newNotif.message.split(' ')[1] || '',
        message: newNotif.message,
        status: newNotif.title.toLowerCase().includes('novo') ? 'new' : 
                newNotif.title.toLowerCase().includes('atualizado') ? 'updated' : 'other',
        createdAt: newNotif.created_at,
        read: newNotif.read || false
      };
      
      setNotifications(prev => [formattedNotification, ...prev].slice(0, 20));
      if (!formattedNotification.read) {
        setUnreadCount(prev => prev + 1);
      }
      
      console.log('Notificação adicionada à lista');
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
        
      if (error) throw error;
      
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
      
      setNotifications(
        notifications.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
      return true;
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    handleNewNotification,
    markAsRead,
    markAllAsRead
  };
};
