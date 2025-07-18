import React from 'react';
import { FocusCards } from '@/components/ui/focus-cards';

const GallerySection = () => {
  const galleryCards = [
    {
      title: "Ambiente Acolhedor",
      description: "Espaço moderno e confortável com máquina de café profissional para uma experiência gastronómica completa.",
      image: "/lovable-uploads/4e9ff3a4-9abb-402e-b9b9-cbf069b8cb3b.png",
      ctaText: "Conhecer Espaço"
    },
    {
      title: "Arte Culinária", 
      description: "Apresentações artísticas únicas, como esta escultura em melancia, que demonstram nossa paixão pela gastronomia.",
      image: "/lovable-uploads/cc7f2359-591e-4346-9fab-0c3b4461f05c.png",
      ctaText: "Ver Criações"
    },
    {
      title: "Sobremesas Exclusivas",
      description: "Mesa de sobremesas elegantes preparadas pelos nossos chefs para ocasiões especiais e eventos.",
      image: "/lovable-uploads/cbfd9626-e969-4dc2-8cbf-dac1558aaadf.png",
      ctaText: "Encomendar"
    },
    {
      title: "Frutos do Mar Frescos",
      description: "Expositor com os melhores frutos do mar frescos, garantindo qualidade e sabor em cada prato servido.",
      image: "/lovable-uploads/9941d444-b120-43d9-840d-cab71bb779f6.png",
      ctaText: "Ver Menu"
    },
    {
      title: "Doçaria Artesanal",
      description: "Bolos e doces decorados artisticamente para celebrações especiais e momentos únicos.",
      image: "/lovable-uploads/f4ee9f7e-3740-40d1-abef-61950648b6a1.png",
      ctaText: "Personalizar"
    },
    {
      title: "Culinária Internacional",
      description: "Diversidade gastronómica com pratos internacionais, incluindo sushi e sashimi premium preparados por especialistas.",
      image: "/lovable-uploads/c4e8b57d-4981-4ff6-b669-44d5f135fb2c.png",
      ctaText: "Experimentar"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-cantinho-sand/20 via-white to-cantinho-cream/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-cantinho-navy mb-6 animate-fade-in">
            Nossa Galeria Gastronómica
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in leading-relaxed">
            Uma viagem visual pelos sabores únicos e apresentações artísticas que fazem do Cantinho Algarvio uma experiência inesquecível
          </p>
        </div>

        <FocusCards cards={galleryCards} className="mb-12" />

        <div className="text-center mt-12 animate-fade-in">
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cada prato é uma obra de arte cuidadosamente preparada pelos nossos chefs especialistas, 
            combinando tradição algárvia com técnicas contemporâneas para criar experiências gastronómicas únicas.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;