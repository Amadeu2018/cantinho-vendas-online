
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon, Quote, Users, MapPin } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Maria Silva",
    text: "Os pratos do Cantinho Algarvio são simplesmente deliciosos! Transportam-me para Portugal em cada garfada. O serviço de entrega é sempre pontual e os pratos chegam à temperatura ideal.",
    rating: 5,
    location: "Talatona, Luanda",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "João Carvalho",
    text: "Contratamos o serviço de catering para o aniversário da empresa e foi um sucesso! Comida incrível, apresentação impecável e o staff muito profissional. Todos os convidados ficaram impressionados.",
    rating: 5,
    location: "Miramar, Luanda",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Ana Batista",
    text: "A melhor cataplana que já comi em Angola! Ingredientes frescos e autêntico sabor português. Vale cada kwanza! O atendimento é excepcional e a entrega sempre no prazo.",
    rating: 5,
    location: "Benfica, Luanda",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-cantinho-navy via-cantinho-navy to-cantinho-terracotta relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-cantinho-sand/10 rounded-full -translate-y-32 -translate-x-32"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cantinho-sand/5 rounded-full translate-y-48 translate-x-48"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-cantinho-sand/20 p-3 rounded-full">
              <Quote className="w-6 h-6 text-cantinho-sand" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white animate-fade-in">
              Histórias de Satisfação
            </h2>
            <div className="bg-cantinho-sand/20 p-3 rounded-full">
              <Users className="w-6 h-6 text-cantinho-sand" />
            </div>
          </div>
          
          <p className="text-cantinho-sand text-lg md:text-xl mb-8 max-w-3xl mx-auto animate-fade-in">
            A satisfação dos nossos clientes é a nossa maior recompensa. Veja o que eles têm a dizer sobre a nossa comida e serviço excepcional.
          </p>

          {/* Trust indicators */}
          <div className="flex justify-center gap-8 mb-12 animate-fade-in">
            <div className="text-center">
              <div className="text-3xl font-bold text-cantinho-sand mb-1">4.9/5</div>
              <div className="text-white/80 text-sm">Avaliação Google</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cantinho-sand mb-1">1000+</div>
              <div className="text-white/80 text-sm">Clientes Felizes</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cantinho-sand mb-1">98%</div>
              <div className="text-white/80 text-sm">Recomendariam</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 hover:scale-105 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                {/* Quote icon */}
                <div className="flex justify-center mb-4">
                  <div className="bg-cantinho-navy/10 p-3 rounded-full">
                    <Quote className="h-6 w-6 text-cantinho-navy" />
                  </div>
                </div>

                {/* Stars */}
                <div className="flex justify-center items-center mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-gray-700 mb-6 italic text-center leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Customer info with avatar */}
                <div className="flex items-center justify-center gap-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover shadow-md"
                  />
                  <div className="text-center">
                    <p className="font-bold text-cantinho-navy">{testimonial.name}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{testimonial.location}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Junte-se aos Nossos Clientes Satisfeitos</h3>
            <p className="text-cantinho-sand mb-6">
              Experimente hoje a qualidade que nos tornou referência em delivery e catering em Angola
            </p>
            <button className="bg-cantinho-sand text-cantinho-navy px-8 py-3 rounded-lg font-bold hover:bg-white transition-colors duration-300">
              Fazer Primeiro Pedido
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
