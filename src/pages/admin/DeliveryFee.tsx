import DeliveryFeeManager from "@/components/admin/delivery/DeliveryFeeManager";

const DeliveryFee = () => {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-cantinho-navy mb-2">
            Gestão de Taxas de Entrega
          </h1>
          <p className="text-gray-600">
            Configure zonas de entrega e suas respectivas taxas para otimizar seu serviço de delivery.
          </p>
        </div>
        
        <DeliveryFeeManager />
      </div>
    </div>
  );
};

export default DeliveryFee;