
import React from 'react';
import { MapPin, Users, Star, Trophy } from 'lucide-react';

const CompanyHistory = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-cantinho-navy mb-8 animate-fade-in">
              Nossa História
            </h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed animate-fade-in">
              A <span className="text-cantinho-terracotta font-semibold">Cantinho Algarvio, LDA</span> consolidou-se como referência na prestação de serviços de alimentação em Angola. Nosso core é gestão de cozinha, restauração, hotelaria e catering, sempre com um toque de inovação.
            </p>
            <p className="text-gray-700 text-lg mb-8 leading-relaxed animate-fade-in">
              Dispomos de equipamentos modernos e equipe experiente, incluindo alguns dos melhores chefs de Angola, mesclando o melhor da culinária nacional e internacional.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
              <div className="flex items-center space-x-4 bg-cantinho-cream/30 p-4 rounded-xl">
                <MapPin className="text-cantinho-terracotta w-6 h-6 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-cantinho-navy text-lg">Sede</p>
                  <p className="text-gray-600">Luanda, Praia do Bispo</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-cantinho-cream/30 p-4 rounded-xl">
                <Users className="text-cantinho-terracotta w-6 h-6 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-cantinho-navy text-lg">NIF</p>
                  <p className="text-gray-600">5417453110</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <div className="flex items-center gap-2 bg-cantinho-terracotta/10 px-4 py-2 rounded-full">
                <Star className="w-4 h-4 text-cantinho-terracotta" />
                <span className="text-cantinho-navy font-medium">Excelência em Qualidade</span>
              </div>
              <div className="flex items-center gap-2 bg-cantinho-terracotta/10 px-4 py-2 rounded-full">
                <Trophy className="w-4 h-4 text-cantinho-terracotta" />
                <span className="text-cantinho-navy font-medium">Líderes no Mercado</span>
              </div>
            </div>
          </div>
          
          <div className="relative animate-scale-in">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
                alt="Prato sofisticado do Cantinho Algarvio"
                className="rounded-xl shadow-lg w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
                alt="Ambiente acolhedor e elegante"
                className="rounded-xl shadow-lg w-full h-48 object-cover hover:scale-105 transition-transform duration-300 mt-8"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-cantinho-sand p-6 rounded-xl shadow-xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-cantinho-navy">8+</div>
                <div className="text-sm text-gray-600">Anos de</div>
                <div className="text-sm text-gray-600">Experiência</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyHistory;
