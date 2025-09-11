
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/use-currency";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Shield, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Banknote
} from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  fee: number;
  processingTime: string;
  security: "high" | "medium" | "low";
  available: boolean;
}

interface PaymentMethodsProps {
  selectedMethod: string | null;
  onMethodSelect: (methodId: string) => void;
  total: number;
}

const PaymentMethods = ({ selectedMethod, onMethodSelect, total }: PaymentMethodsProps) => {
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const [phoneNumber, setPhoneNumber] = useState("");

  const paymentMethods: PaymentMethod[] = [
    {
      id: "multicaixa_express",
      name: "Multicaixa Express",
      icon: <CreditCard className="w-6 h-6" />,
      description: "Pagamento seguro via Multicaixa Express",
      fee: 0,
      processingTime: "Instantâneo",
      security: "high",
      available: true
    },
    {
      id: "unitel_money",
      name: "Unitel Money",
      icon: <Smartphone className="w-6 h-6" />,
      description: "Pagamento via carteira móvel Unitel Money",
      fee: total * 0.015, // 1.5% fee
      processingTime: "1-3 minutos",
      security: "high",
      available: true
    },
    {
      id: "africell_money",
      name: "Africell Money",
      icon: <Smartphone className="w-6 h-6" />,
      description: "Pagamento via carteira móvel Africell Money",
      fee: total * 0.02, // 2% fee
      processingTime: "1-3 minutos",
      security: "high",
      available: true
    },
    {
      id: "bank_transfer",
      name: "Transferência Bancária",
      icon: <Building2 className="w-6 h-6" />,
      description: "Transferência bancária nacional (TPA, BFA, BAI, etc.)",
      fee: 500, // Fixed fee of 500 AOA
      processingTime: "1-24 horas",
      security: "high",
      available: true
    },
    {
      id: "cash_on_delivery",
      name: "Pagamento na Entrega",
      icon: <Banknote className="w-6 h-6" />,
      description: "Pague em dinheiro no momento da entrega",
      fee: 0,
      processingTime: "Na entrega",
      security: "medium",
      available: true
    }
  ];

  const getSecurityBadge = (security: string) => {
    switch (security) {
      case "high":
        return <Badge className="bg-green-500 text-white">Alta Segurança</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500 text-white">Segurança Média</Badge>;
      case "low":
        return <Badge className="bg-red-500 text-white">Baixa Segurança</Badge>;
      default:
        return null;
    }
  };

  const handleMethodSelect = (methodId: string) => {
    onMethodSelect(methodId);
    
    if (methodId === "multicaixa_express" || methodId.includes("money")) {
      toast({
        title: "Método selecionado",
        description: "Você será redirecionado para completar o pagamento de forma segura."
      });
    }
  };

  const renderPaymentForm = () => {
    if (!selectedMethod) return null;

    const method = paymentMethods.find(m => m.id === selectedMethod);
    if (!method) return null;

    switch (selectedMethod) {
      case "unitel_money":
      case "africell_money":
        return (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-semibold mb-2">Dados para {method.name}</h4>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Número de Telefone</label>
              <Input
                type="tel"
                placeholder="9XX XXX XXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="max-w-sm"
              />
              <p className="text-xs text-gray-600">
                Digite o número associado à sua conta {method.name}
              </p>
            </div>
          </div>
        );

      case "multicaixa_express":
        return (
          <div className="mt-4 p-4 border rounded-lg bg-blue-50">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold">Pagamento Seguro</h4>
            </div>
            <p className="text-sm text-gray-700">
              Você será redirecionado para a plataforma segura do Multicaixa Express 
              para completar o pagamento.
            </p>
          </div>
        );

      case "bank_transfer":
        return (
          <div className="mt-4 p-4 border rounded-lg bg-green-50">
            <h4 className="font-semibold mb-2">Dados Bancários</h4>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Banco:</strong> BAI - Banco Angolano de Investimentos
                </div>
                <div>
                  <strong>IBAN:</strong> AO06.0055.0000.0000.0000.1019.0
                </div>
                <div>
                  <strong>Titular:</strong> Cantinho Sabores de Angola Lda
                </div>
                <div>
                  <strong>NIF:</strong> 5000000000
                </div>
              </div>
              <div className="mt-3 p-2 bg-yellow-100 rounded border border-yellow-300">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs text-yellow-800 font-medium">
                    Importante: Envie o comprovativo de transferência via WhatsApp (+244 924 678 544)
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case "cash_on_delivery":
        return (
          <div className="mt-4 p-4 border rounded-lg bg-orange-50">
            <div className="flex items-center gap-2 mb-2">
              <Banknote className="w-5 h-5 text-orange-600" />
              <h4 className="font-semibold">Pagamento na Entrega</h4>
            </div>
            <p className="text-sm text-gray-700">
              Tenha o dinheiro exato preparado. Nosso entregador levará uma máquina 
              de troco caso necessário.
            </p>
            <div className="mt-2 p-2 bg-orange-100 rounded">
              <p className="text-xs text-orange-800">
                <strong>Nota:</strong> Aceitamos notas até 10.000 AOA para facilitar o troco.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cantinho-navy">
          <Shield className="w-5 h-5" />
          Métodos de Pagamento Seguros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
              selectedMethod === method.id
                ? "border-cantinho-terracotta bg-cantinho-terracotta/5 shadow-lg"
                : method.available
                ? "border-gray-200 hover:border-cantinho-terracotta/50 bg-white hover:shadow-md"
                : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
            }`}
            onClick={() => method.available && handleMethodSelect(method.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedMethod === method.id 
                    ? "bg-cantinho-terracotta text-white" 
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {method.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-cantinho-navy">{method.name}</h3>
                    {selectedMethod === method.id && (
                      <CheckCircle className="w-5 h-5 text-cantinho-terracotta" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {method.processingTime}
                    </div>
                    {method.fee > 0 && (
                      <div className="font-medium text-gray-700">
                        Taxa: {formatPrice(method.fee)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                {getSecurityBadge(method.security)}
                {method.fee === 0 && (
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    Sem Taxa
                  </Badge>
                )}
              </div>
            </div>
            
            {!method.available && (
              <div className="mt-2 text-xs text-gray-500 italic">
                Temporariamente indisponível
              </div>
            )}
          </div>
        ))}

        {renderPaymentForm()}

        {selectedMethod && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">Garantia de Segurança</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Dados criptografados com SSL 256-bit</li>
                  <li>• Integração com operadores certificados</li>
                  <li>• Recibo digital enviado automaticamente</li>
                  <li>• Suporte ao cliente 24/7 via WhatsApp</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
