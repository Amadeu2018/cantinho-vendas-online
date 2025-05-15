
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  MapPin, 
  Phone, 
  Mail,
  Clock
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-cantinho-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Cantinho Algarvio</h3>
            <p className="text-gray-300 mb-4">
              Gestão de Cozinha, Prestação de Serviço no
              ramo Hoteleiro, Restauração, Catering e Buffet, com equipamentos modernos e
              pessoal competente.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-cantinho-terracotta transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-cantinho-terracotta transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-cantinho-terracotta transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-cantinho-terracotta transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-300 hover:text-cantinho-terracotta transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-gray-300 hover:text-cantinho-terracotta transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/eventos" className="text-gray-300 hover:text-cantinho-terracotta transition-colors">
                  Eventos
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-300 hover:text-cantinho-terracotta transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contactos</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-cantinho-terracotta" />
                <span className="text-gray-300">
                  Bairro da Praia do Bispo, Rua Drº António Agostinho Neto, s/nº, Luanda
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0 text-cantinho-terracotta" />
                <span className="text-gray-300">+244 924 678 544 / +244 934 625 513</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0 text-cantinho-terracotta" />
                <span className="text-gray-300">cantinhoalgarvio@gmail.com</span>
              </li>
            </ul>
          </div>
          
          {/* Hours */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Horário de Funcionamento</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Clock className="h-5 w-5 mr-2 flex-shrink-0 text-cantinho-terracotta" />
                <div>
                  <p className="text-gray-300">Segunda - Sexta</p>
                  <p className="text-gray-300">8:00 - 22:00</p>
                </div>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 mr-2 flex-shrink-0 text-cantinho-terracotta" />
                <div>
                  <p className="text-gray-300">Sábado - Domingo</p>
                  <p className="text-gray-300">10:00 - 23:00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Cantinho Algarvio. Todos os direitos reservados.
          </p>
          <div>
            <span className="text-gray-400">NIF: 5417453110</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
