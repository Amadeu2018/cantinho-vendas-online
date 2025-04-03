import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { EventRequest } from "./AdminEventRequests";

interface EventInvoiceFormProps {
  eventRequest: EventRequest;
  onClose: () => void;
}

const EventInvoiceForm = ({ eventRequest, onClose }: EventInvoiceFormProps) => {
  const [invoiceType, setInvoiceType] = useState<"proforma" | "regular">("proforma");
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    numero: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    valor: "",
    descricao: `Serviço de Catering para ${eventRequest.tipo_evento} no dia ${format(new Date(eventRequest.data_evento), "dd/MM/yyyy")} para ${eventRequest.num_convidados} convidados.`,
  });
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type: "proforma" | "regular") => {
    setInvoiceType(type);
    if (type === "proforma") {
      setInvoiceData((prev) => ({
        ...prev,
        numero: `PRO-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      }));
    } else {
      setInvoiceData((prev) => ({
        ...prev,
        numero: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invoiceData.valor || parseFloat(invoiceData.valor) <= 0) {
      toast({
        title: "Erro de validação",
        description: "Por favor, insira um valor válido para a fatura.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.from('event_invoices').insert({
        event_request_id: eventRequest.id,
        tipo: invoiceType,
        numero: invoiceData.numero,
        valor: parseFloat(invoiceData.valor),
        status: "pendente",
        descricao: invoiceData.descricao,
      });
      
      if (error) throw error;
      
      toast({
        title: "Fatura criada",
        description: `A ${invoiceType === "proforma" ? "fatura proforma" : "fatura"} foi criada com sucesso.`,
      });
      
      onClose();
    } catch (error: any) {
      console.error("Erro ao criar fatura:", error);
      toast({
        title: "Erro ao criar fatura",
        description: error.message || "Ocorreu um erro ao criar a fatura",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            {invoiceType === "proforma" ? "Nova Fatura Proforma" : "Nova Fatura"}
          </CardTitle>
          <Button variant="outline" size="icon" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-3">Detalhes do Cliente</p>
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">{eventRequest.nome}</p>
                <p className="text-sm text-muted-foreground">{eventRequest.email}</p>
                <p className="text-sm text-muted-foreground">{eventRequest.telefone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="text-base">Tipo de Documento</Label>
                <div className="flex gap-4 mt-2">
                  <div
                    className={`flex-1 p-3 border rounded-md cursor-pointer ${
                      invoiceType === "proforma"
                        ? "border-cantinho-terracotta bg-orange-50"
                        : "border-muted-foreground/20"
                    }`}
                    onClick={() => handleTypeChange("proforma")}
                  >
                    <div className="font-medium">Fatura Proforma</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Documento não fiscal para orçamentos e aprovações prévias
                    </p>
                  </div>
                  <div
                    className={`flex-1 p-3 border rounded-md cursor-pointer ${
                      invoiceType === "regular"
                        ? "border-cantinho-terracotta bg-orange-50"
                        : "border-muted-foreground/20"
                    }`}
                    onClick={() => handleTypeChange("regular")}
                  >
                    <div className="font-medium">Fatura</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Documento fiscal oficial para serviços prestados
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="numero">Número do Documento</Label>
                <Input
                  id="numero"
                  name="numero"
                  value={invoiceData.numero}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="valor">Valor (AOA)</Label>
                <Input
                  id="valor"
                  name="valor"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={invoiceData.valor}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  rows={3}
                  value={invoiceData.descricao}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-opacity-20 border-t-white rounded-full"></div>
                  Criando...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Criar {invoiceType === "proforma" ? "Fatura Proforma" : "Fatura"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventInvoiceForm;
