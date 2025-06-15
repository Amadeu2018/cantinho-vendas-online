
import { Utensils, Truck, Calendar, Award, Clock, Headphones, Star, MapPin } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <Utensils className="h-10 w-10 sm:h-12 sm:w-12 text-cantinho-terracotta" />,
      title: "Take-Away Premium",
      description: "Recolha o seu pedido quente e pronto a comer no nosso restaurante com ambiente acolhedor.",
      features: ["Pronto em 15min", "Embalagem ecológica", "Desconto 5%"]
    },
    {
      icon: <Truck className="h-10 w-10 sm:h-12 sm:w-12 text-cantinho-terracotta" />,
      title: "Entrega Expressa",
      description: "Entregamos os nossos pratos diretamente na sua porta em toda Luanda com rapidez e cuidado.",
      features: ["30min máximo", "Rastreamento real", "Temperatura ideal"]
    },
    {
      icon: <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-cantinho-terracotta" />,
      title: "Catering Corporativo",
      description: "Serviços de catering profissional para casamentos, aniversários e eventos empresariais.",
      features: ["Personalização total", "Equipe especializada", "Setup completo"]
    }
  ];

  const stats = [
    { icon: <Award className="h-5 w-5 sm:h-6 sm:w-6" />, number: "8+", label: "Anos de Excelência" },
    { icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6" />, number: "30min", label: "Tempo Médio" },
    { icon: <Headphones className="h-5 w-5 sm:h-6 sm:w-6" />, number: "24/7", label: "Suporte" }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-cantinho-cream via-white to-cantinho-sand/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-cantinho-terracotta/5 rounded-full -translate-y-24 sm:-translate-y-48 translate-x-24 sm:translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-64 sm:h-64 bg-cantinho-navy/5 rounded-full translate-y-16 sm:translate-y-32 -translate-x-16 sm:-translate-x-32"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Mobile-first header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-cantinho-navy animate-fade-in">
            Nossos Serviços Premium
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in leading-relaxed px-2">
            Oferecemos soluções gastronómicas completas com a qualidade e tradição que nos distingue há mais de 8 anos
          </p>
        </div>

        {/* Mobile-optimized stats */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-10 sm:mb-16 animate-fade-in">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg flex-1 min-w-[100px] max-w-[120px] sm:max-w-none sm:flex-initial">
              <div className="flex items-center justify-center text-cantinho-terracotta mb-2">
                {stat.icon}
              </div>
              <div className="text-lg sm:text-2xl font-bold text-cantinho-navy">{stat.number}</div>
              <div className="text-xs sm:text-sm text-gray-600 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* Mobile-first services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center transition-all duration-300 hover:shadow-2xl hover:scale-105 animate-scale-in border border-cantinho-sand/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Mobile-optimized icon */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="bg-gradient-to-br from-cantinho-terracotta/10 to-cantinho-terracotta/20 p-3 sm:p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-cantinho-navy group-hover:text-cantinho-terracotta transition-colors duration-300">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                {service.description}
              </p>
              
              {/* Mobile-optimized feature list */}
              <div className="space-y-2 sm:space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center justify-center gap-2 text-xs sm:text-sm text-cantinho-navy">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cantinho-terracotta rounded-full flex-shrink-0"></div>
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile-first call to action */}
        <div className="text-center animate-fade-in">
          <div className="bg-gradient-to-r from-cantinho-navy to-cantinho-terracotta p-6 sm:p-8 rounded-2xl text-white max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
              Pronto para uma Experiência Gastronómica Única?
            </h3>
            <p className="text-sm sm:text-lg mb-4 sm:mb-6 text-white/90 leading-relaxed px-2">
              Descubra porque somos a escolha preferida para delivery e catering em Angola
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button className="bg-white text-cantinho-navy px-6 py-3 sm:px-8 sm:py-3 rounded-lg font-semibold hover:bg-cantinho-sand transition-colors duration-300 text-sm sm:text-base">
                Fazer Pedido Agora
              </button>
              <button className="border border-white text-white px-6 py-3 sm:px-8 sm:py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-300 text-sm sm:text-base">
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
