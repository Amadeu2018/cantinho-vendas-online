
import React from 'react';

const ClientsSection = () => {
  const clients = [
    { name: "ETAL", displayName: "ETAL" },
    { name: "SPIC", displayName: "SPIC Oil & Gas Angola" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-cantinho-navy mb-12 animate-fade-in">Nossos Clientes</h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-12">
          {clients.map((client, index) => (
            <div key={index} className="text-center animate-scale-in">
              <div className="bg-cantinho-cream p-6 rounded-xl shadow mb-4 flex items-center justify-center">
                <div className="w-24 h-24 bg-cantinho-sand rounded-lg flex items-center justify-center mx-auto text-xl text-cantinho-navy font-bold">
                  {client.name}
                </div>
              </div>
              <p className="text-gray-700 font-medium">{client.displayName}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
