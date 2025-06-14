
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AddressesListProps {
  addresses: any[];
}

const AddressesList = ({ addresses }: AddressesListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Endereços de Entrega</CardTitle>
      </CardHeader>
      <CardContent>
        {addresses.length > 0 ? (
          <div className="space-y-2">
            {addresses.map((address) => (
              <div key={address.id} className="p-3 border rounded">
                <p className="font-medium">
                  {address.street}, {address.city}
                </p>
                <p className="text-sm text-gray-600">
                  {address.state}, {address.postal_code}
                </p>
                {address.is_default && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Padrão
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Nenhum endereço cadastrado</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressesList;
