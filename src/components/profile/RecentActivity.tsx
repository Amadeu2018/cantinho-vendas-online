
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShoppingBag, Heart, MessageCircle } from "lucide-react";

interface Activity {
  id: string;
  type: 'order' | 'favorite' | 'review';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'order':
        return ShoppingBag;
      case 'favorite':
        return Heart;
      case 'review':
        return MessageCircle;
      default:
        return ShoppingBag;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'order':
        return 'text-blue-600 bg-blue-50';
      case 'favorite':
        return 'text-red-600 bg-red-50';
      case 'review':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'preparing':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'delivering':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(activity.timestamp), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </p>
                      </div>
                      {activity.status && (
                        <Badge variant="outline" className={getStatusColor(activity.status)}>
                          {activity.status === 'pending' ? 'Pendente' :
                           activity.status === 'confirmed' ? 'Confirmado' :
                           activity.status === 'preparing' ? 'Preparando' :
                           activity.status === 'delivering' ? 'Entregando' :
                           activity.status === 'completed' ? 'Concluído' : activity.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">
            Nenhuma atividade recente
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
