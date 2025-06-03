import React, { useState } from "react";
import { useCart, CustomerInfo } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Banknote, 
  CreditCard, 
  Landmark,
  Loader2
} from "lucide-react";

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

  const getPaymentIcon = (iconName: string) => {
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
      // Submit order and get order ID
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Informações de Entrega</h3>
        <div className="space-y-3">
          <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium">
              Nome Completo
            </label>
            <Input
              id="name"
              name="name"
              value={customerInfo.name}
              onChange={handleChange}
              placeholder="Seu nome completo"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block mb-1 text-sm font-medium">
              Telefone
            </label>
            <Input
              id="phone"
              name="phone"
              value={customerInfo.phone}
              onChange={handleChange}
              placeholder="Seu número de telefone"
              required
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block mb-1 text-sm font-medium">
              Endereço Detalhado
            </label>
            <Input
              id="address"
              name="address"
              value={customerInfo.address}
              onChange={handleChange}
              placeholder="Endereço completo para entrega"
              required
            />
          </div>
          
          <div>
            <label htmlFor="notes" className="block mb-1 text-sm font-medium">
              Notas Adicionais (opcional)
            </label>
            <Textarea
              id="notes"
              name="notes"
              value={customerInfo.notes}
              onChange={handleChange}
              placeholder="Instruções especiais para entrega ou preparo..."
              rows={2}
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Localização para Entrega</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {deliveryLocations.map((location) => (
            <div
              key={location.id}
              className={`border rounded-md p-3 cursor-pointer transition-colors ${
                selectedLocation?.id === location.id
                  ? "border-cantinho-terracotta bg-cantinho-terracotta/10"
                  : "border-gray-200 hover:border-cantinho-terracotta/50"
              }`}
              onClick={() => setSelectedLocation(location)}
            >
              <div className="flex justify-between">
                <div className="font-medium">{location.name}</div>
                <div className="text-cantinho-navy font-bold">
                  {new Intl.NumberFormat("pt-AO", {
                    style: "currency",
                    currency: "AOA",
                    minimumFractionDigits: 0,
                  }).format(location.fee)}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Tempo estimado: {location.estimatedTime}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Método de Pagamento</h3>
        <div className="grid grid-cols-1 gap-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`border rounded-md p-3 cursor-pointer transition-colors ${
                selectedPaymentMethod?.id === method.id
                  ? "border-cantinho-terracotta bg-cantinho-terracotta/10"
                  : "border-gray-200 hover:border-cantinho-terracotta/50"
              }`}
              onClick={() => setSelectedPaymentMethod(method)}
            >
              <div className="flex items-center">
                {getPaymentIcon(method.icon)}
                <span className="ml-2 font-medium">{method.name}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-100 rounded-md text-sm">
          <p className="text-yellow-800">
            Para sua comodidade, o pagamento será processado conforme o método selecionado após a confirmação do pedido.
          </p>
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
        size="lg"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processando...
          </span>
        ) : (
          "Enviar Pedido"
        )}
      </Button>
    </form>
  );
};

export default CheckoutForm;
