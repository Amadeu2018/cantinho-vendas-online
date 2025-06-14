
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MenuCategories = () => {
  const menuCategories = [
    {
      title: "Pratos de Carnes",
      items: [
        "Bife de cogumelos", "Peito de frango grelhado", "Estrogonofe",
        "Caldeirada de cabrito", "Jardineira de frango", "Funge de carne seca",
        "Bifana", "Pernil no forno e grelhada mista", "Feijoada transmontana",
        "Cozido à Portuguesa", "Entremeadas grelhadas", "Carne de porco à portuguesa"
      ]
    },
    {
      title: "Guarnições",
      items: [
        "Batata frita", "Batata cozida", "Batata doce", "Batata corada",
        "Abóbora grelhada", "Arroz branco", "Arroz de legumes", "Arroz de cenoura",
        "Arroz de ervilha", "Arroz Xau Xau", "Salada mista", "Esparguete aldente",
        "Kisaca", "Feijão e legumes salteados"
      ]
    },
    {
      title: "Molhos",
      items: [
        "Molho de vinagrete", "Vinagrete lima", "Molho de mostarda",
        "Maionese", "Ketchup", "Molho de ervas", "Molho tártaro",
        "Azeite", "Vinagre de maçã"
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-cantinho-navy mb-12 animate-fade-in">Especialidades Culinárias</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {menuCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow animate-fade-in">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-cantinho-navy mb-4 text-center">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item, itemIndex) => (
                    <Badge
                      key={itemIndex}
                      variant="outline"
                      className="text-xs bg-cantinho-sand border-cantinho-navy/20 hover:bg-cantinho-terracotta/10"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuCategories;
