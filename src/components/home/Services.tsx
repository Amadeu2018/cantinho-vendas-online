
import { Utensils, Truck, Calendar, Award, Clock, Headphones } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <Utensils className="h-12 w-12 text-cantinho-terracotta" />,
      title: "Take-Away Premium",
      description: "Recolha o seu pedido quente e pronto a comer no nosso restaurante com ambiente acolhedor.",
      features: ["Pronto em 15min", "Embalagem ecológica", "Desconto 5%"]
    },
    {
      icon: <Truck className="h-12 w-12 text-cantinho-terracotta" />,
      title: "Entrega Expressa",
      description: "Entregamos os nossos pratos diretamente na sua porta em toda Luanda com rapidez e cuidado.",
      features: ["30min máximo", "Rastreamento em tempo real", "Temperatura ideal"]
    },
    {
      icon: <Calendar className="h-12 w-12 text-cantinho-terracotta" />,
      title: "Catering Corporativo",
      description: "Serviços de catering profissional para casamentos, aniversários e eventos empresariais.",
      features: ["Personalização total", "Equipe especializada", "Setup completo"]
    }
  ];

  const stats = [
    { icon: <Award className="h-6 w-6" />, number: "8+", label: "Anos de Excelência" },
    { icon: <Clock className="h-6 w-6" />, number: "30min", label: "Tempo Médio" },
    { icon: <Headphones className="h-6 w-6" />, number: "24/7", label: "Suporte" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-cantinho-cream via-white to-cantinho-sand/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cantinho-terracotta/5 rounded-full -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cantinho-navy/5 rounded-full translate-y-32 -translate-x-32"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-cantinho-navy animate-fade-in">
            Nossos Serviços Premium
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in">
            Oferecemos soluções gastronómicas completas com a qualidade e tradição que nos distingue há mais de 8 anos
          </p>
        </div>

        {/* Stats row */}
        <div className="flex justify-center gap-8 mb-16 animate-fade-in">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-center text-cantinho-terracotta mb-2">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-cantinho-navy">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* Enhanced services grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl shadow-lg p-8 text-center transition-all duration-300 hover:shadow-2xl hover:scale-105 animate-scale-in border border-cantinho-sand/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon with enhanced styling */}
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-cantinho-terracotta/10 to-cantinho-terracotta/20 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-cantinho-navy group-hover:text-cantinho-terracotta transition-colors duration-300">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              
              {/* Feature list */}
              <div className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center justify-center gap-2 text-sm text-cantinho-navy">
                    <div className="w-2 h-2 bg-cantinho-terracotta rounded-full"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="bg-gradient-to-r from-cantinho-navy to-cantinho-terracotta p-8 rounded-2xl text-white max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Pronto para uma Experiência Gastronómica Única?
            </h3>
            <p className="text-lg mb-6 text-white/90">
              Descubra porque somos a escolha preferida para delivery e catering em Angola
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-cantinho-navy px-8 py-3 rounded-lg font-semibold hover:bg-cantinho-sand transition-colors duration-300">
                Fazer Pedido Agora
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-300">
                Solicitar Orçamento
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
