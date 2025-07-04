import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'delivery' | 'event';
  read: boolean;
  created_at: string;
  order_id?: string;
}

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', 'admin')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedNotifications = (data || []).map((notification: any): AdminNotification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type as AdminNotification['type'],
        read: notification.read || false,
        created_at: notification.created_at,
        order_id: extractOrderId(notification.message)
      }));

      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractOrderId = (message: string): string | undefined => {
    const match = message.match(/#([a-f0-9-]{8})/);
    return match ? match[1] : undefined;
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      
      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', unreadIds);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);

      toast({
        title: "Sucesso",
        description: "Todas as notificações foram marcadas como lidas.",
      });
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const handleNewNotification = (payload: any) => {
    const newNotification: AdminNotification = {
      id: payload.new.id,
      title: payload.new.title,
      message: payload.new.message,
      type: payload.new.type,
      read: false,
      created_at: payload.new.created_at,
      order_id: extractOrderId(payload.new.message)
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
    setUnreadCount(prev => prev + 1);

    // Show toast for important notifications
    if (payload.new.type === 'order') {
      toast({
        title: payload.new.title,
        description: payload.new.message,
      });
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Set up real-time subscription
    const channel = supabase
      .channel('admin-notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: 'user_id=eq.admin'
        }, 
        handleNewNotification
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    fetchNotifications
  };
};