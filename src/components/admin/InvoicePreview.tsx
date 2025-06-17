
import UnifiedInvoiceView from "./UnifiedInvoiceView";
import type { Invoice } from "./EventRequestDetail";
import type { EventRequest } from "./AdminEventRequests";

interface InvoicePreviewProps {
  invoice: Invoice;
  request: EventRequest;
  onBack: () => void;
  onExportPDF?: (invoice: Invoice) => void;
}

const InvoicePreview = ({ invoice, request, onBack, onExportPDF }: InvoicePreviewProps) => {
  const handleBack = () => {
    if (onExportPDF) {
      onExportPDF(invoice);
    }
    onBack();
  };

  return (
    <UnifiedInvoiceView 
      eventInvoice={invoice}
      eventRequest={request}
      onBack={handleBack}
    />
  );
};

export default InvoicePreview;
