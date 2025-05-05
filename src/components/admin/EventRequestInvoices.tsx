
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import InvoiceList from "./InvoiceList";
import type { Invoice } from "./EventRequestDetail";
import type { EventRequest } from "./AdminEventRequests";

interface EventRequestInvoicesProps {
  invoices: Invoice[];
  loadingInvoices: boolean;
  request: EventRequest;
  getStatusBadge: (status: string) => JSX.Element;
  onShowInvoiceForm: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onMarkPaid: (invoiceId: string) => Promise<void>;
  onDeleteInvoice: (invoiceId: string) => Promise<void>;
}

const EventRequestInvoices = ({
  invoices,
  loadingInvoices,
  request,
  getStatusBadge,
  onShowInvoiceForm,
  onViewInvoice,
  onMarkPaid,
  onDeleteInvoice
}: EventRequestInvoicesProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Faturas
          </CardTitle>
          <Button onClick={onShowInvoiceForm}>
            <FileText className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Nova Fatura</span>
            <span className="sm:hidden">+</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <InvoiceList 
          invoices={invoices} 
          loadingInvoices={loadingInvoices} 
          onViewInvoice={onViewInvoice}
          onMarkPaid={onMarkPaid}
          onDeleteInvoice={onDeleteInvoice}
          getStatusBadge={getStatusBadge}
        />
      </CardContent>
    </Card>
  );
};

export default EventRequestInvoices;
