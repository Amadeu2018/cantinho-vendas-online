
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EventFormData from "./EventFormData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar, Users, MapPin, Mail, Phone, User } from "lucide-react";

interface EventFormProps {
  onSubmit: (formData: EventFormData) => void;
}

const EventForm = ({ onSubmit }: EventFormProps) => {
  const [formData, setFormData] = useState<EventFormData>({
    nome: "",
    email: "",
    telefone: "",
    tipo_evento: "",
    data_evento: "",
    num_convidados: 0,
    localizacao: "",
    mensagem: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: keyof EventFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert string values to numbers for specific fields
      const dataToSubmit = {
        ...formData,
        num_convidados: Number(formData.num_convidados),
      };

      const { error } = await supabase
        .from('event_requests')
        .insert([dataToSubmit]);

      if (error) throw error;

      toast({
        title: "Solicitação enviada!",
        description: "Entraremos em contato em breve para discutir os detalhes do seu evento.",
      });

      onSubmit(dataToSubmit);
    } catch (error: any) {
      console.error("Erro ao enviar solicitação:", error);
      toast({
        title: "Erro ao enviar solicitação",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center bg-gradient-to-r from-cantinho-navy to-cantinho-cornflower text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
          <Calendar className="h-6 w-6" />
          Solicitar Orçamento para Evento
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nome" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome Completo
              </Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                required
                placeholder="Seu nome completo"
                className="border-gray-300 focus:border-cantinho-terracotta"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                placeholder="seu@email.com"
                className="border-gray-300 focus:border-cantinho-terracotta"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone
              </Label>
              <Input
                id="telefone"
                type="tel"
                value={formData.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                required
                placeholder="+244 900 000 000"
                className="border-gray-300 focus:border-cantinho-terracotta"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_evento">Tipo de Evento</Label>
              <Select onValueChange={(value) => handleChange('tipo_evento', value)} required>
                <SelectTrigger className="border-gray-300 focus:border-cantinho-terracotta">
                  <SelectValue placeholder="Selecione o tipo de evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casamento">Casamento</SelectItem>
                  <SelectItem value="aniversario">Aniversário</SelectItem>
                  <SelectItem value="corporativo">Evento Corporativo</SelectItem>
                  <SelectItem value="formatura">Formatura</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_evento" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data do Evento
              </Label>
              <Input
                id="data_evento"
                type="date"
                value={formData.data_evento}
                onChange={(e) => handleChange('data_evento', e.target.value)}
                required
                className="border-gray-300 focus:border-cantinho-terracotta"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="num_convidados" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Número de Convidados
              </Label>
              <Input
                id="num_convidados"
                type="number"
                min="1"
                value={formData.num_convidados}
                onChange={(e) => handleChange('num_convidados', parseInt(e.target.value) || 0)}
                required
                placeholder="50"
                className="border-gray-300 focus:border-cantinho-terracotta"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="localizacao" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Localização do Evento
              </Label>
              <Input
                id="localizacao"
                type="text"
                value={formData.localizacao}
                onChange={(e) => handleChange('localizacao', e.target.value)}
                required
                placeholder="Endereço completo do evento"
                className="border-gray-300 focus:border-cantinho-terracotta"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="mensagem">Mensagem Adicional (Opcional)</Label>
              <Textarea
                id="mensagem"
                value={formData.mensagem}
                onChange={(e) => handleChange('mensagem', e.target.value)}
                placeholder="Descreva detalhes específicos do seu evento, preferências de cardápio, etc."
                className="border-gray-300 focus:border-cantinho-terracotta min-h-[100px]"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-cantinho-terracotta to-cantinho-navy hover:from-cantinho-navy hover:to-cantinho-terracotta text-white font-semibold py-3 rounded-lg transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Enviando Solicitação...
              </>
            ) : (
              "Enviar Solicitação de Orçamento"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventForm;
