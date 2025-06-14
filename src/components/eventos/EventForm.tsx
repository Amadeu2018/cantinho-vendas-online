
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useEvent } from "@/contexts/EventContext";
import { 
  Users, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Star,
  Clock,
  Check,
  Crown
} from "lucide-react";

const EventForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { submitEventRequest } = useEvent();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    packageType: "",
    guestCount: "",
    eventDate: "",
    eventTime: "",
    location: "",
    specialRequests: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for premium package selection from URL
  useEffect(() => {
    const packageParam = searchParams.get('package');
    if (packageParam === 'premium') {
      setFormData(prev => ({ ...prev, packageType: 'premium' }));
      toast({
        title: "Pacote Premium Selecionado!",
        description: "O pacote Premium foi automaticamente selecionado para você.",
        duration: 4000,
      });
    }
  }, [searchParams, toast]);

  const packages = [
    {
      id: "basic",
      name: "Básico",
      price: "Desde 5.000 AOA/pessoa",
      description: "Perfeito para eventos íntimos",
      features: [
        "Menu com 3 opções de pratos",
        "Serviço de mesa básico",
        "Decoração simples",
        "Atendimento padrão"
      ],
      icon: <Users className="w-6 h-6" />,
      color: "bg-blue-500"
    },
    {
      id: "standard",
      name: "Standard",
      price: "Desde 8.000 AOA/pessoa",
      description: "Ideal para celebrações especiais",
      features: [
        "Menu com 5 opções de pratos",
        "Serviço completo de mesa",
        "Decoração temática",
        "Atendimento especializado",
        "Bebidas incluídas"
      ],
      icon: <Star className="w-6 h-6" />,
      color: "bg-green-500"
    },
    {
      id: "premium",
      name: "Premium",
      price: "Desde 12.000 AOA/pessoa",
      description: "Experiência gastronómica de luxo",
      features: [
        "Menu gourmet personalizado",
        "Chef dedicado no local",
        "Decoração premium completa",
        "Serviço de alta qualidade",
        "Bar completo incluído",
        "Coordenação do evento",
        "Fotografia gastronómica"
      ],
      icon: <Crown className="w-6 h-6" />,
      color: "bg-cantinho-terracotta",
      popular: true
    }
  ];

  const eventTypes = [
    "Casamento",
    "Aniversário",
    "Evento Corporativo",
    "Formatura",
    "Batizado",
    "Reunião Familiar",
    "Outro"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitEventRequest(formData);
      
      toast({
        title: "Pedido enviado com sucesso!",
        description: "Entraremos em contacto em breve com uma proposta personalizada.",
      });
      
      navigate("/eventos/confirmacao", { 
        state: { 
          formData,
          selectedPackage: packages.find(p => p.id === formData.packageType)
        }
      });
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
      toast({
        title: "Erro ao enviar pedido",
        description: "Tente novamente ou entre em contacto diretamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-cantinho-navy mb-4">
          Planeie o Seu Evento Perfeito
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transformamos os seus momentos especiais em experiências gastronómicas inesquecíveis. 
          Escolha o pacote ideal e deixe-nos cuidar de todos os detalhes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Package Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-cantinho-terracotta" />
              Escolha o Seu Pacote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                    formData.packageType === pkg.id
                      ? 'border-cantinho-terracotta bg-cantinho-cream/30 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-cantinho-terracotta/50 hover:shadow-md'
                  }`}
                  onClick={() => handleSelectChange('packageType', pkg.id)}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-2 left-4 bg-cantinho-terracotta">
                      Mais Popular
                    </Badge>
                  )}
                  
                  <div className={`w-12 h-12 ${pkg.color} rounded-full flex items-center justify-center text-white mb-4`}>
                    {pkg.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-cantinho-navy mb-2">{pkg.name}</h3>
                  <p className="text-lg font-semibold text-cantinho-terracotta mb-2">{pkg.price}</p>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  
                  <ul className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {formData.packageType === pkg.id && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-cantinho-terracotta rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-cantinho-terracotta" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="border-2 focus:border-cantinho-terracotta"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="pl-10 border-2 focus:border-cantinho-terracotta"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="pl-10 border-2 focus:border-cantinho-terracotta"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="eventType">Tipo de Evento *</Label>
              <Select value={formData.eventType} onValueChange={(value) => handleSelectChange('eventType', value)}>
                <SelectTrigger className="border-2 focus:border-cantinho-terracotta">
                  <SelectValue placeholder="Selecione o tipo de evento" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Event Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-cantinho-terracotta" />
              Detalhes do Evento
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="guestCount">Número de Convidados *</Label>
              <Input
                id="guestCount"
                name="guestCount"
                type="number"
                min="1"
                value={formData.guestCount}
                onChange={handleInputChange}
                required
                className="border-2 focus:border-cantinho-terracotta"
              />
            </div>
            
            <div>
              <Label htmlFor="eventDate">Data do Evento *</Label>
              <Input
                id="eventDate"
                name="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={handleInputChange}
                required
                className="border-2 focus:border-cantinho-terracotta"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <Label htmlFor="eventTime">Horário do Evento *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="eventTime"
                  name="eventTime"
                  type="time"
                  value={formData.eventTime}
                  onChange={handleInputChange}
                  required
                  className="pl-10 border-2 focus:border-cantinho-terracotta"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Local do Evento *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="pl-10 border-2 focus:border-cantinho-terracotta"
                  placeholder="Endereço completo do evento"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="specialRequests">Pedidos Especiais</Label>
              <Textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={4}
                className="border-2 focus:border-cantinho-terracotta resize-none"
                placeholder="Descreva qualquer pedido especial, restrições alimentares, decoração específica, etc."
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            type="submit"
            disabled={isSubmitting || !formData.packageType}
            className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando pedido...
              </span>
            ) : (
              "Solicitar Orçamento Personalizado"
            )}
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            * Campos obrigatórios. Responderemos em até 24 horas com uma proposta detalhada.
          </p>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
