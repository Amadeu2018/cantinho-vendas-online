
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EventForm from "@/components/eventos/EventForm";
import EventConfirmation from "@/components/eventos/EventConfirmation";
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
  Heart,
  CheckCircle,
  Sparkles
} from "lucide-react";

const Eventos = () => {
  const [eventRequest, setEventRequest] = useState<any>(null);

  const handleFormSubmit = (formData: any) => {
    setEventRequest(formData);
  };

  if (eventRequest) {
    return (
      <EventConfirmation 
        requestId="temp-id"
        formData={eventRequest}
        onClose={() => setEventRequest(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cantinho-cream/30 via-white to-cantinho-sand/20">
      <Navbar />
      
      {/* Hero Section - Mobile First */}
      <section className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-cantinho-terracotta/10 p-3 rounded-full">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-cantinho-terracotta" />
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-cantinho-navy">
                Eventos <span className="text-cant inho-terracotta">Inesquecíveis</span>
              </h1>
              <div className="bg-cantinho-terracotta/10 p-3 rounded-full">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-cantinho-terracotta" />
              </div>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              Transformamos seus momentos especiais em experiências culinárias únicas. 
              Do planejamento à execução, cuidamos de cada detalhe para tornar seu evento perfeito.
            </p>
          </div>

          {/* Trust indicators - Mobile optimized */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
            <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold text-cantinho-terracotta mb-1">500+</div>
              <div className="text-sm text-gray-600">Eventos Realizados</div>
            </div>
            <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold text-cantinho-navy mb-1">98%</div>
              <div className="text-sm text-gray-600">Satisfação</div>
            </div>
            <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold text-cantinho-terracotta mb-1">24h</div>
              <div className="text-sm text-gray-600">Suporte</div>
            </div>
            <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold text-cantinho-navy mb-1">8+</div>
              <div className="text-sm text-gray-600">Anos Experiência</div>
            </div>
          </div>

          {/* Services Cards - Mobile first grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm group">
              <CardContent className="p-6 sm:p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-cantinho-terracotta to-cantinho-sand rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-cantinho-navy mb-3">Casamentos</h3>
                <p className="text-gray-600 mb-4">Celebre o amor com um banquete memorável, cardápios personalizados e serviço impecável.</p>
                <div className="flex items-center justify-center gap-2 text-sm text-cantinho-terracotta">
                  <CheckCircle className="w-4 h-4" />
                  <span>Setup completo incluído</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm group">
              <CardContent className="p-6 sm:p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-cantinho-navy to-cantinho-cornflower rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-cantinho-navy mb-3">Eventos Corporativos</h3>
                <p className="text-gray-600 mb-4">Impressione seus parceiros e colaboradores com eventos profissionais de alta qualidade.</p>
                <div className="flex items-center justify-center gap-2 text-sm text-cantinho-terracotta">
                  <CheckCircle className="w-4 h-4" />
                  <span>Serviço executivo premium</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm group">
              <CardContent className="p-6 sm:p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-cantinho-terracotta to-cantinho-navy rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-cantinho-navy mb-3">Celebrações</h3>
                <p className="text-gray-600 mb-4">Aniversários, formaturas e ocasiões especiais merecem uma comemoração à altura.</p>
                <div className="flex items-center justify-center gap-2 text-sm text-cantinho-terracotta">
                  <CheckCircle className="w-4 h-4" />
                  <span>Personalização total</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile-first layout for form and info */}
          <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-12 items-start">
            <div className="order-2 lg:order-1">
              <EventForm onSubmit={handleFormSubmit} />
            </div>

            {/* Info Section - Mobile optimized */}
            <div className="order-1 lg:order-2 space-y-6 sm:space-y-8">
              
              <Card className="border-0 bg-gradient-to-br from-cantinho-navy to-cantinho-cornflower text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <Star className="h-5 w-5 sm:h-6 sm:w-6" />
                    Por que escolher o Cantinho Algarvio?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 mt-1 text-cantinho-sand flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Experiência Comprovada</h4>
                      <p className="text-white/90 text-sm">Mais de 500 eventos realizados com excelência</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarDays className="h-5 w-5 mt-1 text-cantinho-sand flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Planejamento Personalizado</h4>
                      <p className="text-white/90 text-sm">Cada evento é único e planejado especialmente para você</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-1 text-cantinho-sand flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Flexibilidade de Local</h4>
                      <p className="text-white/90 text-sm">Atendemos em diversos locais em Luanda</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 mt-1 text-cantinho-sand flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Pontualidade Garantida</h4>
                      <p className="text-white/90 text-sm">Compromisso com horários e prazos estabelecidos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Packages - Mobile optimized */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-cantinho-navy text-lg sm:text-xl">Nossos Pacotes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-50 rounded-lg gap-2">
                    <div>
                      <h4 className="font-semibold text-cantinho-navy">Pacote Essencial</h4>
                      <p className="text-sm text-gray-600">Para eventos de até 50 pessoas</p>
                    </div>
                    <Badge variant="outline" className="border-cantinho-terracotta text-cantinho-terracotta self-start sm:self-center">
                      Desde 15.000 AOA
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-50 rounded-lg gap-2">
                    <div>
                      <h4 className="font-semibold text-cantinho-navy">Pacote Premium</h4>
                      <p className="text-sm text-gray-600">Para eventos de até 150 pessoas</p>
                    </div>
                    <Badge variant="outline" className="border-cantinho-terracotta text-cantinho-terracotta self-start sm:self-center">
                      Desde 35.000 AOA
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-50 rounded-lg gap-2">
                    <div>
                      <h4 className="font-semibold text-cantinho-navy">Pacote Luxo</h4>
                      <p className="text-sm text-gray-600">Para eventos de mais de 150 pessoas</p>
                    </div>
                    <Badge variant="outline" className="border-cantinho-terracotta text-cantinho-terracotta self-start sm:self-center">
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
