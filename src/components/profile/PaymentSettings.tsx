
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

const PaymentSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Configurações de Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          As configurações de pagamento são geridas pelo administrador do sistema.
          Entre em contacto para alterações nas formas de pagamento.
        </p>
      </CardContent>
    </Card>
  );
};

export default PaymentSettings;
