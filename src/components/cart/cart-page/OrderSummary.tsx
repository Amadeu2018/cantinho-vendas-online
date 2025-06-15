
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Gift, ArrowRight, Shield } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DeliveryLocation } from "@/contexts/CartContext";

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  selectedLocation: DeliveryLocation | null;
  total: number;
  checkoutStep: number;
  onProceedToPayment: () => void;
  onBackToCart: () => void;
}

const OrderSummary = ({
  subtotal,
  discount,
  deliveryFee,
  selectedLocation,
  total,
  checkoutStep,
  onProceedToPayment,
  onBackToCart
}: OrderSummaryProps) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-cantinho-navy">
          <MapPin className="w-5 h-5" />
          <span>Resumo do Pedido</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span className="flex items-center">
                <Gift className="w-4 h-4 mr-1" />
                Desconto (10%)
              </span>
              <span className="font-medium">-{formatCurrency(discount)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Taxa de Entrega</span>
            {selectedLocation ? (
              <span className="font-medium">{formatCurrency(deliveryFee)}</span>
            ) : (
              <span className="text-gray-500 text-sm">Selecione localização</span>
            )}
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-bold text-lg text-cantinho-navy">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          {checkoutStep === 1 ? (
            <Button
              className="w-full bg-gradient-to-r from-cantinho-terracotta to-cantinho-terracotta/90 hover:from-cantinho-terracotta/90 hover:to-cantinho-terracotta shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={onProceedToPayment}
              size="lg"
            >
              Prosseguir para Pagamento
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full transition-all hover:bg-muted"
              onClick={onBackToCart}
            >
              Voltar ao Carrinho
            </Button>
          )}
          
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <Shield className="w-4 h-4" />
            <span>
              {checkoutStep === 1 
                ? "Pagamento seguro e dados protegidos"
                : "Seus dados estão seguros conosco"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
