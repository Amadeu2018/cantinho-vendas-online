
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Building2, 
  Clock, 
  Users, 
  Award, 
  Phone, 
  Mail, 
  MapPin,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Sobre = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3 text-cantinho-navy">Sobre Nós</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Conheça a história, missão e valores do Cantinho Algarvio, uma empresa de referência no setor de restauração em Angola.
            </p>
          </div>

          {/* Company Introduction */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 items-center">
            <div>
              <h2 className="text-2xl font-bold text-cantinho-terracotta mb-4">Quem Somos</h2>
              <p className="text-gray-700 mb-4">
                CANTINHO ALGARVIO, LDA., empresa de direito Angolano, com o NIF: 5417453110,
                Restaurante sede em Luanda, município de Luanda, Bairro da Praia do Bispo, Rua Drº
                Antônio Agostinho Neto, s/nº.
              </p>
              <p className="text-gray-700 mb-4">
                Temos uma Cozinha de serviço Nacional e Internacional (Praia do Bispo, frente ao
                Memorial Dr António Agostinho Neto), bem como um (1) Restaurante no Aeroporto
                Internacional de Luanda, 4 de fevereiro.
              </p>
              <p className="text-gray-700">
                Nossa principal atividade consiste em: Gestão de Cozinha, Prestação de Serviço no
                ramo Hoteleiro, Restauração, Catering e Buffet, com equipamentos modernos e
                pessoal competente, temos também um dos melhores chefes de cozinha de Angola e
                com bastante experiências de cozinha nacional e internacional.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <AspectRatio ratio={16/9}>
                <img 
                  src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf" 
                  alt="Restaurante Cantinho Algarvio" 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
          </div>

          {/* Experience and Quality */}
          <div className="bg-cantinho-cream rounded-2xl p-8 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-cantinho-navy">Nossa Experiência e Qualidade</h2>
              <p className="text-gray-600 mt-2">
                Compromisso com a excelência em todos os nossos serviços
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border-none shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Calendar className="h-8 w-8 text-cantinho-terracotta" />
                  <CardTitle>8+ Anos</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    De experiência no mercado angolano e internacional
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-none shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Users className="h-8 w-8 text-cantinho-terracotta" />
                  <CardTitle>Equipe Qualificada</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Profissionais experientes e altamente capacitados
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-none shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Award className="h-8 w-8 text-cantinho-terracotta" />
                  <CardTitle>Certificação</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Cumprimos com requisitos definidos na HACCP e normas internacionais
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-none shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Clock className="h-8 w-8 text-cantinho-terracotta" />
                  <CardTitle>Pontualidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Rigorosidade, segurança e pontualidade no fornecimento das refeições
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Menu Offerings */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-cantinho-navy">Nossa Oferta Gastronômica</h2>
              <p className="text-gray-600 mt-2">
                Variedade de pratos nacionais e internacionais para todos os gostos
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1603105037243-79223baa6c59" 
                    alt="Pratos de Peixe" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-cantinho-navy mb-2">Pratos de Peixes</h3>
                  <p className="text-gray-600">
                    Peixe grelhado (corvina, piazete, garoupa), filetes de pescadas, Cozido de Peixe, choco.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1619221882220-947b3d3c8861" 
                    alt="Pratos de Carne" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-cantinho-navy mb-2">Pratos de Carnes</h3>
                  <p className="text-gray-600">
                    Bife de cogumelos, Peito de frango grelhado, estrogonofe, Caldeirada de cabrito, 
                    Jardineira de frango, funge de carne seca, bifana, e muito mais.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c" 
                    alt="Guarnições" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-cantinho-navy mb-2">Guarnições e Molhos</h3>
                  <p className="text-gray-600">
                    Diversas opções de acompanhamentos como batata frita, arroz, saladas, e variedade de 
                    molhos caseiros para complementar sua refeição.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-cantinho-navy text-white rounded-2xl p-8 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Entre em Contacto</h2>
              <p className="text-gray-200 mt-2">
                Estamos disponíveis para atender às suas necessidades
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-white/10 p-3 rounded-full mb-4">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Telefone</h3>
                <p className="text-gray-200">+244 924 678 544</p>
                <p className="text-gray-200">+244 934 625 513</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-white/10 p-3 rounded-full mb-4">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-gray-200">cantinhoalgarvio@gmail.com</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-white/10 p-3 rounded-full mb-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Localização</h3>
                <p className="text-gray-200">Bairro da Praia do Bispo, Rua Drº António Agostinho Neto, s/nº, Luanda</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sobre;
