
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Eye, Trash2, Check } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Invoice } from "../EventRequestDetail";

interface EventInvoicesListProps {
  invoices: Invoice[];
  loadingInvoices: boolean;
  getStatusBadge: (status: string) => JSX.Element;
  onShowInvoiceForm: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onMarkPaid: (invoiceId: string) => void;
  onDeleteInvoice: (invoiceId: string) => void;
}

const EventInvoicesList = ({
  invoices,
  loadingInvoices,
  getStatusBadge,
  onShowInvoiceForm,
  onViewInvoice,
  onMarkPaid,
  onDeleteInvoice
}: EventInvoicesListProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Faturas Associadas
        </CardTitle>
        <Button onClick={onShowInvoiceForm} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nova Fatura
        </Button>
      </CardHeader>
      <CardContent>
        {loadingInvoices ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-6 w-6 border-4 border-cantinho-terracotta border-opacity-50 border-t-cantinho-terracotta rounded-full"></div>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-2" />
            <p>Nenhuma fatura encontrada</p>
            <p className="text-sm">Clique em "Nova Fatura" para criar uma.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium">{invoice.numero}</span>
                    {getStatusBadge(invoice.status)}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {new Intl.NumberFormat('pt-AO', {
                        style: 'currency',
                        currency: 'AOA',
                      }).format(invoice.valor)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(invoice.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                
                {invoice.descricao && (
                  <p className="text-sm text-muted-foreground mb-3">{invoice.descricao}</p>
                )}
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewInvoice(invoice)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Fatura
                  </Button>
                  
                  {invoice.status !== "pago" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMarkPaid(invoice.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Marcar como Pago
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeleteInvoice(invoice.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventInvoicesList;
