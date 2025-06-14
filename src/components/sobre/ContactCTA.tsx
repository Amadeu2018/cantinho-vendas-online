
import React from 'react';
import { Phone, Mail } from 'lucide-react';

const ContactCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-cantinho-navy to-cantinho-terracotta text-white animate-fade-in">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">Pronto para uma Experiência Gastronómica Única?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto animate-fade-in">
          Entre em contacto connosco e descubra como podemos tornar o seu evento inesquecível.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-6">
          <div className="flex items-center gap-2 bg-cantinho-sand/20 px-6 py-3 rounded-xl shadow animate-scale-in">
            <Phone className="w-5 h-5" />
            <span className="font-semibold">924 678 544 / 934 625 513</span>
          </div>
          <div className="flex items-center gap-2 bg-cantinho-sand/20 px-6 py-3 rounded-xl shadow animate-scale-in">
            <Mail className="w-5 h-5" />
            <span className="font-semibold">info@cantinhoalgarvio.ao</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
