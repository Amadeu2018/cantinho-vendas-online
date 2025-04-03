
import { useState, useRef } from "react";
import { Calendar, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EventConfirmation from "./EventConfirmation";

const EventForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    tipoEvento: "",
    dataEvento: "",
    numConvidados: "",
    localizacao: "",
    mensagem: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Enviar dados para o Supabase
      const { data, error } = await supabase
        .from('event_requests')
        .insert({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          tipo_evento: formData.tipoEvento,
          data_evento: formData.dataEvento,
          num_convidados: Number(formData.numConvidados),
          localizacao: formData.localizacao,
          mensagem: formData.mensagem,
          status: 'pendente'
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      setRequestId(data.id);
      setShowConfirmation(true);
      
      // Limpar o formulário
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        tipoEvento: "",
        dataEvento: "",
        numConvidados: "",
        localizacao: "",
        mensagem: "",
      });
      
      toast({
        title: "Solicitação enviada",
        description: "Entraremos em contato em breve para discutir os detalhes do seu evento. Obrigado!",
      });
    } catch (error: any) {
      console.error("Erro ao enviar solicitação:", error);
      toast({
        title: "Erro ao enviar solicitação",
        description: error.message || "Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Se estiver mostrando a confirmação, renderiza o componente de confirmação
  if (showConfirmation && requestId) {
    return (
      <EventConfirmation 
        requestId={requestId}
        formData={formData}
        onClose={() => setShowConfirmation(false)}
      />
    );
  }

  return (
    <Card className="p-6 shadow-lg">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nome" className="block mb-2 font-medium">
              Nome Completo
            </label>
            <Input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Seu nome completo"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block mb-2 font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Seu endereço de email"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="telefone" className="block mb-2 font-medium">
              Telefone
            </label>
            <Input
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="Seu número de telefone"
              required
            />
          </div>
          
          <div>
            <label htmlFor="tipoEvento" className="block mb-2 font-medium">
              Tipo de Evento
            </label>
            <select
              id="tipoEvento"
              name="tipoEvento"
              value={formData.tipoEvento}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              required
            >
              <option value="" disabled>Selecione o tipo de evento</option>
              <option value="Casamento">Casamento</option>
              <option value="Aniversário">Aniversário</option>
              <option value="Corporativo">Evento Corporativo</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="dataEvento" className="block mb-2 font-medium">
              Data do Evento
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="dataEvento"
                name="dataEvento"
                type="date"
                value={formData.dataEvento}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="numConvidados" className="block mb-2 font-medium">
              Número de Convidados
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="numConvidados"
                name="numConvidados"
                type="number"
                min="1"
                value={formData.numConvidados}
                onChange={handleChange}
                placeholder="Quantidade estimada"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="localizacao" className="block mb-2 font-medium">
              Localização do Evento
            </label>
            <Input
              id="localizacao"
              name="localizacao"
              value={formData.localizacao}
              onChange={handleChange}
              placeholder="Endereço do evento"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="mensagem" className="block mb-2 font-medium">
            Detalhes Adicionais
          </label>
          <Textarea
            id="mensagem"
            name="mensagem"
            value={formData.mensagem}
            onChange={handleChange}
            placeholder="Conte-nos mais sobre seu evento, preferências de menu, necessidades especiais, etc."
            rows={4}
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
            </span>
          ) : (
            <span className="flex items-center">
              Solicitar Orçamento
            </span>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default EventForm;
