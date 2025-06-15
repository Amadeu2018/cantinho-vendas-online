
import React, { useState } from "react";
import { useCart, CustomerInfo } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle } from "lucide-react";
import CustomerInfoForm from "./checkout/CustomerInfoForm";
import DeliveryLocationSelector from "./checkout/DeliveryLocationSelector";
import SimplePaymentSelector from "./checkout/SimplePaymentSelector";

const CheckoutForm = ({ onSuccess }: { onSuccess: (orderId: string) => void }) => {
  const { toast } = useToast();
  const { 
    deliveryLocations, 
    selectedLocation, 
    setSelectedLocation,
    paymentMethods,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    submitOrder
  } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    address: "",
    phone: "",
    notes: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLocation) {
      toast({
        title: "Localização necessária",
        description: "Por favor, selecione uma localização de entrega",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedPaymentMethod) {
      toast({
        title: "Método de pagamento necessário",
        description: "Por favor, selecione um método de pagamento",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const orderId = await submitOrder(customerInfo);
      toast({
        title: "Pedido enviado com sucesso!",
        description: `Seu pedido #${orderId.substring(0, 8)} foi registrado. Aguarde a confirmação.`,
      });
      onSuccess(orderId);
    } catch (error) {
      toast({
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar o pedido",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <CustomerInfoForm 
          customerInfo={customerInfo}
          onChange={handleChange}
        />
        
        <DeliveryLocationSelector
          locations={deliveryLocations}
          selectedLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
        />
        
        <SimplePaymentSelector
          paymentMethods={paymentMethods}
          selectedPaymentMethod={selectedPaymentMethod}
          onMethodSelect={setSelectedPaymentMethod}
        />
        
        <div className="flex justify-center">
          <Button
            type="submit"
            className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-cantinho-terracotta to-cantinho-terracotta/90 hover:from-cantinho-terracotta/90 hover:to-cantinho-terracotta text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processando Pedido...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Finalizar Pedido</span>
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
