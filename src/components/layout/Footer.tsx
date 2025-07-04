import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, MapPin, Clock, Award, Heart } from 'lucide-react';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-gradient-to-b from-cantinho-navy to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info - Enhanced */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-cantinho-terracotta to-cantinho-sand p-3 rounded-full mr-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Cantinho Algarvio</h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
              Trazendo os sabores autênticos da culinária portuguesa e angolana para a sua casa há mais de 8 anos. 
              Uma experiência gastronômica única que conecta tradição e qualidade.
            </p>
            
            {/* Company Details */}
            <div className="bg-white/5 rounded-2xl p-6 mb-6">
              <div className="flex items-center mb-3">
                <Award className="h-5 w-5 text-cantinho-sand mr-3" />
                <span className="text-sm text-gray-300">NIF: 5417453110</span>
              </div>
              <div className="flex items-center mb-3">
                <Clock className="h-5 w-5 text-cantinho-sand mr-3" />
                <span className="text-sm text-gray-300">Seg-Dom: 10:00 - 22:00</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-5 w-5 text-cantinho-sand mr-3" />
                <span className="text-sm text-gray-300">Mais de 8 anos servindo qualidade</span>
              </div>
            </div>

            {/* Social Media - Enhanced */}
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-cantinho-terracotta p-3 rounded-full transition-all duration-300 hover:scale-110 group">
                <Facebook className="h-5 w-5 group-hover:text-white" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 p-3 rounded-full transition-all duration-300 hover:scale-110 group">
                <Instagram className="h-5 w-5 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links - Enhanced */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-cantinho-sand">Links Rápidos</h3>
            <ul className="space-y-4">
              {[{
              to: "/menu",
              label: "Menu Completo"
            }, {
              to: "/eventos",
              label: "Catering & Eventos"
            }, {
              to: "/sobre",
              label: "Nossa História"
            }, {
              to: "/contacto",
              label: "Fale Conosco"
            }, {
              to: "/carrinho",
              label: "Meu Carrinho"
            }].map(link => <li key={link.to}>
                  <Link to={link.to} className="text-gray-300 hover:text-cantinho-sand transition-all duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-cantinho-terracotta rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.label}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Contact Info - Enhanced */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-cantinho-sand">Contacto</h3>
            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors duration-300">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-cantinho-terracotta mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-white mb-1">Localização</p>
                    <p className="text-gray-300 text-sm">Rua Dr. António Agostinho Neto, s/nº</p>
                    <p className="text-gray-300 text-sm">Luanda, Bairro da Praia do Bispo</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors duration-300">
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-cantinho-terracotta mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-white mb-1">Telefones</p>
                    <p className="text-gray-300 text-sm">924 678 544</p>
                    <p className="text-gray-300 text-sm">939 423 110</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors duration-300">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-cantinho-terracotta mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-white mb-1">Email</p>
                    <p className="text-gray-300 text-sm">info@cantinhoalgarvio.ao</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Enhanced */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-cantinho-terracotta to-cantinho-sand p-2 rounded-lg mr-3">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm text-gray-300">
                &copy; {currentYear} Cantinho Algarvio, LDA. Todos os direitos reservados.
              </p>
            </div>
            <div className="flex items-center space-x-6 text-xs text-gray-400">
              <span>Feito com ❤️ em Angola</span>
              <span>•</span>
              <span>Qualidade Garantida</span>
              <span>•</span>
              <span>Entrega Segura</span>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;