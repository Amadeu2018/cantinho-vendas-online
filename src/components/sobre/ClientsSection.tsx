
import React from 'react';
import { Handshake, Building2 } from 'lucide-react';

const ClientsSection = () => {
  const clients = [
    { 
      name: "ETAL", 
      displayName: "ETAL",
      description: "Parceria estratégica em alimentação corporativa"
    },
    { 
      name: "SPIC", 
      displayName: "SPIC Oil & Gas Angola",
      description: "Serviços de catering especializado para indústria petrolífera"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cantinho-sand/10 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-cantinho-terracotta/10 rounded-full translate-y-24 -translate-x-24"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="bg-cantinho-navy/10 p-4 rounded-full">
              <Handshake className="w-8 h-8 text-cantinho-navy" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-cantinho-navy mb-6 animate-fade-in">
            Nossos Clientes
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto animate-fade-in">
            Orgulhamo-nos de servir empresas líderes em Angola, construindo parcerias duradouras baseadas na confiança e excelência.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {clients.map((client, index) => (
            <div key={index} className="text-center animate-scale-in group">
              <div className="bg-gradient-to-br from-cantinho-cream to-cantinho-sand/30 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-8 h-8 text-cantinho-navy" />
                  </div>
                </div>
                <div className="w-32 h-32 bg-cantinho-sand/50 rounded-2xl flex items-center justify-center mx-auto text-2xl text-cantinho-navy font-bold shadow-inner">
                  {client.name}
                </div>
              </div>
              <h3 className="text-xl font-bold text-cantinho-navy mb-2">{client.displayName}</h3>
              <p className="text-gray-600">{client.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-cantinho-terracotta/5 p-8 rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-cantinho-navy mb-4">Junte-se aos Nossos Clientes</h3>
            <p className="text-gray-600">
              Descubra porque empresas líderes confiam em nós para suas necessidades de alimentação e catering.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
