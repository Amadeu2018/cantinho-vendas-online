
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Award, Utensils } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-cantinho-navy via-cantinho-navy to-cantinho-terracotta text-white py-20 overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg animate-fade-in">Cantinho Algarvio</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
          Mais de <span className="text-cantinho-sand font-semibold">8 anos</span> oferecendo sabor, tradição e excelência em alimentação e catering em Angola!
        </p>
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
          <Badge className="bg-cantinho-sand text-cantinho-navy px-4 py-2 text-sm flex items-center gap-1 animate-scale-in">
            <Calendar className="w-4 h-4 mr-1" />
            Desde 2014
          </Badge>
          <Badge className="bg-cantinho-sand text-cantinho-navy px-4 py-2 text-sm flex items-center gap-1 animate-scale-in">
            <Award className="w-4 h-4 mr-1" />
            HACCP Certificado
          </Badge>
          <Badge className="bg-cantinho-sand text-cantinho-navy px-4 py-2 text-sm flex items-center gap-1 animate-scale-in">
            <Utensils className="w-4 h-4 mr-1" />
            Culinária Nacional e Internacional
          </Badge>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-cantinho-terracotta/5 via-transparent to-cantinho-navy/20 pointer-events-none z-0" />
    </section>
  );
};

export default HeroSection;
