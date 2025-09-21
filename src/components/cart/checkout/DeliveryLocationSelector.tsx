
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, CheckCircle } from "lucide-react";
import { DeliveryLocation } from "@/contexts/CartContext";
import { useCurrency } from "@/hooks/use-currency";
import DeliveryZoneLoadingState from "./DeliveryZoneLoadingState";
import NoDeliveryZones from "./NoDeliveryZones";

interface DeliveryLocationSelectorProps {
  locations: DeliveryLocation[];
  selectedLocation: DeliveryLocation | null;
  onLocationSelect: (location: DeliveryLocation) => void;
  loading?: boolean;
}

const DeliveryLocationSelector = ({ 
  locations, 
  selectedLocation, 
  onLocationSelect,
  loading = false
}: DeliveryLocationSelectorProps) => {
  const { formatPrice } = useCurrency();
  
  // Show loading state
  if (loading) {
    return <DeliveryZoneLoadingState />;
  }
  
  // Show no zones message if empty
  if (!locations || locations.length === 0) {
    return <NoDeliveryZones />;
  }
  
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-cantinho-navy">
          <MapPin className="w-5 h-5" />
          <span>Localização para Entrega</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map((location) => (
            <div
              key={location.id}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedLocation?.id === location.id
                  ? "border-cantinho-terracotta bg-cantinho-terracotta/5 shadow-lg"
                  : "border-gray-200 hover:border-cantinho-terracotta/50 bg-white"
              }`}
              onClick={() => onLocationSelect(location)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold text-cantinho-navy">{location.name}</div>
                {selectedLocation?.id === location.id && (
                  <CheckCircle className="w-5 h-5 text-cantinho-terracotta" />
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {location.estimatedTime}
                </div>
                <Badge variant="secondary" className="bg-cantinho-terracotta text-white">
                  {formatPrice(location.fee)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryLocationSelector;
