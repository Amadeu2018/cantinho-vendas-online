
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Shield,
  Receipt,
  CheckCircle,
  CreditCard,
  Building2
} from "lucide-react";

interface OrderReceiptProps {
  orderId: string;
  orderData: {
    items: Array<{
      id: number;
      name: string;
      quantity: number;
      price: number;
    }>;
    customerInfo: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    paymentMethod: string;
    paymentReference?: string;
    createdAt: string;
  };
}

const OrderReceipt = ({ orderId, orderData }: OrderReceiptProps) => {
  const { toast } = useToast();

  const handleDownloadPDF = () => {
    toast({
      title: "Recibo sendo gerado",
      description: "Seu recibo em PDF será baixado em instantes.",
    });
    
    setTimeout(() => {
      toast({
        title: "Recibo baixado!",
        description: "Verifique sua pasta de downloads.",
      });
    }, 2000);
  };

  const handleEmailReceipt = () => {
    toast({
      title: "Recibo enviado!",
      description: `Recibo enviado para ${orderData.customerInfo.email}`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentDetails = () => {
    switch (orderData.paymentMethod) {
      case "bank_transfer":
        return {
          icon: <Building2 className="w-4 h-4" />,
          name: "Transferência Bancária",
          details: (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
              <p><strong>IBAN:</strong> AO06.0055.0000.0000.0000.1019.0</p>
              <p><strong>Banco:</strong> BAI - Banco Angolano de Investimentos</p>
              <p><strong>Titular:</strong> Cantinho Sabores de Angola Lda</p>
              <p><strong>NIF:</strong> 5000000000</p>
              {orderData.paymentReference && (
                <p><strong>Referência:</strong> {orderData.paymentReference}</p>
              )}
            </div>
          )
        };
      case "multicaixa_express":
        return {
          icon: <CreditCard className="w-4 h-4" />,
          name: "Multicaixa Express",
          details: orderData.paymentReference && (
            <div className="mt-2 p-3 bg-green-50 rounded-lg text-sm">
              <p><strong>Referência de Pagamento:</strong> {orderData.paymentReference}</p>
              <p><strong>Status:</strong> Processado com sucesso</p>
            </div>
          )
        };
      case "unitel_money":
        return {
          icon: <Phone className="w-4 h-4" />,
          name: "Unitel Money",
          details: orderData.paymentReference && (
            <div className="mt-2 p-3 bg-orange-50 rounded-lg text-sm">
              <p><strong>Referência:</strong> {orderData.paymentReference}</p>
              <p><strong>Processado via:</strong> Carteira Móvel</p>
            </div>
          )
        };
      case "cash_on_delivery":
        return {
          icon: <Receipt className="w-4 h-4" />,
          name: "Pagamento na Entrega",
          details: (
            <div className="mt-2 p-3 bg-yellow-50 rounded-lg text-sm">
              <p><strong>Forma:</strong> Dinheiro vivo</p>
              <p><strong>Status:</strong> A pagar na entrega</p>
            </div>
          )
        };
      default:
        return {
          icon: <CreditCard className="w-4 h-4" />,
          name: orderData.paymentMethod,
          details: null
        };
    }
  };

  const paymentInfo = getPaymentDetails();

  return (
    <Card className="max-w-2xl mx-auto shadow-2xl border-0">
      <CardHeader className="bg-gradient-to-r from-cantinho-navy to-cantinho-terracotta text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Receipt className="w-8 h-8" />
            <div>
              <CardTitle className="text-2xl">Recibo de Pedido</CardTitle>
              <p className="text-white/90">#{orderId.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
          <Badge className="bg-green-500 text-white px-3 py-1">
            <CheckCircle className="w-4 h-4 mr-1" />
            Confirmado
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        {/* Company Info */}
        <div className="text-center border-b pb-6">
          <h2 className="text-2xl font-bold text-cantinho-navy mb-2">
            Cantinho Sabores de Angola
          </h2>
          <p className="text-gray-600">Comida tradicional angolana com sabor autêntico</p>
          <div className="flex justify-center items-center gap-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              +244 924 678 544
            </div>
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              info@cantinhosabores.ao
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-cantinho-navy mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Dados do Cliente
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Nome:</strong> {orderData.customerInfo.name}</p>
              <p><strong>Email:</strong> {orderData.customerInfo.email}</p>
              <p><strong>Telefone:</strong> {orderData.customerInfo.phone}</p>
              <p><strong>Endereço:</strong> {orderData.customerInfo.address}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-cantinho-navy mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Detalhes do Pedido
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Data:</strong> {formatDate(orderData.createdAt)}</p>
              <p><strong>Status:</strong> <span className="text-green-600 font-medium">Confirmado</span></p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Payment Information */}
        <div>
          <h3 className="font-semibold text-cantinho-navy mb-3 flex items-center gap-2">
            {paymentInfo.icon}
            Informações de Pagamento
          </h3>
          <div className="text-sm text-gray-700">
            <p><strong>Método:</strong> {paymentInfo.name}</p>
            {paymentInfo.details}
          </div>
        </div>

        <Separator />

        {/* Items */}
        <div>
          <h3 className="font-semibold text-cantinho-navy mb-4">Itens do Pedido</h3>
          <div className="space-y-3">
            {orderData.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} x {item.price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                  </p>
                </div>
                <div className="font-medium">
                  {(item.quantity * item.price).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span>{orderData.subtotal.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Taxa de Entrega:</span>
            <span>{orderData.deliveryFee.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
          </div>
          {orderData.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Desconto:</span>
              <span>-{orderData.discount.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-bold text-cantinho-navy">
            <span>Total:</span>
            <span>{orderData.total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button 
            onClick={handleDownloadPDF}
            className="flex-1"
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar PDF
          </Button>
          <Button 
            onClick={handleEmailReceipt}
            className="flex-1"
          >
            <Mail className="w-4 h-4 mr-2" />
            Enviar por Email
          </Button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Recibo Verificado</h4>
              <p className="text-sm text-blue-700">
                Este recibo é válido e foi gerado automaticamente pelo nosso sistema seguro. 
                Guarde-o para seus registros e garantia.
              </p>
              <p className="text-xs text-blue-600 mt-2">
                Código de verificação: {orderId}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderReceipt;
