
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, CheckCircle, Shield, Banknote, Landmark } from "lucide-react";
import { PaymentMethod } from "@/contexts/CartContext";

interface SimplePaymentSelectorProps {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  onMethodSelect: (method: PaymentMethod) => void;
}

const SimplePaymentSelector = ({ 
  paymentMethods, 
  selectedPaymentMethod, 
  onMethodSelect 
}: SimplePaymentSelectorProps) => {
  const getPaymentIcon = (methodId: string, iconName: string) => {
    if (methodId === 'cash') return <Banknote className="h-5 w-5" />;
    if (methodId.startsWith('bank_')) return <Landmark className="h-5 w-5" />;
    if (methodId.startsWith('multicaixa_')) return <CreditCard className="h-5 w-5" />;
    
    // Fallback to icon name
    switch (iconName) {
      case "banknote":
        return <Banknote className="h-5 w-5" />;
      case "credit-card":
        return <CreditCard className="h-5 w-5" />;
      case "landmark":
        return <Landmark className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-cantinho-navy">
          <CreditCard className="w-5 h-5" />
          <span>Método de Pagamento</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedPaymentMethod?.id === method.id
                  ? "border-cantinho-terracotta bg-cantinho-terracotta/5 shadow-lg"
                  : "border-gray-200 hover:border-cantinho-terracotta/50 bg-white"
              }`}
              onClick={() => onMethodSelect(method)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    selectedPaymentMethod?.id === method.id 
                      ? "bg-cantinho-terracotta text-white" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {getPaymentIcon(method.id, method.icon)}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-cantinho-navy">{method.name}</span>
                    {method.details && (
                      <div className="text-xs text-gray-600 mt-1">
                        {method.details.bank_name && (
                          <div>Banco: {method.details.bank_name}</div>
                        )}
                        {method.details.account_name && (
                          <div>Titular: {method.details.account_name}</div>
                        )}
                        {method.details.phone_number && (
                          <div>Telefone: {method.details.phone_number}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {selectedPaymentMethod?.id === method.id && (
                  <CheckCircle className="w-5 h-5 text-cantinho-terracotta" />
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Pagamento Seguro</p>
              <p className="text-xs text-amber-700 mt-1">
                O pagamento será processado conforme o método selecionado após a confirmação do pedido. 
                Seus dados estão protegidos e seguros.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimplePaymentSelector;
