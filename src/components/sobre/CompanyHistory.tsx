
import React from 'react';
import { MapPin, Users } from 'lucide-react';

const CompanyHistory = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-cantinho-navy mb-6 animate-fade-in">Nossa História</h2>
          <p className="text-gray-700 mb-4 leading-relaxed animate-fade-in">
            A <span className="text-cantinho-terracotta font-semibold">Cantinho Algarvio, LDA</span> consolidou-se como referência na prestação de serviços de alimentação em Angola. Nosso core é gestão de cozinha, restauração, hotelaria e catering, sempre com um toque de inovação.
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed animate-fade-in">
            Dispomos de equipamentos modernos e equipe experiente, incluindo alguns dos melhores chefs de Angola, mesclando o melhor da culinária nacional e internacional.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            <div className="flex items-center space-x-3">
              <MapPin className="text-cantinho-terracotta w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-cantinho-navy">Sede</p>
                <p className="text-sm text-gray-600">Luanda, Praia do Bispo</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="text-cantinho-terracotta w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-cantinho-navy">NIF</p>
                <p className="text-sm text-gray-600">5417453110</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative animate-scale-in">
          <img
            src="https://images.unsplash.com/photo-1721322800607-8c38375eef04"
            alt="Interior do restaurante"
            className="rounded-xl shadow-2xl w-full h-80 object-cover border-4 border-cantinho-terracotta/20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cantinho-navy/20 to-transparent rounded-xl pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default CompanyHistory;
