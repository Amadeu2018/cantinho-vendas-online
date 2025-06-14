
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChefHat, Fish } from 'lucide-react';

const FishSpecialties = () => {
  const fishDishes = [
    {
      title: "Peixe Grelhado",
      description: "Corvina, piazete, garoupa - grelhados na perfeição com temperos especiais da casa",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
      specialty: "Especialidade da Casa"
    },
    {
      title: "Cozido de Peixe",
      description: "Filetes de pescadas cozidos com temperos especiais e acompanhamentos tradicionais",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      specialty: "Receita Tradicional"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-cantinho-cream/40 to-cantinho-sand/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="bg-cantinho-terracotta/10 p-4 rounded-full">
              <Fish className="w-8 h-8 text-cantinho-terracotta" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-cantinho-navy mb-6 animate-fade-in">
            Pratos de Peixes
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto animate-fade-in leading-relaxed">
            Especializamo-nos em pratos de peixe fresco, preparados com técnicas tradicionais e ingredientes selecionados. 
            Cada prato conta uma história de sabor autêntico.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {fishDishes.map((dish, index) => (
            <Card key={index} className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-scale-in overflow-hidden group">
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-cantinho-terracotta text-white px-3 py-1 rounded-full text-sm font-medium">
                      {dish.specialty}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <ChefHat className="w-5 h-5 text-cantinho-terracotta" />
                    <h3 className="text-2xl font-bold text-cantinho-navy">{dish.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{dish.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FishSpecialties;
