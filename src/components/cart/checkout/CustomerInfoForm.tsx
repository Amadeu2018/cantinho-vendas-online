
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Shield } from "lucide-react";
import { CustomerInfo } from "@/contexts/CartContext";

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CustomerInfoForm = ({ customerInfo, onChange }: CustomerInfoFormProps) => {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-cantinho-cream/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-cantinho-navy">
          <Shield className="w-5 h-5" />
          <span>Informações de Entrega</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
              Nome Completo *
            </label>
            <Input
              id="name"
              name="name"
              value={customerInfo.name}
              onChange={onChange}
              placeholder="Seu nome completo"
              required
              className="border-gray-300 focus:border-cantinho-terracotta focus:ring-cantinho-terracotta"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
              Telefone *
            </label>
            <Input
              id="phone"
              name="phone"
              value={customerInfo.phone}
              onChange={onChange}
              placeholder="Ex: +244 924 678 544"
              required
              className="border-gray-300 focus:border-cantinho-terracotta focus:ring-cantinho-terracotta"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-700">
            Endereço Detalhado *
          </label>
          <Input
            id="address"
            name="address"
            value={customerInfo.address}
            onChange={onChange}
            placeholder="Rua, número, bairro, referências..."
            required
            className="border-gray-300 focus:border-cantinho-terracotta focus:ring-cantinho-terracotta"
          />
        </div>
        
        <div>
          <label htmlFor="notes" className="block mb-2 text-sm font-medium text-gray-700">
            Observações (opcional)
          </label>
          <Textarea
            id="notes"
            name="notes"
            value={customerInfo.notes}
            onChange={onChange}
            placeholder="Instruções especiais para entrega ou preparo dos pratos..."
            rows={3}
            className="border-gray-300 focus:border-cantinho-terracotta focus:ring-cantinho-terracotta resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerInfoForm;
