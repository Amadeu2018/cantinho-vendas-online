import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, ShoppingCart, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Service {
  icon: React.ReactElement;
  title: string;
  description: string;
}

interface ServicesSectionProps {
  services: Service[];
}

const ServicesSection = ({ services }: ServicesSectionProps) => {
  const navigate = useNavigate();

  const handleOrderNow = () => {
    navigate("/cardapio");
  };

  const handleRequestQuote = () => {
    navigate("/eventos");
  };

  return (
    <section className="py-20 bg-cantinho-cream/60">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-cantinho-navy mb-12 animate-fade-in">
          Nossos Serviços Premium
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="hover:shadow-lg transition-shadow animate-scale-in"
            >
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 text-cantinho-terracotta mb-5">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-cantinho-navy mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in">
          <div className="bg-gradient-to-r from-cantinho-navy to-cantinho-terracotta p-8 rounded-2xl text-white max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Pronto para uma Experiência Gastronómica Única?
            </h3>
            <p className="text-lg mb-6 text-white/90 leading-relaxed">
              Descubra porque somos a escolha preferida para delivery e catering
              em Angola
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleOrderNow}
                className="bg-white text-cantinho-navy px-8 py-3 rounded-lg font-semibold hover:bg-cantinho-sand transition-colors duration-300 text-base"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Fazer Pedido Agora
              </Button>
              <Button
                onClick={handleRequestQuote}
                variant="outline"
                className="border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-300 text-base"
              >
                <FileText className="w-5 h-5 mr-2" />
                Solicitar Orçamento
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
