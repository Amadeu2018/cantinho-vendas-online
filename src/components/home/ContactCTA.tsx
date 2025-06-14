
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, Mail, Clock, MapPin, Utensils, Calendar } from "lucide-react";

const ContactCTA = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-cantinho-olive via-cantinho-navy to-cantinho-olive relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cantinho-sand/10 rounded-full -translate-y-40 translate-x-40"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cantinho-terracotta/10 rounded-full translate-y-32 -translate-x-32"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Enhanced header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
            Pronto para uma Experiência Gastronómica Única?
          </h2>
          <p className="text-white/90 text-lg md:text-xl max-w-4xl mx-auto mb-8 animate-fade-in leading-relaxed">
            Faça já o seu pedido ou contacte-nos para descobrir como podemos transformar o seu evento numa celebração inesquecível com os nossos serviços de catering premium.
          </p>
        </div>

        {/* Quick info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-white">
            <Clock className="w-8 h-8 mx-auto mb-3 text-cantinho-sand" />
            <h3 className="font-bold mb-2">Entrega Rápida</h3>
            <p className="text-sm text-white/80">30 minutos em média</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-white">
            <Phone className="w-8 h-8 mx-auto mb-3 text-cantinho-sand" />
            <h3 className="font-bold mb-2">Suporte 24/7</h3>
            <p className="text-sm text-white/80">Sempre disponível para si</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-white">
            <MapPin className="w-8 h-8 mx-auto mb-3 text-cantinho-sand" />
            <h3 className="font-bold mb-2">Cobertura Total</h3>
            <p className="text-sm text-white/80">Toda Luanda e arredores</p>
          </div>
        </div>

        {/* Enhanced call-to-action buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 animate-fade-in">
          <Button asChild className="bg-cantinho-sand text-cantinho-navy hover:bg-white transition-all duration-300 px-8 py-4 text-lg font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105">
            <Link to="/primeiro-pedido" className="flex items-center gap-3">
              <Utensils className="w-5 h-5" />
              <span>Fazer Primeiro Pedido</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-2 border-cantinho-sand text-cantinho-sand hover:bg-cantinho-sand hover:text-cantinho-navy transition-all duration-300 px-8 py-4 text-lg font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105">
            <Link to="/eventos?package=premium" className="flex items-center gap-3">
              <Calendar className="w-5 h-5" />
              <span>Catering Premium</span>
            </Link>
          </Button>
        </div>

        {/* Contact information */}
        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl max-w-4xl mx-auto animate-fade-in">
          <h3 className="text-2xl font-bold text-white mb-6">Entre em Contacto Connosco</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
            <div className="flex items-center gap-3">
              <div className="bg-cantinho-sand/20 p-3 rounded-full">
                <Phone className="w-5 h-5 text-cantinho-sand" />
              </div>
              <div>
                <p className="font-semibold">Telefone</p>
                <p className="text-white/80">+244 924 678 544 / +244 934 625 513</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-cantinho-sand/20 p-3 rounded-full">
                <Mail className="w-5 h-5 text-cantinho-sand" />
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-white/80">info@cantinhoalgarvio.ao</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/20">
            <Button asChild variant="outline" className="border-cantinho-sand text-cantinho-sand hover:bg-cantinho-sand hover:text-cantinho-navy transition-all duration-300">
              <Link to="/contacto">
                <span>Página de Contacto Completa</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
