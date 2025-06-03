
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";

interface InventoryHeaderProps {
  onExportPDF: () => void;
  onGenerateReport: () => void;
  exporting: boolean;
}

const InventoryHeader = ({ onExportPDF, onGenerateReport, exporting }: InventoryHeaderProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        onClick={onExportPDF} 
        disabled={exporting}
        variant="outline"
        size="sm"
      >
        {exporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
        Exportar Visualização
      </Button>
      <Button 
        onClick={onGenerateReport} 
        disabled={exporting}
        size="sm"
      >
        {exporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
        Relatório Detalhado
      </Button>
    </div>
  );
};

export default InventoryHeader;
