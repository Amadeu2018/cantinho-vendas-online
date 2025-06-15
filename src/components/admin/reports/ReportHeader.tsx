
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, Sheet } from "lucide-react";

interface ReportHeaderProps {
  title: string;
  onExportPDF: () => void;
  onExportCSV: () => void;
}

export const ReportHeader = ({ title, onExportPDF, onExportCSV }: ReportHeaderProps) => (
  <div className="flex justify-between items-center print:hidden">
    <h2 className="text-2xl font-bold">{title}</h2>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onExportPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Exportar para PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportCSV}>
          <Sheet className="h-4 w-4 mr-2" />
          Exportar para Excel (CSV)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);
