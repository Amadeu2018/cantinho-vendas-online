
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EventForm from "@/components/eventos/EventForm";
import EventConfirmation from "@/components/eventos/EventConfirmation";
import { useEventContext } from "@/contexts/EventContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays, 
  Users, 
  MapPin, 
  Clock, 
  Gift,
  Star,
  Award,
  Heart
} from "lucide-react";

const Eventos = () => {
  const { eventRequest, submitEventRequest } = useEventContext();

  const handleFormSubmit = (formData: any) => {
    submitEventRequest(formData);
  };

  if (eventRequest) {
    return <EventConfirmation />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cantinho-cream/30 via-white to-cantinho-sand/20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-cantinho-navy mb-6">
              Eventos <span className="text-cantinho-terracotta">Inesquecíveis</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transformamos seus momentos especiais em experiências culinárias únicas. 
              Do planejamento à execução, cuidamos de cada detalhe para tornar seu evento perfeito.
            </p>
          </div>

          {/* Services Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-cantinho-terracotta to-cantinho-sand rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-cantinho-navy mb-3">Casamentos</h3>
                <p className="text-gray-600">Celebre o amor com um banquete memorável, cardápios personalizados e serviço impecável.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-cantinho-navy to-cantinho-cornflower rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-cantinho-navy mb-3">Eventos Corporativos</h3>
                <p className="text-gray-600">Impressione seus parceiros e colaboradores com eventos profissionais de alta qualidade.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-cantinho-terracotta to-cantinho-navy rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-cantinho-navy mb-3">Celebrações</h3>
                <p className="text-gray-600">Aniversários, formaturas e ocasiões especiais merecem uma comemoração à altura.</p>
              </CardContent>
            </Card>
          </div>

          {/* Event Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <EventForm onSubmit={handleFormSubmit} />
            </div>

            {/* Info Section */}
            <div className="space-y-8">
              <Card className="border-0 bg-gradient-to-br from-cantinho-navy to-cantinho-cornflower text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Star className="h-6 w-6" />
                    Por que escolher o Cantinho Algarvio?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 mt-1 text-cantinho-sand" />
                    <div>
                      <h4 className="font-semibold mb-1">Experiência Comprovada</h4>
                      <p className="text-white/90 text-sm">Mais de 500 eventos realizados com excelência</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarDays className="h-5 w-5 mt-1 text-cantinho-sand" />
                    <div>
                      <h4 className="font-semibold mb-1">Planejamento Personalizado</h4>
                      <p className="text-white/90 text-sm">Cada evento é único e planejado especialmente para você</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-1 text-cantinho-sand" />
                    <div>
                      <h4 className="font-semibold mb-1">Flexibilidade de Local</h4>
                      <p className="text-white/90 text-sm">Atendemos em diversos locais em Luanda</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 mt-1 text-cantinho-sand" />
                    <div>
                      <h4 className="font-semibold mb-1">Pontualidade Garantida</h4>
                      <p className="text-white/90 text-sm">Compromisso com horários e prazos estabelecidos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Packages */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-cantinho-navy">Nossos Pacotes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-cantinho-navy">Pacote Essencial</h4>
                      <p className="text-sm text-gray-600">Para eventos de até 50 pessoas</p>
                    </div>
                    <Badge variant="outline" className="border-cantinho-terracotta text-cantinho-terracotta">
                      Desde 15.000 AOA
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-cantinho-navy">Pacote Premium</h4>
                      <p className="text-sm text-gray-600">Para eventos de até 150 pessoas</p>
                    </div>
                    <Badge variant="outline" className="border-cantinho-terracotta text-cantinho-terracotta">
                      Desde 35.000 AOA
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-cantinho-navy">Pacote Luxo</h4>
                      <p className="text-sm text-gray-600">Para eventos de mais de 150 pessoas</p>
                    </div>
                    <Badge variant="outline" className="border-cantinho-terracotta text-cantinho-terracotta">
                      Sob consulta
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Eventos;
