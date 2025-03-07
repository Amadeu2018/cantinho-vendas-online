
import { Utensils, Truck, Calendar } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <Utensils className="h-12 w-12 text-cantinho-terracotta" />,
      title: "Take-Away",
      description: "Recolha o seu pedido quente e pronto a comer no nosso restaurante."
    },
    {
      icon: <Truck className="h-12 w-12 text-cantinho-terracotta" />,
      title: "Entrega ao Domicílio",
      description: "Entregamos os nossos pratos diretamente na sua porta em Luanda."
    },
    {
      icon: <Calendar className="h-12 w-12 text-cantinho-terracotta" />,
      title: "Catering para Eventos",
      description: "Serviços de catering para casamentos, aniversários e eventos empresariais."
    }
  ];

  return (
    <section className="py-16 bg-cantinho-cream">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nossos Serviços</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md p-6 text-center transition-transform hover:scale-105"
            >
              <div className="flex justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-cantinho-navy">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
