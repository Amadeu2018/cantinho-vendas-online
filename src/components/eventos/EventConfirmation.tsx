
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Check, Printer, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EventFormData {
  nome: string;
  email: string;
  telefone: string;
  tipoEvento: string;
  dataEvento: string;
  numConvidados: string;
  localizacao: string;
  mensagem: string;
}

interface EventConfirmationProps {
  requestId: string;
  formData: EventFormData;
  onClose: () => void;
}

const EventConfirmation = ({ requestId, formData, onClose }: EventConfirmationProps) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const confirmationRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = () => {
    setIsPrinting(true);
    const content = confirmationRef.current;
    if (!content) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor, permita pop-ups para imprimir o recibo.');
      setIsPrinting(false);
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Recibo de Solicitação de Orçamento</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .title { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
            .info-row { display: flex; margin-bottom: 10px; }
            .label { font-weight: bold; width: 180px; }
            .value { flex: 1; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; }
            .confirmation-number { margin-top: 20px; font-size: 14px; font-weight: bold; text-align: center; }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Cantinho do Sabor</div>
            <div>Serviço de Catering & Eventos</div>
          </div>
          
          <div class="title">Recibo de Solicitação de Orçamento</div>
          
          <div class="info-row">
            <div class="label">Nome:</div>
            <div class="value">${formData.nome}</div>
          </div>
          
          <div class="info-row">
            <div class="label">Email:</div>
            <div class="value">${formData.email}</div>
          </div>
          
          <div class="info-row">
            <div class="label">Telefone:</div>
            <div class="value">${formData.telefone}</div>
          </div>
          
          <div class="info-row">
            <div class="label">Tipo de Evento:</div>
            <div class="value">${formData.tipoEvento}</div>
          </div>
          
          <div class="info-row">
            <div class="label">Data do Evento:</div>
            <div class="value">${format(new Date(formData.dataEvento), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</div>
          </div>
          
          <div class="info-row">
            <div class="label">Número de Convidados:</div>
            <div class="value">${formData.numConvidados}</div>
          </div>
          
          <div class="info-row">
            <div class="label">Local do Evento:</div>
            <div class="value">${formData.localizacao}</div>
          </div>
          
          ${formData.mensagem ? `
          <div class="info-row">
            <div class="label">Detalhes Adicionais:</div>
            <div class="value">${formData.mensagem}</div>
          </div>
          ` : ''}
          
          <div class="info-row">
            <div class="label">Data da Solicitação:</div>
            <div class="value">${format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}</div>
          </div>
          
          <div class="confirmation-number">
            Número de confirmação: ${requestId.slice(0, 8).toUpperCase()}
          </div>
          
          <div class="footer">
            <p>Agradecemos por escolher nossos serviços. Entraremos em contato em até 48 horas úteis com seu orçamento.</p>
            <p>Para qualquer dúvida, entre em contato pelo telefone (123) 456-7890 ou pelo email eventos@cantinhodobrasil.co.ao</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      setIsPrinting(false);
    }, 500);
  };

  return (
    <Card className="p-6 shadow-lg overflow-hidden" ref={confirmationRef}>
      <CardHeader className="text-center border-b pb-4">
        <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl text-center mb-2">Solicitação Enviada</CardTitle>
        <p className="text-muted-foreground text-center">
          Recebemos seu pedido de orçamento e entraremos em contato em breve.
        </p>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Detalhes da Solicitação</h3>
            <div className="bg-muted p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome</p>
                  <p>{formData.nome}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{formData.email}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                  <p>{formData.telefone}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tipo de Evento</p>
                  <p>{formData.tipoEvento}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data do Evento</p>
                  <p>{format(new Date(formData.dataEvento), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Número de Convidados</p>
                  <p>{formData.numConvidados}</p>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Local do Evento</p>
                  <p>{formData.localizacao}</p>
                </div>
                
                {formData.mensagem && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Detalhes Adicionais</p>
                    <p>{formData.mensagem}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="font-medium">Número de confirmação</p>
            <p className="text-lg font-bold text-cantinho-navy">{requestId.slice(0, 8).toUpperCase()}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Guarde este número para referência futura.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
            <h4 className="font-medium text-blue-800 mb-2">O que acontece agora?</h4>
            <ul className="list-disc pl-5 text-blue-700 space-y-1">
              <li>Nossa equipe revisará sua solicitação</li>
              <li>Entraremos em contato em até 48 horas úteis</li>
              <li>Vamos preparar um orçamento personalizado</li>
              <li>Agendar uma consulta para discutir detalhes (se necessário)</li>
            </ul>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 border-t pt-4">
        <Button 
          variant="outline" 
          className="w-full sm:w-auto"
          onClick={onClose}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para eventos
        </Button>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <Button 
            variant="secondary" 
            className="w-full sm:w-auto"
            onClick={handlePrint}
            disabled={isPrinting}
          >
            {isPrinting ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-opacity-20 border-t-cantinho-navy rounded-full"></div>
                Imprimindo...
              </>
            ) : (
              <>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventConfirmation;
