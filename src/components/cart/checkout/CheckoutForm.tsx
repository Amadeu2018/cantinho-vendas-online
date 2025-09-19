import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useDeliveryZones } from "@/hooks/use-delivery-zones";
import { usePaymentMethods } from "@/hooks/use-payment-methods";
import { useCurrency } from "@/hooks/use-currency";
import { useNotifications } from "@/hooks/use-notifications";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DeliveryLocationSelector from "./DeliveryLocationSelector";
import PaymentMethodSelector from "../PaymentMethodSelector";
import { ShoppingCart, User, MapPin, CreditCard, FileText } from "lucide-react";

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

const CheckoutForm = () => {
  const { 
    items, 
    selectedLocation, 
    setSelectedLocation, 
    selectedPaymentMethod, 
    setSelectedPaymentMethod,
    clearCart 
  } = useCart();
  
  const { deliveryZones, loading: loadingZones } = useDeliveryZones();
  const { paymentMethods, loading: loadingMethods } = usePaymentMethods();
  const { formatPrice } = useCurrency();
  const { createNotification } = useNotifications();

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    email: "",
    address: ""
  });
  
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate totals
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = selectedLocation?.fee || 0;
  const total = subtotal + deliveryFee;

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!customerInfo.name.trim()) {
      toast.error("Por favor, preencha o seu nome");
      return false;
    }
    
    if (!customerInfo.phone.trim()) {
      toast.error("Por favor, preencha o seu telefone");
      return false;
    }
    
    if (!customerInfo.address.trim()) {
      toast.error("Por favor, preencha o seu endereço");
      return false;
    }
    
    if (!selectedLocation) {
      toast.error("Por favor, selecione uma zona de entrega");
      return false;
    }
    
    if (!selectedPaymentMethod) {
      toast.error("Por favor, selecione um método de pagamento");
      return false;
    }
    
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio");
      return false;
    }

    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      const orderData = {
        customer_id: user?.id || null,
        customer_info: customerInfo as any,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          customizations: item.customizations || {}
        })) as any,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        status: 'pending',
        payment_status: 'pending',
        payment_method: selectedPaymentMethod.id,
        payment_details: selectedPaymentMethod.details || {} as any,
        notes,
        estimated_delivery: new Date(Date.now() + 60 * 60 * 1000).toISOString()
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Create notification for customer
      if (user) {
        await createNotification(
          'Pedido Confirmado',
          `Seu pedido #${order.id.substring(0, 8)} foi recebido e está sendo processado.`,
          'order'
        );
      }

      // Clear cart and show success
      clearCart();
      setCustomerInfo({ name: "", phone: "", email: "", address: "" });
      setNotes("");
      
      toast.success("Pedido realizado com sucesso!", {
        description: `Número do pedido: #${order.id.substring(0, 8)}`,
        duration: 5000,
      });

    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error("Erro ao processar pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Seu carrinho está vazio</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Resumo do Pedido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{item.name} x{item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <hr className="my-3" />
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de Entrega:</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span className="text-cantinho-terracotta">{formatPrice(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={customerInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={customerInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+244 900 000 000"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email (Opcional)</Label>
            <Input
              id="email"
              type="email"
              value={customerInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <Label htmlFor="address">Endereço de Entrega *</Label>
            <Textarea
              id="address"
              value={customerInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Endereço completo para entrega"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Delivery Location */}
      {!loadingZones && deliveryZones.length > 0 && (
        <DeliveryLocationSelector
          locations={deliveryZones}
          selectedLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
        />
      )}

      {/* Payment Method */}
      {!loadingMethods && paymentMethods.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Método de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentMethodSelector
              paymentMethods={paymentMethods}
              selectedMethod={selectedPaymentMethod}
              onSelectMethod={setSelectedPaymentMethod}
            />
          </CardContent>
        </Card>
      )}

      {/* Order Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Observações (Opcional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Instruções especiais para o seu pedido..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        onClick={handleSubmitOrder}
        disabled={isSubmitting}
        className="w-full h-12 text-lg bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
      >
        {isSubmitting ? "Processando..." : `Finalizar Pedido - ${formatPrice(total)}`}
      </Button>
    </div>
  );
};

export default CheckoutForm;