import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Trash2, CheckCheck } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";

const NotificationCenter = () => {
  const { 
    notifications, 
    loading, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin h-8 w-8 border-2 border-cantinho-terracotta border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-100 text-blue-800';
      case 'order_update':
        return 'bg-yellow-100 text-yellow-800';
      case 'payment_update':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'order':
        return 'Pedido';
      case 'order_update':
        return 'Atualização';
      case 'payment_update':
        return 'Pagamento';
      case 'error':
        return 'Erro';
      default:
        return 'Info';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-cantinho-terracotta" />
            <CardTitle>Central de Notificações</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="flex items-center gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              Marcar Todas como Lidas
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma notificação encontrada</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all ${
                  notification.read 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-cantinho-terracotta/20 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-cantinho-navy'}`}>
                        {notification.title}
                      </h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getNotificationTypeColor(notification.type)}`}
                      >
                        {getNotificationTypeLabel(notification.type)}
                      </Badge>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-cantinho-terracotta rounded-full"></div>
                      )}
                    </div>
                    <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-800'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(notification.created_at), { 
                        addSuffix: true
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;