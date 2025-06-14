
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Utensils } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      title: "Pequeno Almoço",
      description: "Opções nutritivas, saborosas e frescas logo cedo"
    },
    {
      title: "Almoço",
      description: "Pratos tradicionais e contemporâneos para seu almoço"
    },
    {
      title: "Jantar",
      description: "Gastronomia única para noites inesquecíveis"
    }
  ];

  return (
    <section className="py-20 bg-cantinho-cream/60">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-cantinho-navy mb-12 animate-fade-in">Nossos Serviços</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <Card key={service.title} className="hover:shadow-lg transition-shadow animate-scale-in">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <Utensils className="w-12 h-12 text-cantinho-terracotta mb-5" />
                <h3 className="text-xl font-semibold text-cantinho-navy mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
