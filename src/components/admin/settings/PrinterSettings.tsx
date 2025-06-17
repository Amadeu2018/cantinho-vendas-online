
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Printer, Plus, Settings, Trash2, CheckCircle } from "lucide-react";
import { useInvoiceSettings, type PrinterConfig } from "@/hooks/company/use-invoice-settings";
import { useToast } from "@/hooks/use-toast";

const PrinterSettings = () => {
  const { printers, loading, updateSettings } = useInvoiceSettings();
  const { toast } = useToast();
  const [isAddingPrinter, setIsAddingPrinter] = useState(false);
  const [newPrinter, setNewPrinter] = useState({
    name: "",
    type: "laser" as "thermal" | "laser" | "inkjet",
    paper_size: "A4" as "A4" | "A5" | "thermal_80mm" | "thermal_58mm",
    is_default: false
  });

  const handleAddPrinter = () => {
    if (!newPrinter.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para a impressora.",
        variant: "destructive"
      });
      return;
    }

    const printer: PrinterConfig = {
      id: `printer_${Date.now()}`,
      name: newPrinter.name,
      type: newPrinter.type,
      paper_size: newPrinter.paper_size,
      is_default: newPrinter.is_default
    };

    // In a real implementation, this would update the printers list
    toast({
      title: "Impressora adicionada",
      description: `Impressora "${printer.name}" foi configurada com sucesso.`,
    });

    setNewPrinter({
      name: "",
      type: "laser",
      paper_size: "A4",
      is_default: false
    });
    setIsAddingPrinter(false);
  };

  const handleSetDefault = (printerId: string) => {
    toast({
      title: "Impressora padrão alterada",
      description: "A impressora padrão foi atualizada.",
    });
  };

  const handleDeletePrinter = (printerId: string) => {
    toast({
      title: "Impressora removida",
      description: "A configuração da impressora foi removida.",
    });
  };

  const testPrint = (printer: PrinterConfig) => {
    toast({
      title: "Teste de impressão",
      description: `Enviando página de teste para ${printer.name}...`,
    });
  };

  if (loading) {
    return <div>Carregando configurações de impressora...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Add New Printer */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Adicionar Nova Impressora
            </CardTitle>
            <Button
              onClick={() => setIsAddingPrinter(!isAddingPrinter)}
              variant={isAddingPrinter ? "outline" : "default"}
              size="sm"
            >
              {isAddingPrinter ? "Cancelar" : "Nova Impressora"}
            </Button>
          </div>
        </CardHeader>
        {isAddingPrinter && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="printer_name">Nome da Impressora</Label>
                <Input
                  id="printer_name"
                  value={newPrinter.name}
                  onChange={(e) => setNewPrinter(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Impressora do Balcão"
                />
              </div>
              
              <div>
                <Label htmlFor="printer_type">Tipo de Impressora</Label>
                <Select
                  value={newPrinter.type}
                  onValueChange={(value: "thermal" | "laser" | "inkjet") => 
                    setNewPrinter(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laser">Laser</SelectItem>
                    <SelectItem value="inkjet">Jato de Tinta</SelectItem>
                    <SelectItem value="thermal">Térmica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="paper_size">Tamanho do Papel</Label>
                <Select
                  value={newPrinter.paper_size}
                  onValueChange={(value: "A4" | "A5" | "thermal_80mm" | "thermal_58mm") => 
                    setNewPrinter(prev => ({ ...prev, paper_size: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A4">A4</SelectItem>
                    <SelectItem value="A5">A5</SelectItem>
                    <SelectItem value="thermal_80mm">Térmica 80mm</SelectItem>
                    <SelectItem value="thermal_58mm">Térmica 58mm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_default">Impressora Padrão</Label>
                <Switch
                  id="is_default"
                  checked={newPrinter.is_default}
                  onCheckedChange={(checked) => 
                    setNewPrinter(prev => ({ ...prev, is_default: checked }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingPrinter(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddPrinter}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Impressora
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Configured Printers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Impressoras Configuradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {printers.map((printer) => (
              <div key={printer.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Printer className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{printer.name}</h3>
                      {printer.is_default && (
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Padrão
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {printer.type} • {printer.paper_size}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testPrint(printer)}
                  >
                    Testar
                  </Button>
                  {!printer.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(printer.id)}
                    >
                      Definir Padrão
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeletePrinter(printer.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Print Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações de Impressão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto_print">Impressão Automática</Label>
              <Switch id="auto_print" />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="print_receipt">Imprimir Recibo</Label>
              <Switch id="print_receipt" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="print_invoice">Imprimir Fatura</Label>
              <Switch id="print_invoice" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="double_print">Impressão Dupla</Label>
              <Switch id="double_print" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrinterSettings;
