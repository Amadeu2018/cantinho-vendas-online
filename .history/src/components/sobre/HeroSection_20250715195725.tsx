import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CompanyStat {
  label: string;
  value: string;
}

interface HeroSectionProps {
  companyStats: CompanyStat[];
  logo?: string;
}

const HeroSection = ({ companyStats, logo }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-cantinho-navy via-cantinho-cornflower to-cantinho-sky overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen text-center">
        {/* Logo */}
        {logo && (
          <div className="mb-8 animate-fade-in">
            <img 
              src={logo} 
              alt="Cantinho Algarvio Logo" 
              className="w-32 h-32 md:w-48 md:h-48 object-contain mx-auto rounded-full shadow-2xl bg-white/10 backdrop-blur-sm p-4"
            />
          </div>
        )}

        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 hero-text-shadow animate-fade-in">
          Cantinho Algarvio
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-cantinho-offwhite mb-8 max-w-3xl hero-text-shadow animate-fade-in">
          Tradição, Sabor e Qualidade em cada prato. 
          Especialistas em gastronomia algarvia há mais de 8 anos.
        </p>

        {/* Company Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-12 w-full max-w-4xl animate-scale-in">
          {companyStats.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-cantinho-offwhite">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default HeroSection;