
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EventForm, { EventFormData } from "@/components/eventos/EventForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  CalendarDays, 
  Users, 
  MapPin, 
  Clock, 
  Phone, 
  Star,
  CheckCircle,
  Award,
  Camera,
  Music,
  Utensils,
  Gift
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Eventos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEventSubmit = async (data: EventFormData) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para solicitar um orçamento de evento.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('event_requests')
        .insert([
          {
            client_name: data.clientName,
            client_email: data.clientEmail,
            client_phone: data.clientPhone,
            event_type: data.eventType,
            event_date: data.eventDate,
            event_time: data.eventTime,
            event_location: data.eventLocation,
            guest_count: data.guestCount,
            special_requests: data.specialRequests,
            budget: data.budget,
            user_id: user.id,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Solicitação enviada!",
        description: "Entraremos em contato em breve para discutir os detalhes do seu evento."
      });
      
      setShowForm(false);
    } catch (error: any) {
      console.error("Erro ao enviar solicitação de evento:", error);
      toast({
        title: "Erro ao enviar solicitação",
        description: "Tente novamente ou entre em contato conosco.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const eventTypes = [
    {
      title: "Casamentos",
      icon: <Gift className="h-8 w-8" />,
      description: "Torne seu dia especial inesquecível com nosso serviço premium",
      features: ["Cardápio personalizado", "Decoração inclusa", "Serviço completo"]
    },
    {
      title: "Eventos Corporativos",
      icon: <Users className="h-8 w-8" />,
      description: "Impressione seus clientes e colaboradores",
      features: ["Coffee breaks", "Almoços executivos", "Coquetéis"]
    },
    {
      title: "Aniversários",
      icon: <Camera className="h-8 w-8" />,
      description: "Celebre momentos especiais com sabor único",
      features: ["Bolos personalizados", "Buffet variado", "Animação"]
    },
    {
      title: "Eventos Sociais",
      icon: <Music className="h-8 w-8" />,
      description: "Formaturas, batizados e celebrações diversas",
      features: ["Menu diversificado", "Serviço profissional", "Flexibilidade total"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[70vh] bg-gradient-to-r from-cantinho-navy to-cantinho-terracotta text-white">
          <div className="absolute inset-0 bg-black/30"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3')"
            }}
          ></div>
          <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-center">
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Eventos <span className="text-cantinho-sand">Inesquecíveis</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Transformamos suas celebrações em experiências gastronômicas únicas
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setShowForm(true)}
                  size="lg"
                  className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 text-white px-8 py-4 text-lg"
                >
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Solicitar Orçamento
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-cantinho-navy px-8 py-4 text-lg"
                  asChild
                >
                  <a href="tel:+244924678544">
                    <Phone className="mr-2 h-5 w-5" />
                    Ligar Agora
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Event Types */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-cantinho-navy mb-4">
                Tipos de Eventos
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Especializamo-nos em criar experiências gastronômicas memoráveis para todos os tipos de celebrações
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {eventTypes.map((eventType, index) => (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-cantinho-terracotta/10 rounded-full flex items-center justify-center text-cantinho-terracotta group-hover:bg-cantinho-terracotta group-hover:text-white transition-all duration-300">
                      {eventType.icon}
                    </div>
                    <CardTitle className="text-xl">{eventType.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{eventType.description}</p>
                    <ul className="space-y-2">
                      {eventType.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center justify-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-cantinho-navy text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-cantinho-sand mb-2">500+</div>
                <div className="text-white/80">Eventos Realizados</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-cantinho-sand mb-2">98%</div>
                <div className="text-white/80">Satisfação dos Clientes</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-cantinho-sand mb-2">15</div>
                <div className="text-white/80">Anos de Experiência</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-cantinho-sand mb-2">50+</div>
                <div className="text-white/80">Pratos Especializados</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        {!showForm && (
          <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold text-cantinho-navy mb-6">
                Pronto para Criar Algo Especial?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Entre em contato conosco hoje mesmo e vamos planejar o evento perfeito para você
              </p>
              <Button
                onClick={() => setShowForm(true)}
                size="lg"
                className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 text-white px-12 py-4 text-lg"
              >
                <CalendarDays className="mr-2 h-6 w-6" />
                Solicitar Orçamento Gratuito
              </Button>
            </div>
          </section>
        )}

        {/* Event Form */}
        {showForm && (
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-cantinho-navy mb-4">
                  Solicite Seu Orçamento
                </h2>
                <p className="text-xl text-gray-600">
                  Preencha o formulário abaixo e entraremos em contato em até 24 horas
                </p>
              </div>
              <EventForm onSubmit={handleEventSubmit} />
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="px-8"
                >
                  Voltar
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Eventos;
