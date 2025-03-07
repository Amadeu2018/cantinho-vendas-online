
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Maria Silva",
    text: "Os pratos do Cantinho Algarvio são simplesmente deliciosos! Transportam-me para Portugal em cada garfada. O serviço de entrega é sempre pontual e os pratos chegam à temperatura ideal.",
    rating: 5,
    location: "Talatona, Luanda"
  },
  {
    id: 2,
    name: "João Carvalho",
    text: "Contratamos o serviço de catering para o aniversário da empresa e foi um sucesso! Comida incrível, apresentação impecável e o staff muito profissional. Todos os convidados ficaram impressionados.",
    rating: 5,
    location: "Miramar, Luanda"
  },
  {
    id: 3,
    name: "Ana Batista",
    text: "A melhor cataplana que já comi em Angola! Ingredientes frescos e autêntico sabor português. Vale cada kwanza!",
    rating: 4,
    location: "Benfica, Luanda"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-cantinho-navy">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3 text-white">O Que Dizem Os Nossos Clientes</h2>
        <p className="text-center text-cantinho-sand mb-10 max-w-2xl mx-auto">
          A satisfação dos nossos clientes é a nossa maior recompensa. Veja o que eles têm a dizer sobre a nossa comida e serviço.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill={i < testimonial.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
