
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Calendar, Award, Users, Utensils } from 'lucide-react';

const Sobre = () => {
  const menuCategories = [
    {
      title: "Pratos de Carnes",
      items: [
        "Bife de cogumelos", "Peito de frango grelhado", "Estrogonofe", 
        "Caldeirada de cabrito", "Jardineira de frango", "Funge de carne seca",
        "Bifana", "Pernil no forno e grelhada mista", "Feijoada transmontana",
        "Cozido à Portuguesa", "Entremeadas grelhadas", "Carne de porco à portuguesa"
      ]
    },
    {
      title: "Guarnições",
      items: [
        "Batata frita", "Batata cozida", "Batata doce", "Batata corada",
        "Abóbora grelhada", "Arroz branco", "Arroz de legumes", "Arroz de cenoura",
        "Arroz de ervilha", "Arroz Xau Xau", "Salada mista", "Esparguete aldente",
        "Kisaca", "Feijão e legumes salteados"
      ]
    },
    {
      title: "Molhos",
      items: [
        "Molho de vinagrete", "Vinagrete lima", "Molho de mostarda",
        "Maionese", "Ketchup", "Molho de ervas", "Molho tártaro",
        "Azeite", "Vinagre de maçã"
      ]
    }
  ];

  const clients = [
    { name: "ETAL", logo: "/lovable-uploads/759296df-98ef-4d40-92a3-2aec40e351b7.png" },
    { name: "SPIC Oil & Gas Angola", logo: "/lovable-uploads/759296df-98ef-4d40-92a3-2aec40e351b7.png" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-cantinho-navy via-cantinho-navy to-cantinho-terracotta text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Cantinho Algarvio</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Com mais de 8 anos de experiência, somos uma empresa angolana especializada em 
              gestão de cozinha e prestação de serviços de alimentação de alta qualidade.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-cantinho-sand text-cantinho-navy px-4 py-2 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                Desde 2014
              </Badge>
              <Badge className="bg-cantinho-sand text-cantinho-navy px-4 py-2 text-sm">
                <Award className="w-4 h-4 mr-2" />
                HACCP Certificado
              </Badge>
              <Badge className="bg-cantinho-sand text-cantinho-navy px-4 py-2 text-sm">
                <Utensils className="w-4 h-4 mr-2" />
                Culinária Nacional e Internacional
              </Badge>
            </div>
          </div>
        </section>

        {/* Company Info */}
        <section className="py-16 bg-cantinho-cream">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-cantinho-navy mb-6">Nossa História</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  A Cantinho Algarvio, LDA. é uma empresa de direito angolano que se estabeleceu 
                  como referência na prestação de serviços de alimentação em Angola. Nossa principal 
                  atividade consiste em gestão de cozinha, prestação de serviço no ramo hoteleiro, 
                  restauração e catering.
                </p>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Com equipamentos modernos e pessoal competente, contamos também com alguns dos 
                  melhores chefs de cozinha de Angola e com bastante experiência de cozinha nacional 
                  e internacional.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-cantinho-terracotta w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-cantinho-navy">Sede</p>
                      <p className="text-sm text-gray-600">Luanda, Bairro da Praia do Bispo</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="text-cantinho-terracotta w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-cantinho-navy">NIF</p>
                      <p className="text-sm text-gray-600">5417453110</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1721322800607-8c38375eef04"
                  alt="Interior do restaurante" 
                  className="rounded-lg shadow-2xl w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cantinho-navy/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-cantinho-navy mb-12">Nossos Serviços</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Utensils className="w-12 h-12 text-cantinho-terracotta mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-cantinho-navy mb-3">Pequeno Almoço</h3>
                  <p className="text-gray-600">Começe o dia com opções nutritivas e saborosas</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Utensils className="w-12 h-12 text-cantinho-terracotta mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-cantinho-navy mb-3">Almoço</h3>
                  <p className="text-gray-600">Pratos tradicionais e contemporâneos para o seu almoço</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Utensils className="w-12 h-12 text-cantinho-terracotta mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-cantinho-navy mb-3">Jantar</h3>
                  <p className="text-gray-600">Experiências gastronómicas únicas para as suas noites</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Menu Categories */}
        <section className="py-16 bg-cantinho-cream">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-cantinho-navy mb-12">Nossa Especialidade Culinária</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {menuCategories.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-cantinho-navy mb-4 text-center">
                      {category.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((item, itemIndex) => (
                        <Badge 
                          key={itemIndex} 
                          variant="outline" 
                          className="text-xs bg-white border-cantinho-sand hover:bg-cantinho-sand"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Fish Specialties */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-cantinho-navy mb-4">Pratos de Peixes</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Especializamo-nos em pratos de peixe fresco, preparados com técnicas tradicionais
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <img 
                    src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
                    alt="Peixe grelhado" 
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-semibold text-cantinho-navy mb-2">Peixe Grelhado</h3>
                  <p className="text-gray-600 text-sm">Corvina, piazete, garoupa - grelhados na perfeição</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <img 
                    src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
                    alt="Cozido de peixe" 
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-semibold text-cantinho-navy mb-2">Cozido de Peixe</h3>
                  <p className="text-gray-600 text-sm">Filetes de pescadas cozidos com temperos especiais</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Clients */}
        <section className="py-16 bg-cantinho-cream">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-cantinho-navy mb-12">Alguns dos Nossos Clientes</h2>
            <div className="flex justify-center items-center space-x-12">
              <div className="text-center">
                <div className="bg-white p-6 rounded-lg shadow-md mb-4">
                  <div className="w-24 h-24 bg-cantinho-sand rounded-lg flex items-center justify-center mx-auto">
                    <span className="text-cantinho-navy font-bold text-lg">ETAL</span>
                  </div>
                </div>
                <p className="text-gray-600 font-medium">ETAL</p>
              </div>
              <div className="text-center">
                <div className="bg-white p-6 rounded-lg shadow-md mb-4">
                  <div className="w-24 h-24 bg-cantinho-sand rounded-lg flex items-center justify-center mx-auto">
                    <span className="text-cantinho-navy font-bold text-sm">SPIC</span>
                  </div>
                </div>
                <p className="text-gray-600 font-medium">SPIC Oil & Gas Angola</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-cantinho-navy text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Pronto para uma Experiência Gastronómica Única?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Entre em contacto connosco e descubra como podemos tornar o seu evento inesquecível
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>924 678 544 / 934 625 513</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>info@cantinhoalgarvio.ao</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Sobre;
