
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle, Clock, CreditCard, Building2, Phone, FileText } from "lucide-react";
import { useCompanySettings } from "@/hooks/company/use-company-settings";
import { useBankAccounts } from "@/hooks/company/use-bank-accounts";
import { useMulticaixaAccounts } from "@/hooks/company/use-multicaixa-accounts";

interface OrderReceiptProps {
  order: {
    id: string;
    total: number;
    created_at: string;
    status: string;
    payment_status: string;
    payment_method?: string;
    payment_reference?: string;
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    customer_info: {
      name?: string;
      email?: string;
      phone?: string;
    };
    subtotal?: number;
    delivery_fee?: number;
  };
}

const OrderReceipt = ({ order }: OrderReceiptProps) => {
  const { settings: companySettings, loading: loadingSettings } = useCompanySettings();
  const { accounts: bankAccounts } = useBankAccounts();
  const { accounts: multicaixaAccounts } = useMulticaixaAccounts();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'Pendente';
      case 'processing': return 'Processando';
      case 'completed': return 'Concluído';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      case 'paid': return 'Pago';
      case 'failed': return 'Falhado';
      default: return status;
    }
  };

  const primaryBankAccount = bankAccounts.find(acc => acc.is_primary && acc.is_active) || bankAccounts.find(acc => acc.is_active);
  const primaryMulticaixaAccount = multicaixaAccounts.find(acc => acc.is_primary && acc.is_active) || multicaixaAccounts.find(acc => acc.is_active);

  const renderPaymentInfo = () => {
    if (!order.payment_method) return null;

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5" />
            Informações de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Método de Pagamento</p>
              <p className="font-semibold">
                {order.payment_method === 'bank_transfer' ? 'Transferência Bancária' :
                 order.payment_method === 'multicaixa' ? 'Multicaixa Express' :
                 order.payment_method === 'cash' ? 'Dinheiro na Entrega' : order.payment_method}
              </p>
            </div>
            {order.payment_reference && (
              <div>
                <p className="text-sm text-gray-600">Referência do Pagamento</p>
                <p className="font-semibold font-mono">{order.payment_reference}</p>
              </div>
            )}
          </div>

          {/* Informações de Transferência Bancária */}
          {order.payment_method === 'bank_transfer' && primaryBankAccount && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 flex items-center gap-2 mb-3">
                <Building2 className="h-4 w-4" />
                Dados para Transferência Bancária
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">IBAN:</span>
                  <span className="ml-2 font-mono font-semibold">{primaryBankAccount.account_iban}</span>
                </div>
                <div>
                  <span className="text-gray-600">Titular:</span>
                  <span className="ml-2 font-semibold">{primaryBankAccount.account_name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Banco:</span>
                  <span className="ml-2">{primaryBankAccount.bank_name}</span>
                </div>
                {primaryBankAccount.swift_code && (
                  <div>
                    <span className="text-gray-600">SWIFT:</span>
                    <span className="ml-2 font-mono">{primaryBankAccount.swift_code}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Informações Multicaixa Express */}
          {order.payment_method === 'multicaixa' && primaryMulticaixaAccount && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 flex items-center gap-2 mb-3">
                <Phone className="h-4 w-4" />
                Dados para Multicaixa Express
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Número:</span>
                  <span className="ml-2 font-mono font-semibold">{primaryMulticaixaAccount.phone_number}</span>
                </div>
                <div>
                  <span className="text-gray-600">Titular:</span>
                  <span className="ml-2 font-semibold">{primaryMulticaixaAccount.account_name}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notas de Pagamento */}
          {companySettings.payment_notes && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" />
                Instruções Importantes
              </h4>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {companySettings.payment_notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Empresa */}
      {!loadingSettings && (companySettings.company_name || companySettings.company_logo_url) && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              {companySettings.company_logo_url && (
                <img 
                  src={companySettings.company_logo_url} 
                  alt="Logo da empresa"
                  className="h-16 w-16 object-contain"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-cantinho-navy">
                  {companySettings.company_name || 'Cantinho Angolano'}
                </h1>
                {companySettings.company_address && (
                  <p className="text-gray-600">{companySettings.company_address}</p>
                )}
                <div className="flex gap-4 text-sm text-gray-600 mt-1">
                  {companySettings.company_phone && (
                    <span>{companySettings.company_phone}</span>
                  )}
                  {companySettings.company_email && (
                    <span>{companySettings.company_email}</span>
                  )}
                  {companySettings.company_nif && (
                    <span>NIF: {companySettings.company_nif}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recibo do Pedido */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Recibo do Pedido
            </CardTitle>
            <Badge className={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Informações do Pedido */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Número do Pedido</p>
              <p className="font-semibold font-mono">#{order.id.slice(0, 8)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Data do Pedido</p>
              <p className="font-semibold">
                {format(new Date(order.created_at), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status do Pagamento</p>
              <Badge className={getStatusColor(order.payment_status)}>
                {getStatusText(order.payment_status)}
              </Badge>
            </div>
          </div>

          {/* Informações do Cliente */}
          {order.customer_info && (
            <div>
              <h3 className="font-semibold mb-2">Informações do Cliente</h3>
              <div className="space-y-1 text-sm">
                {order.customer_info.name && <p><strong>Nome:</strong> {order.customer_info.name}</p>}
                {order.customer_info.email && <p><strong>Email:</strong> {order.customer_info.email}</p>}
                {order.customer_info.phone && <p><strong>Telefone:</strong> {order.customer_info.phone}</p>}
              </div>
            </div>
          )}

          <Separator />

          {/* Itens do Pedido */}
          <div>
            <h3 className="font-semibold mb-3">Itens do Pedido</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    {(item.price * item.quantity).toLocaleString('pt-AO', {
                      style: 'currency',
                      currency: 'AOA'
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Resumo Financeiro */}
          <div className="space-y-2">
            {order.subtotal && (
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{order.subtotal.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
              </div>
            )}
            {order.delivery_fee && order.delivery_fee > 0 && (
              <div className="flex justify-between">
                <span>Taxa de Entrega:</span>
                <span>{order.delivery_fee.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>{order.total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações de Pagamento */}
      {renderPaymentInfo()}

      {/* Rodapé */}
      <Card>
        <CardContent className="pt-6 text-center text-sm text-gray-600">
          <p>Obrigado pela sua compra!</p>
          <p>Em caso de dúvidas, entre em contacto connosco.</p>
          {companySettings.company_email && (
            <p className="mt-2">Email: {companySettings.company_email}</p>
          )}
          {companySettings.company_phone && (
            <p>Telefone: {companySettings.company_phone}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderReceipt;
