
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cantinho-navy text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Cantinho Algarvio, LDA.</h3>
            <p className="mb-4">Trazendo os sabores autênticos da culinária portuguesa e angolana para a sua casa há mais de 8 anos.</p>
            <p className="text-sm text-gray-300 mb-4">NIF: 5417453110</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-cantinho-sand transition duration-200">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-cantinho-sand transition duration-200">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/menu" className="hover:text-cantinho-sand transition duration-200">Menu</Link>
              </li>
              <li>
                <Link to="/eventos" className="hover:text-cantinho-sand transition duration-200">Serviços de Catering</Link>
              </li>
              <li>
                <Link to="/sobre" className="hover:text-cantinho-sand transition duration-200">Sobre Nós</Link>
              </li>
              <li>
                <Link to="/contacto" className="hover:text-cantinho-sand transition duration-200">Contacto</Link>
              </li>
              <li>
                <Link to="/carrinho" className="hover:text-cantinho-sand transition duration-200">Carrinho</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={20} className="mt-1 flex-shrink-0" />
                <div>
                  <p>Rua Dr. António Agostinho Neto, s/nº</p>
                  <p>Luanda, Bairro da Praia do Bispo</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} />
                <div>
                  <p>924 678 544</p>
                  <p>934 625 513</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={20} />
                <p>info@cantinhoalgarvio.ao</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; {currentYear} Cantinho Algarvio, LDA. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
