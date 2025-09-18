import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/contexts/CartContext";
import { CreditCard, Banknote, Smartphone } from "lucide-react";

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentMethod[];
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
}

const PaymentMethodSelector = ({ 
  paymentMethods, 
  selectedMethod, 
  onSelectMethod 
}: PaymentMethodSelectorProps) => {
  const getIcon = (methodId: string) => {
    if (methodId === 'cash') return <Banknote className="h-5 w-5" />;
    if (methodId.startsWith('bank_')) return <CreditCard className="h-5 w-5" />;
    if (methodId.startsWith('multicaixa_')) return <Smartphone className="h-5 w-5" />;
    return <CreditCard className="h-5 w-5" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Método de Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {paymentMethods.map((method) => (
          <Button
            key={method.id}
            variant={selectedMethod?.id === method.id ? "default" : "outline"}
            className={`w-full justify-start h-auto p-4 ${
              selectedMethod?.id === method.id 
                ? 'bg-cantinho-terracotta hover:bg-cantinho-terracotta/90' 
                : 'hover:bg-cantinho-cream/50'
            }`}
            onClick={() => onSelectMethod(method)}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="text-2xl">
                {method.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">{method.name}</div>
                {method.details && (
                  <div className="text-sm opacity-70 mt-1">
                    {method.details.bank_name && (
                      <div>Banco: {method.details.bank_name}</div>
                    )}
                    {method.details.account_name && (
                      <div>Titular: {method.details.account_name}</div>
                    )}
                    {method.details.account_iban && (
                      <div className="font-mono text-xs">IBAN: {method.details.account_iban}</div>
                    )}
                    {method.details.phone_number && (
                      <div>Telefone: {method.details.phone_number}</div>
                    )}
                  </div>
                )}
              </div>
              {selectedMethod?.id === method.id && (
                <Badge className="ml-auto bg-white text-cantinho-terracotta">
                  Selecionado
                </Badge>
              )}
            </div>
          </Button>
        ))}
        
        {paymentMethods.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum método de pagamento disponível</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;