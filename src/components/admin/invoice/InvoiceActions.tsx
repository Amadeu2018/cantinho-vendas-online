
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer } from "lucide-react";

interface InvoiceActionsProps {
  onBack: () => void;
  onPrint: () => void;
  onDownloadPDF: () => void;
  title: string;
}

const InvoiceActions = ({ onBack, onPrint, onDownloadPDF, title }: InvoiceActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      
      <div className="flex gap-2 no-print w-full sm:w-auto">
        <Button 
          onClick={onPrint} 
          className="flex items-center gap-2 flex-1 sm:flex-none"
        >
          <Printer className="h-4 w-4" />
          <span className="hidden xs:inline">Imprimir</span>
        </Button>
        <Button 
          onClick={onDownloadPDF} 
          className="flex items-center gap-2 flex-1 sm:flex-none"
        >
          <Download className="h-4 w-4" />
          <span className="hidden xs:inline">Baixar PDF</span>
        </Button>
      </div>
    </div>
  );
};

export default InvoiceActions;
