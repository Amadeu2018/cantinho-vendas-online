import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, AlertCircle } from "lucide-react";

const NoDeliveryZones = () => {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50/30">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-cantinho-navy">
          <MapPin className="w-5 h-5" />
          <span>Localização para Entrega</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center space-y-2 text-center">
            <AlertCircle className="w-8 h-8 text-orange-500" />
            <p className="text-gray-600">
              Nenhuma zona de entrega disponível no momento
            </p>
            <p className="text-sm text-gray-500">
              Entre em contato conosco para verificar opções de entrega
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoDeliveryZones;