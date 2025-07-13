import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Award,
  Utensils,
  MapPin,
  Users,
  Star,
  Trophy,
  ChefHat,
  Fish,
  Handshake,
  Building2,
  Phone,
  Mail,
} from "lucide-react";
import { HeroParallax } from "@aceternity/ui/hero-parallax";
import { CardHoverEffect } from "@aceternity/ui/card-hover-effect";
import { Timeline } from "@aceternity/ui/timeline";
import { BackgroundGradient } from "@aceternity/ui/background-gradient";
import { TextGenerateEffect } from "@aceternity/ui/text-generate-effect";
import { FloatingNav } from "@aceternity/ui/floating-navbar";
import { Spotlight } from "@aceternity/ui/spotlight";
import { WobbleCard } from "@aceternity/ui/wobble-card";
import { BentoGrid, BentoGridItem } from "@aceternity/ui/bento-grid";

const Sobre = () => {
  const companyStats = [
    { label: "Anos de Experiência", value: "8+" },
    { label: "Clientes Satisfeitos", value: "100+" },
    { label: "Pratos Servidos", value: "10K+" },
    { label: "Eventos Realizados", value: "500+" },
  ];

  const services = [
    {
      icon: <Utensils className="w-8 h-8" />,
      title: "Pequeno Almoço",
      description: "Opções nutritivas, saborosas e frescas logo cedo",
    },
    {
      icon: <ChefHat className="w-8 h-8" />,
      title: "Almoço",
      description: "Pratos tradicionais e contemporâneos para seu almoço",
    },
    {
      icon: <Fish className="w-8 h-8" />,
      title: "Jantar",
      description: "Gastronomia única para noites inesquecíveis",
    },
  ];

  const timelineEvents = [
    {
      year: "2014",
      title: "Fundação da Empresa",
      description: "Início das atividades com foco em qualidade e tradição",
    },
    {
      year: "2016",
      title: "Certificação HACCP",
      description: "Obtenção da certificação de segurança alimentar",
    },
    {
      year: "2018",
      title: "Expansão de Serviços",
      description: "Ampliação para catering corporativo e eventos",
    },
    {
      year: "2022",
      title: "Liderança no Mercado",
      description: "Consolidação como referência em Angola",
    },
  ];

  const testimonials = [
    {
      name: "ETAL",
      role: "Parceiro Estratégico",
      content:
        "Parceria estratégica em alimentação corporativa com excelência comprovada.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=etal",
    },
    {
      name: "SPIC Oil & Gas Angola",
      role: "Cliente Corporativo",
      content:
        "Serviços de catering especializado para indústria petrolífera com qualidade superior.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=spic",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow pt-16 sm:pt-20">
        {/* Hero Section with Spotlight */}
        <section className="relative min-h-[600px] flex items-center justify-center text-white overflow-hidden">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=1200&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <TextGenerateEffect
              words="Cantinho Algarvio"
              className="text-5xl md:text-6xl font-bold mb-6 text-white"
            />
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Mais de 8 anos oferecendo sabor, tradição e excelência em
              alimentação e catering em Angola!
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <BackgroundGradient className="rounded-[22px] p-1 bg-white dark:bg-zinc-900">
                <Badge
                  variant="secondary"
                  className="bg-cantinho-sand text-cantinho-navy px-6 py-3 text-lg flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Desde 2014
                </Badge>
              </BackgroundGradient>
              <BackgroundGradient className="rounded-[22px] p-1 bg-white dark:bg-zinc-900">
                <Badge
                  variant="secondary"
                  className="bg-cantinho-sand text-cantinho-navy px-6 py-3 text-lg flex items-center gap-2"
                >
                  <Award className="w-5 h-5" />
                  HACCP Certificado
                </Badge>
              </BackgroundGradient>
              <BackgroundGradient className="rounded-[22px] p-1 bg-white dark:bg-zinc-900">
                <Badge
                  variant="secondary"
                  className="bg-cantinho-sand text-cantinho-navy px-6 py-3 text-lg flex items-center gap-2"
                >
                  <Utensils className="w-5 h-5" />
                  Culinária Nacional e Internacional
                </Badge>
              </BackgroundGradient>
            </div>
          </div>
        </section>

        {/* Company Stats with Wobble Cards */}
        <section className="py-20 bg-cantinho-cream/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <TextGenerateEffect
                words="Nossa Trajetória em Números"
                className="text-4xl font-bold text-cantinho-navy mb-4"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {companyStats.map((stat, index) => (
                <WobbleCard
                  key={index}
                  containerClassName="col-span-1 h-full bg-cantinho-cream min-h-[200px] lg:min-h-[250px]"
                  className=""
                >
                  <div className="max-w-xs">
                    <div className="text-3xl font-bold text-cantinho-terracotta mb-2">
                      {stat.value}
                    </div>
                    <div className="text-cantinho-navy font-medium">
                      {stat.label}
                    </div>
                  </div>
                </WobbleCard>
              ))}
            </div>
          </div>
        </section>

        {/* Company History with Timeline */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-cantinho-navy">
                  Nossa História
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  A{" "}
                  <span className="text-cantinho-terracotta font-semibold">
                    Cantinho Algarvio, LDA
                  </span>{" "}
                  consolidou-se como referência na prestação de serviços de
                  alimentação em Angola. Nosso core é gestão de cozinha,
                  restauração, hotelaria e catering, sempre com um toque de
                  inovação.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Dispomos de equipamentos modernos e equipe experiente,
                  incluindo alguns dos melhores chefs de Angola, mesclando o
                  melhor da culinária nacional e internacional.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="p-4 bg-cantinho-cream/30">
                    <div className="flex items-center space-x-3">
                      <MapPin className="text-cantinho-terracotta w-6 h-6" />
                      <div>
                        <p className="font-semibold text-cantinho-navy">Sede</p>
                        <p className="text-gray-600 text-sm">
                          Luanda, Praia do Bispo
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-cantinho-cream/30">
                    <div className="flex items-center space-x-3">
                      <Users className="text-cantinho-terracotta w-6 h-6" />
                      <div>
                        <p className="font-semibold text-cantinho-navy">NIF</p>
                        <p className="text-gray-600 text-sm">5417453110</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&q=80"
                  alt="Pratos especiais da casa"
                  className="rounded-xl shadow-lg w-full h-80 object-cover"
                />
              </div>
            </div>

            {/* Timeline with Aceternity */}
            <div className="mt-16">
              <TextGenerateEffect
                words="Marcos da Nossa Jornada"
                className="text-3xl font-bold text-center text-cantinho-navy mb-12"
              />
              <Timeline
                data={timelineEvents.map((event) => ({
                  title: event.year,
                  content: (
                    <div>
                      <h4 className="text-xl font-bold text-cantinho-navy mb-2">
                        {event.title}
                      </h4>
                      <p className="text-gray-600">{event.description}</p>
                    </div>
                  ),
                }))}
              />
            </div>
          </div>
        </section>

        {/* Services Section with Card Hover Effect */}
        <section className="py-20 bg-cantinho-cream/40">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <TextGenerateEffect
                words="Nossos Serviços"
                className="text-4xl font-bold text-cantinho-navy mb-4"
              />
              <p className="text-gray-600 text-lg">
                Oferecemos uma gama completa de serviços gastronômicos
              </p>
            </div>
            <CardHoverEffect
              items={services.map((service, index) => ({
                title: service.title,
                description: service.description,
                link: "#",
                icon: service.icon,
              }))}
            />
          </div>
        </section>

        {/* Menu Categories with Bento Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <TextGenerateEffect
              words="Especialidades Culinárias"
              className="text-4xl font-bold text-center text-cantinho-navy mb-12"
            />
            <BentoGrid className="max-w-4xl mx-auto">
              <BentoGridItem
                title="Pratos de Carnes"
                description="Especialidades em carnes selecionadas"
                header={
                  <div className="flex min-h-[6rem] w-full rounded-xl bg-gradient-to-br from-cantinho-terracotta to-cantinho-navy"></div>
                }
                className="md:col-span-2"
              >
                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    "Bife de cogumelos",
                    "Peito de frango grelhado",
                    "Estrogonofe",
                    "Caldeirada de cabrito",
                    "Jardineira de frango",
                    "Funge de carne seca",
                    "Bifana",
                    "Pernil no forno",
                    "Feijoada transmontana",
                  ].map((item, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs bg-cantinho-sand/50"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </BentoGridItem>
              <BentoGridItem
                title="Guarnições"
                description="Acompanhamentos tradicionais"
                header={
                  <div className="flex min-h-[6rem] w-full rounded-xl bg-gradient-to-br from-cantinho-sand to-cantinho-cream"></div>
                }
                className="md:col-span-1"
              >
                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    "Batata frita",
                    "Batata cozida",
                    "Batata doce",
                    "Arroz branco",
                    "Arroz de legumes",
                    "Salada mista",
                    "Esparguete aldente",
                    "Kisaca",
                    "Feijão e legumes salteados",
                  ].map((item, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs bg-cantinho-sand/50"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </BentoGridItem>
              <BentoGridItem
                title="Molhos"
                description="Sabores especiais da casa"
                header={
                  <div className="flex min-h-[6rem] w-full rounded-xl bg-gradient-to-br from-cantinho-navy to-cantinho-cornflower"></div>
                }
                className="md:col-span-1"
              >
                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    "Molho de vinagrete",
                    "Vinagrete lima",
                    "Molho de mostarda",
                    "Maionese",
                    "Ketchup",
                    "Molho de ervas",
                    "Molho tártaro",
                  ].map((item, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs bg-cantinho-sand/50"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </BentoGridItem>
            </BentoGrid>
          </div>
        </section>

        {/* Fish Specialties with Background Gradient */}
        <section className="py-20 bg-gradient-to-br from-cantinho-cream/40 to-cantinho-sand/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <BackgroundGradient className="rounded-full p-1">
                  <div className="bg-cantinho-terracotta/10 p-4 rounded-full">
                    <Fish className="w-8 h-8 text-cantinho-terracotta" />
                  </div>
                </BackgroundGradient>
              </div>
              <TextGenerateEffect
                words="Pratos de Peixes"
                className="text-4xl font-bold text-cantinho-navy mb-4"
              />
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Especializamo-nos em pratos de peixe fresco, preparados com
                técnicas tradicionais e ingredientes selecionados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BackgroundGradient className="rounded-[22px] p-4 sm:p-10 bg-white dark:bg-zinc-900">
                <img
                  src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&q=80"
                  alt="Peixe Grelhado"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <Badge className="bg-cantinho-terracotta text-white mb-3">
                  Especialidade da Casa
                </Badge>
                <h3 className="text-xl font-bold text-cantinho-navy mb-2">
                  Peixe Grelhado
                </h3>
                <p className="text-gray-600">
                  Corvina, piazete, garoupa - grelhados na perfeição com
                  temperos especiais da casa
                </p>
              </BackgroundGradient>

              <BackgroundGradient className="rounded-[22px] p-4 sm:p-10 bg-white dark:bg-zinc-900">
                <img
                  src="https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&q=80"
                  alt="Cozido de Peixe"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <Badge className="bg-cantinho-terracotta text-white mb-3">
                  Receita Tradicional
                </Badge>
                <h3 className="text-xl font-bold text-cantinho-navy mb-2">
                  Cozido de Peixe
                </h3>
                <p className="text-gray-600">
                  Filetes de pescadas cozidos com temperos especiais e
                  acompanhamentos tradicionais
                </p>
              </BackgroundGradient>
            </div>
          </div>
        </section>

        {/* Testimonials/Clients with Wobble Cards */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <TextGenerateEffect
                words="Nossos Clientes"
                className="text-4xl font-bold text-cantinho-navy mb-4"
              />
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Orgulhamo-nos de servir empresas líderes em Angola, construindo
                parcerias duradouras baseadas na confiança e excelência.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <WobbleCard
                  key={index}
                  containerClassName="col-span-1 h-full bg-cantinho-cream min-h-[300px]"
                  className=""
                >
                  <div className="max-w-sm">
                    <div className="flex items-start space-x-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-grow">
                        <h4 className="font-bold text-cantinho-navy">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-cantinho-terracotta mb-3">
                          {testimonial.role}
                        </p>
                        <p className="text-gray-600">{testimonial.content}</p>
                      </div>
                    </div>
                  </div>
                </WobbleCard>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section
          className="relative py-20 text-white"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=1200&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Pronto para uma Experiência Gastronómica Única?
            </h2>
            <p className="text-xl mb-8 text-gray-200">
              Entre em contacto connosco e descubra como podemos tornar o seu
              evento inesquecível.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-8">
              <Button
                variant="secondary"
                size="lg"
                className="bg-cantinho-sand text-cantinho-navy hover:bg-cantinho-sand/90"
              >
                <Phone className="w-5 h-5 mr-2" />
                924 678 544 / 934 625 513
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="bg-cantinho-sand text-cantinho-navy hover:bg-cantinho-sand/90"
              >
                <Mail className="w-5 h-5 mr-2" />
                info@cantinhoalgarvio.ao
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Sobre;
