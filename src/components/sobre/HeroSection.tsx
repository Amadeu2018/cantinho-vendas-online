
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Award, Utensils } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-cantinho-navy via-cantinho-navy to-cantinho-terracotta text-white py-32 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1721322800607-8c38375eef04"
          alt="Ambiente elegante do restaurante"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-cantinho-navy/90 via-cantinho-navy/80 to-cantinho-terracotta/90"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-6xl md:text-7xl font-bold mb-8 drop-shadow-2xl animate-fade-in">
          Cantinho Algarvio
        </h1>
        <p className="text-2xl md:text-3xl mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in font-light">
          Mais de <span className="text-cantinho-sand font-bold text-4xl">8 anos</span> oferecendo sabor, tradição e excelência em alimentação e catering em Angola!
        </p>
        <div className="flex flex-wrap justify-center gap-6 animate-fade-in">
          <Badge className="bg-cantinho-sand text-cantinho-navy px-6 py-3 text-lg flex items-center gap-2 animate-scale-in shadow-lg">
            <Calendar className="w-5 h-5" />
            Desde 2014
          </Badge>
          <Badge className="bg-cantinho-sand text-cantinho-navy px-6 py-3 text-lg flex items-center gap-2 animate-scale-in shadow-lg">
            <Award className="w-5 h-5" />
            HACCP Certificado
          </Badge>
          <Badge className="bg-cantinho-sand text-cantinho-navy px-6 py-3 text-lg flex items-center gap-2 animate-scale-in shadow-lg">
            <Utensils className="w-5 h-5" />
            Culinária Nacional e Internacional
          </Badge>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
