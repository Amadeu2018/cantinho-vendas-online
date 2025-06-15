
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  ChefHat, 
  Truck, 
  CheckCircle, 
  Package,
  Phone,
  ArrowLeft,
  Home
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

// Interface flexível para aceitar dados do Supabase
interface SupabaseOrder {
  id: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  customer_info: any;
  items: any[];
  payment_method: string;
  [key: string]: any;
}

interface OrderTrackingDetailProps {
  order: SupabaseOrder;
  onBack: () => void;
  formatPrice: (price: number) => string;
  getStatusName: (status: string) => string;
  getStatusColor: (status: string) => string;
  getProgressPercentage: (status: string) => number;
}

const OrderTrackingDetail = ({ 
  order, 
  onBack, 
  formatPrice, 
  getStatusName, 
  getStatusColor, 
  getProgressPercentage 
}: OrderTrackingDetailProps) => {
  const navigate = useNavigate();

  const orderSteps = [
    { 
      id: 'pending', 
      title: 'Pedido Recebido', 
      icon: Package, 
      description: 'Seu pedido foi confirmado'
    },
    { 
      id: 'confirmed', 
      title: 'Confirmado', 
      icon: CheckCircle, 
      description: 'Pedido confirmado pelo restaurante'
    },
    { 
      id: 'preparing', 
      title: 'Em Preparação', 
      icon: ChefHat, 
      description: 'Estamos preparando seu pedido'
    },
    { 
      id: 'delivering', 
      title: 'Em Entrega', 
      icon: Truck, 
      description: 'Seu pedido está a caminho'
    },
    { 
      id: 'completed', 
      title: 'Entregue', 
      icon: CheckCircle, 
      description: 'Pedido entregue com sucesso'
    }
  ];

  const currentStepIndex = orderSteps.findIndex(step => step.id === order.status);

  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Acompanhar Pedido</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4 mr-1" />
              Início
            </Button>
            <Button 
              variant="outline" 
              onClick={onBack}
            >
              Lista de Pedidos
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-sm text-gray-600">
                {formatDistanceToNow(new Date(order.created_at), {
                  addSuffix: true,
                  locale: ptBR
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold">{formatPrice(order.total)}</p>
              <Badge variant="outline" className={getStatusColor(order.status)}>
                {getStatusName(order.status)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Progresso do Pedido</span>
            <span className="text-cantinho-terracotta font-semibold">
              {Math.round(getProgressPercentage(order.status))}%
            </span>
          </div>
          <Progress value={getProgressPercentage(order.status)} className="h-2" />
        </div>

        <div className="space-y-4">
          {orderSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div 
                key={step.id}
                className={`flex items-start gap-4 p-3 rounded-lg transition-all ${
                  isActive ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  isActive 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold ${isActive ? 'text-green-800' : 'text-gray-600'}`}>
                      {step.title}
                    </h3>
                    {isCurrent && (
                      <Badge className="bg-cantinho-terracotta text-white">
                        Atual
                      </Badge>
                    )}
                  </div>
                  <p className={`text-sm ${isActive ? 'text-green-700' :text-gray-500'}`}>
                    {step.description}
                  </p>
                </div>
                {isActive && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-cantinho-cream/20 border border-cantinho-cream rounded-lg p-4">
          <h4 className="font-semibold text-cantinho-navy mb-2">Precisa de Ajuda?</h4>
          <p className="text-sm text-gray-600 mb-3">
            Entre em contato conosco se tiver alguma dúvida sobre seu pedido.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => window.open('https://wa.me/244924678544', '_blank')}
          >
            <Phone className="h-4 w-4 mr-2" />
            Contatar via WhatsApp
          </Button>
        </div>
      </CardContent>
    </>
  );
};

export default OrderTrackingDetail;
