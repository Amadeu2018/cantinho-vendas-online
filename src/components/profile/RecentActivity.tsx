
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShoppingBag, Heart, MessageCircle, Eye, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Activity {
  id: string;
  type: 'order' | 'favorite' | 'review';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  total?: number;
  itemsCount?: number;
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  const navigate = useNavigate();

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Atividade Recente</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/perfil?tab=orders')}
          >
            Ver Todos
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        {activity.total && (
                          <p className="text-sm font-semibold text-cantinho-terracotta mt-1">
                            {formatPrice(activity.total)}
                            {activity.itemsCount && (
                              <span className="text-gray-500 font-normal ml-2">
                                • {activity.itemsCount} item(s)
                              </span>
                            )}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(activity.timestamp), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {activity.status && (
                          <Badge variant="outline" className={getStatusColor(activity.status)}>
                            {activity.status === 'pending' ? 'Pendente' :
                             activity.status === 'confirmed' ? 'Confirmado' :
                             activity.status === 'preparing' ? 'Preparando' :
                             activity.status === 'delivering' ? 'Entregando' :
                             activity.status === 'completed' ? 'Concluído' : activity.status}
                          </Badge>
                        )}
                        {activity.type === 'order' && activity.status && 
                         ['pending', 'confirmed', 'preparing', 'delivering'].includes(activity.status) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/perfil?tab=tracking')}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Acompanhar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Nenhuma atividade recente</p>
            <Button 
              onClick={() => navigate('/menu')}
              className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
            >
              Fazer Primeiro Pedido
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
