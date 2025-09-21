import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Package } from "lucide-react";
import { Link } from "react-router-dom";

interface CheckoutSuccessProps {
  orderId: string;
  onBackToShopping: () => void;
}

const CheckoutSuccess = ({ orderId, onBackToShopping }: CheckoutSuccessProps) => {
  return (
    <Card className="text-center py-16 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardContent className="pt-6">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        
        <h2 className="text-3xl font-bold mb-3 text-cantinho-navy">
          Pedido Confirmado!
        </h2>
        
        <p className="text-gray-600 mb-2">
          Seu pedido foi recebido com sucesso
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <div className="flex items-center justify-center space-x-2">
            <Package className="w-5 h-5 text-cantinho-terracotta" />
            <span className="font-semibold text-cantinho-navy">
              Número do Pedido:
            </span>
            <code className="bg-white px-2 py-1 rounded text-cantinho-terracotta font-mono">
              #{orderId.substring(0, 8)}
            </code>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
          Você receberá uma confirmação e atualizações sobre o status do seu pedido em breve. 
          O tempo estimado de entrega será informado por nossa equipe.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={onBackToShopping}
            className="bg-gradient-to-r from-cantinho-terracotta to-cantinho-terracotta/90 hover:from-cantinho-terracotta/90 hover:to-cantinho-terracotta shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowRight className="mr-2 w-4 h-4" />
            Continuar Comprando
          </Button>
          
          <div className="text-center">
            <Button variant="outline" asChild>
              <Link to="/pedidos">Ver Meus Pedidos</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutSuccess;