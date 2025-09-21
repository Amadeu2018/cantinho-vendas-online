import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";

const DeliveryZoneLoadingState = () => {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-cantinho-navy">
          <MapPin className="w-5 h-5" />
          <span>Localização para Entrega</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Carregando zonas de entrega...</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryZoneLoadingState;