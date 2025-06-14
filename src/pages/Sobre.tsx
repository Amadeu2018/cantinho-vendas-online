
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tl from-cantinho-cream via-white to-cantinho-sand">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section aprimorado */}
        <section className="relative bg-gradient-to-br from-cantinho-navy via-cantinho-navy to-cantinho-terracotta text-white py-20 overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg animate-fade-in">Cantinho Algarvio</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
              Mais de <span className="text-cantinho-sand font-semibold">8 anos</span> oferecendo sabor, tradição e excelência em alimentação e catering em Angola!
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
              <Badge className="bg-cantinho-sand text-cantinho-navy px-4 py-2 text-sm flex items-center gap-1 animate-scale-in">
                <Calendar className="w-4 h-4 mr-1" />
                Desde 2014
              </Badge>
              <Badge className="bg-cantinho-sand text-cantinho-navy px-4 py-2 text-sm flex items-center gap-1 animate-scale-in">
                <Award className="w-4 h-4 mr-1" />
                HACCP Certificado
              </Badge>
              <Badge className="bg-cantinho-sand text-cantinho-navy px-4 py-2 text-sm flex items-center gap-1 animate-scale-in">
                <Utensils className="w-4 h-4 mr-1" />
                Culinária Nacional e Internacional
              </Badge>
            </div>
          </div>
          {/* Sutil efeito de background */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-cantinho-terracotta/5 via-transparent to-cantinho-navy/20 pointer-events-none z-0" />
        </section>

        {/* Company Info */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-cantinho-navy mb-6 animate-fade-in">Nossa História</h2>
              <p className="text-gray-700 mb-4 leading-relaxed animate-fade-in">
                A <span className="text-cantinho-terracotta font-semibold">Cantinho Algarvio, LDA</span> consolidou-se como referência na prestação de serviços de alimentação em Angola. Nosso core é gestão de cozinha, restauração, hotelaria e catering, sempre com um toque de inovação.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed animate-fade-in">
                Dispomos de equipamentos modernos e equipe experiente, incluindo alguns dos melhores chefs de Angola, mesclando o melhor da culinária nacional e internacional.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                <div className="flex items-center space-x-3">
                  <MapPin className="text-cantinho-terracotta w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-cantinho-navy">Sede</p>
                    <p className="text-sm text-gray-600">Luanda, Praia do Bispo</p>
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
            <div className="relative animate-scale-in">
              <img
                src="https://images.unsplash.com/photo-1721322800607-8c38375eef04"
                alt="Interior do restaurante"
                className="rounded-xl shadow-2xl w-full h-80 object-cover border-4 border-cantinho-terracotta/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cantinho-navy/20 to-transparent rounded-xl pointer-events-none"></div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 bg-cantinho-cream/60">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-cantinho-navy mb-12 animate-fade-in">Nossos Serviços</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {["Pequeno Almoço", "Almoço", "Jantar"].map((title, i) => (
                <Card key={title} className="hover:shadow-lg transition-shadow animate-scale-in">
                  <CardContent className="p-8 text-center flex flex-col items-center">
                    <Utensils className="w-12 h-12 text-cantinho-terracotta mb-5" />
                    <h3 className="text-xl font-semibold text-cantinho-navy mb-3">{title}</h3>
                    <p className="text-gray-600">{i === 0
                      ? "Opções nutritivas, saborosas e frescas logo cedo"
                      : i === 1
                        ? "Pratos tradicionais e contemporâneos para seu almoço"
                        : "Gastronomia única para noites inesquecíveis"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Menu Categories */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-cantinho-navy mb-12 animate-fade-in">Especialidades Culinárias</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {menuCategories.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow animate-fade-in">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-cantinho-navy mb-4 text-center">
                      {category.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((item, itemIndex) => (
                        <Badge
                          key={itemIndex}
                          variant="outline"
                          className="text-xs bg-cantinho-sand border-cantinho-navy/20 hover:bg-cantinho-terracotta/10"
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
        <section className="py-20 bg-cantinho-cream/60">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-cantinho-navy mb-4 animate-fade-in">Pratos de Peixes</h2>
              <p className="text-gray-600 max-w-2xl mx-auto animate-fade-in">
                Especializamo-nos em pratos de peixe fresco, preparados com técnicas tradicionais e ingredientes selecionados.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow animate-scale-in">
                <CardContent className="p-6">
                  <img
                    src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
                    alt="Peixe grelhado"
                    className="w-full h-44 object-cover rounded-xl mb-4"
                  />
                  <h3 className="text-lg font-semibold text-cantinho-navy mb-2">Peixe Grelhado</h3>
                  <p className="text-gray-600 text-sm">Corvina, piazete, garoupa - grelhados na perfeição</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow animate-scale-in">
                <CardContent className="p-6">
                  <img
                    src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
                    alt="Cozido de peixe"
                    className="w-full h-44 object-cover rounded-xl mb-4"
                  />
                  <h3 className="text-lg font-semibold text-cantinho-navy mb-2">Cozido de Peixe</h3>
                  <p className="text-gray-600 text-sm">Filetes de pescadas cozidos com temperos especiais</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Clients */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-cantinho-navy mb-12 animate-fade-in">Nossos Clientes</h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-12">
              <div className="text-center animate-scale-in">
                <div className="bg-cantinho-cream p-6 rounded-xl shadow mb-4 flex items-center justify-center">
                  <div className="w-24 h-24 bg-cantinho-sand rounded-lg flex items-center justify-center mx-auto text-2xl text-cantinho-navy font-bold">ETAL</div>
                </div>
                <p className="text-gray-700 font-medium">ETAL</p>
              </div>
              <div className="text-center animate-scale-in">
                <div className="bg-cantinho-cream p-6 rounded-xl shadow mb-4 flex items-center justify-center">
                  <div className="w-24 h-24 bg-cantinho-sand rounded-lg flex items-center justify-center mx-auto text-xl text-cantinho-navy font-bold">SPIC</div>
                </div>
                <p className="text-gray-700 font-medium">SPIC Oil & Gas Angola</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
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
      </main>

      <Footer />
    </div>
  );
};

export default Sobre;

