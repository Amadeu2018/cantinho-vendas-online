import React, { useState } from "react";
import { useEvent } from "@/contexts/EventContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Users, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import SelectedPackageDisplay from "./SelectedPackageDisplay";

const EventForm = () => {
  const { selectedPackage, eventPackages } = useEvent();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    data_evento: "",
    num_convidados: "",
    tipo_evento: "",
    localizacao: "",
    mensagem: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular envio do pedido
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Pedido de evento enviado!",
        description: "Entraremos em contato em breve para confirmar os detalhes."
      });

      // Reset form
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        data_evento: "",
        num_convidados: "",
        tipo_evento: "",
        localizacao: "",
        mensagem: ""
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar pedido",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {selectedPackage && <SelectedPackageDisplay />}
      
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-cantinho-cream/20">
        <CardHeader className="bg-gradient-to-r from-cantinho-navy to-cantinho-terracotta text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center">
            Solicitar Orçamento para Evento
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Users className="w-4 h-4 mr-2 text-cantinho-terracotta" />
                  Nome Completo *
                </label>
                <Input
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  required
                  className="border-gray-300 focus:border-cantinho-terracotta focus:ring-cantinho-terracotta"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4 mr-2 text-cantinho-terracotta" />
                  E-mail *
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  required
                  className="border-gray-300 focus:border-cantinho-terracotta focus:ring-cantinho-terracotta"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Phone className="w-4 h-4 mr-2 text-cantinho-terracotta" />
                  Telefone *
                </label>
                <Input
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="+244 924 678 544"
                  required
                  className="border-gray-300 focus:border-cantinho-terracotta focus:ring-cantinho-terracotta"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-cantinho-terracotta" />
                  Data do Evento *
                </label>
                <Input
                  name="data_evento"
                  type="date"
                  value={formData.data_evento}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="border-gray-300 focus:border-cantinho-terracotta focus:ring-cantinho-terracotta"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Users className="w-4 h-4 mr-2 text-cantinho-terracotta" />
                  Número de Convidados *
                </label>
                <Input
                  name="num_convidados"
                  type="number"
                  value={formData.num_convidados}
                  onChange={handleChange}
                  placeholder="Ex: 50"
                  required
                  min="1"
                  className="border-gray-300 focus:border-cantinho-terracotta focus:ring-cantinho-terracotta"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 mr-2 text-cantinho-terracotta" />
                  Localização *
                </label>
                <Input
                  name="localizacao"
                  value={formData.localizacao}
                  onChange={handleChange}
                  placeholder="Local do evento"
                  required
                  className="border-gray-300 focus:border-cantinho-terracotta focus:ring-cantinho-terracotta"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <MessageCircle className="w-4 h-4 mr-2 text-cantinho-terracotta" />
                Observações Adicionais
              </label>
              <Textarea
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                placeholder="Conte-nos mais detalhes sobre seu evento..."
                rows={4}
                className="border-gray-300 focus:border-cantinho-terracotta focus:ring-cantinho-terracotta resize-none"
              />
            </div>

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-cantinho-terracotta to-cantinho-terracotta/90 hover:from-cantinho-terracotta/90 hover:to-cantinho-terracotta text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                size="lg"
              >
                {loading ? "Enviando..." : "Solicitar Orçamento"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventForm;
