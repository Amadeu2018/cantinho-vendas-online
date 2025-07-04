import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, Mail, Clock, MapPin, Utensils, Calendar, Star, Award } from "lucide-react";
const ContactCTA = () => {
  return <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-cantinho-navy via-cantinho-olive to-cantinho-navy relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 sm:w-80 sm:h-80 bg-cantinho-sand/20 rounded-full -translate-y-20 sm:-translate-y-40 translate-x-20 sm:translate-x-40 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-64 sm:h-64 bg-cantinho-terracotta/20 rounded-full translate-y-16 sm:translate-y-32 -translate-x-16 sm:-translate-x-32 blur-2xl"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-cantinho-navy/95 via-cantinho-navy/90 to-cantinho-terracotta/95"></div>
      
      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Mobile-first header */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 animate-fade-in leading-tight">
            Pronto para uma Experiência Gastronómica Única?
          </h2>
          <p className="text-white/90 text-sm sm:text-lg md:text-xl max-w-4xl mx-auto mb-6 sm:mb-8 animate-fade-in leading-relaxed px-2">
            Faça já o seu pedido ou contacte-nos para descobrir como podemos transformar o seu evento numa celebração inesquecível com os nossos serviços de catering premium.
          </p>
        </div>

        {/* Mobile-optimized info cards with better contrast */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 animate-fade-in">
          <div className="bg-white/15 backdrop-blur-sm border border-white/20 p-4 sm:p-6 rounded-xl text-white shadow-lg hover:bg-white/20 transition-all duration-300">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-cantinho-sand" />
            <h3 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base text-white">Entrega Rápida</h3>
            <p className="text-xs sm:text-sm text-white/90">30 minutos em média</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm border border-white/20 p-4 sm:p-6 rounded-xl text-white shadow-lg hover:bg-white/20 transition-all duration-300">
            <Phone className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-cantinho-sand" />
            <h3 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base text-white">Suporte 24/7</h3>
            <p className="text-xs sm:text-sm text-white/90">Sempre disponível</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm border border-white/20 p-4 sm:p-6 rounded-xl text-white shadow-lg hover:bg-white/20 transition-all duration-300">
            <MapPin className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-cantinho-sand" />
            <h3 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base text-white">Cobertura Total</h3>
            <p className="text-xs sm:text-sm text-white/90">Toda Luanda</p>
          </div>
        </div>

        {/* Mobile-first action buttons with better visibility */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-12 animate-fade-in">
          <Button asChild className="bg-cantinho-sand text-cantinho-navy hover:bg-white hover:text-cantinho-navy transition-all duration-300 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 w-full sm:w-auto border-2 border-transparent hover:border-cantinho-sand">
            <Link to="/primeiro-pedido" className="flex items-center justify-center gap-2 sm:gap-3">
              <Utensils className="w-5 h-5" />
              <span>Fazer Primeiro Pedido</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-2 border-cantinho-sand text-cantinho-sand hover:bg-cantinho-sand hover:text-cantinho-navy transition-all duration-300 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 w-full sm:w-auto bg-transparent">
            <Link to="/eventos?package=premium" className="flex items-center justify-center gap-2 sm:gap-3">
              <Calendar className="w-5 h-5" />
              <span>Catering Premium</span>
            </Link>
          </Button>
        </div>

        {/* Mobile-optimized contact information with better contrast */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 rounded-2xl max-w-4xl mx-auto animate-fade-in shadow-2xl">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Entre em Contacto Connosco</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-white mb-6">
            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="bg-cantinho-sand/30 p-3 rounded-full flex-shrink-0 border border-cantinho-sand/50">
                <Phone className="w-5 h-5 text-cantinho-sand" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-base text-white mb-1">Telefone</p>
                <p className="text-white/90 text-sm">+244 924 678 544</p>
                <p className="text-white/90 text-sm">+244 939 423 110</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="bg-cantinho-sand/30 p-3 rounded-full flex-shrink-0 border border-cantinho-sand/50">
                <Mail className="w-5 h-5 text-cantinho-sand" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-base text-white mb-1">Email</p>
                <p className="text-white/90 text-sm">info@cantinhoalgarvio.ao</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 sm:pt-6 border-t border-white/30">
            <Button asChild variant="outline" className="border-2 border-cantinho-sand text-cantinho-sand hover:bg-cantinho-sand hover:text-cantinho-navy transition-all duration-300 w-full sm:w-auto bg-transparent shadow-lg hover:shadow-xl">
              <Link to="/contacto">
                <span>Página de Contacto Completa</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default ContactCTA;