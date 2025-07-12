import React from 'react';

const GallerySection = () => {
  const images = [
    {
      src: "/lovable-uploads/4e9ff3a4-9abb-402e-b9b9-cbf069b8cb3b.png",
      alt: "Ambiente do café e restaurante com máquina de café profissional",
      title: "Ambiente Acolhedor"
    },
    {
      src: "/lovable-uploads/cc7f2359-591e-4346-9fab-0c3b4461f05c.png", 
      alt: "Arte em melancia esculpida em formato de flor",
      title: "Arte Culinária"
    },
    {
      src: "/lovable-uploads/cbfd9626-e969-4dc2-8cbf-dac1558aaadf.png",
      alt: "Mesa de sobremesas com apresentação elegante",
      title: "Sobremesas Exclusivas"
    },
    {
      src: "/lovable-uploads/9941d444-b120-43d9-840d-cab71bb779f6.png",
      alt: "Expositor de frutos do mar frescos",
      title: "Frutos do Mar Frescos"
    },
    {
      src: "/lovable-uploads/f4ee9f7e-3740-40d1-abef-61950648b6a1.png",
      alt: "Bolo decorado artisticamente",
      title: "Doçaria Artesanal"
    },
    {
      src: "/lovable-uploads/c4e8b57d-4981-4ff6-b669-44d5f135fb2c.png",
      alt: "Prato de sushi e sashimi premium",
      title: "Culinária Internacional"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {images.map((image, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg bg-white animate-scale-in hover:shadow-2xl transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-lg font-semibold mb-2">
                    {image.title}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {image.alt}
                  </p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-cantinho-navy text-center">
                  {image.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

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