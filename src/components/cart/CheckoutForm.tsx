
import React, { useState } from "react";
import { useCart, CustomerInfo } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Banknote, 
  CreditCard, 
  Landmark,
  Loader2,
  MapPin,
  Clock,
  Shield,
  CheckCircle
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
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Information */}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
                placeholder="Instruções especiais para entrega ou preparo dos pratos..."
                rows={3}
                className="border-gray-300 focus:border-cantinho-terracotta focus:ring-cantinho-terracotta resize-none"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Delivery Location */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-cantinho-navy">
              <MapPin className="w-5 h-5" />
              <span>Localização para Entrega</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliveryLocations.map((location) => (
                <div
                  key={location.id}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedLocation?.id === location.id
                      ? "border-cantinho-terracotta bg-cantinho-terracotta/5 shadow-lg"
                      : "border-gray-200 hover:border-cantinho-terracotta/50 bg-white"
                  }`}
                  onClick={() => setSelectedLocation(location)}
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
                      {new Intl.NumberFormat("pt-AO", {
                        style: "currency",
                        currency: "AOA",
                        minimumFractionDigits: 0,
                      }).format(location.fee)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Payment Method */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-cantinho-navy">
              <CreditCard className="w-5 h-5" />
              <span>Método de Pagamento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedPaymentMethod?.id === method.id
                      ? "border-cantinho-terracotta bg-cantinho-terracotta/5 shadow-lg"
                      : "border-gray-200 hover:border-cantinho-terracotta/50 bg-white"
                  }`}
                  onClick={() => setSelectedPaymentMethod(method)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        selectedPaymentMethod?.id === method.id 
                          ? "bg-cantinho-terracotta text-white" 
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {getPaymentIcon(method.icon)}
                      </div>
                      <span className="font-medium text-cantinho-navy">{method.name}</span>
                    </div>
                    {selectedPaymentMethod?.id === method.id && (
                      <CheckCircle className="w-5 h-5 text-cantinho-terracotta" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Pagamento Seguro</p>
                  <p className="text-xs text-amber-700 mt-1">
                    O pagamento será processado conforme o método selecionado após a confirmação do pedido. 
                    Seus dados estão protegidos e seguros.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Submit Button */}
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
