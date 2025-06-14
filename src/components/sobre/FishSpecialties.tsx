
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const FishSpecialties = () => {
  const fishDishes = [
    {
      title: "Peixe Grelhado",
      description: "Corvina, piazete, garoupa - grelhados na perfeição",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
    },
    {
      title: "Cozido de Peixe",
      description: "Filetes de pescadas cozidos com temperos especiais",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
    }
  ];

  return (
    <section className="py-20 bg-cantinho-cream/60">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-cantinho-navy mb-4 animate-fade-in">Pratos de Peixes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto animate-fade-in">
            Especializamo-nos em pratos de peixe fresco, preparados com técnicas tradicionais e ingredientes selecionados.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {fishDishes.map((dish, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow animate-scale-in">
              <CardContent className="p-6">
                <img
                  src={dish.image}
                  alt={dish.title}
                  className="w-full h-44 object-cover rounded-xl mb-4"
                />
                <h3 className="text-lg font-semibold text-cantinho-navy mb-2">{dish.title}</h3>
                <p className="text-gray-600 text-sm">{dish.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FishSpecialties;
