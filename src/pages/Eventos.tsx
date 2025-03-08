
import { CalendarHeart, Cake, ChefHat, PartyPopper, Utensils, Users, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EventForm from "@/components/eventos/EventForm";

const Eventos = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section */}
        <div className="bg-cantinho-navy text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Eventos & Catering</h1>
            <p className="text-lg max-w-2xl mx-auto">
              Transforme seu evento em uma experiência culinária inesquecível com nosso serviço de catering personalizado.
            </p>
            <Button 
              className="mt-6 bg-cantinho-terracotta hover:bg-cantinho-terracotta/90" 
              size="lg"
              onClick={() => document.getElementById('solicitar-evento')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Solicitar Orçamento
            </Button>
          </div>
        </div>

        {/* Services section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-3">Nossos Serviços de Catering</h2>
            <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
              Oferecemos soluções gastronômicas completas para todos os tipos de eventos, com menus personalizados e serviço de excelência.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="transition-transform hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-cantinho-terracotta/10 rounded-full">
                    <PartyPopper className="h-8 w-8 text-cantinho-terracotta" />
                  </div>
                  <CardTitle>Eventos Corporativos</CardTitle>
                  <CardDescription>Reuniões, conferências e eventos empresariais</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Menus executivos e coffee breaks personalizados que impressionam seus clientes e colaboradores.</p>
                </CardContent>
              </Card>
              
              <Card className="transition-transform hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-cantinho-terracotta/10 rounded-full">
                    <Cake className="h-8 w-8 text-cantinho-terracotta" />
                  </div>
                  <CardTitle>Casamentos & Cerimônias</CardTitle>
                  <CardDescription>Momentos especiais merecem sabores inesquecíveis</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Desde o coquetel até o jantar principal, cuidamos de cada detalhe para tornar seu dia ainda mais perfeito.</p>
                </CardContent>
              </Card>
              
              <Card className="transition-transform hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-cantinho-terracotta/10 rounded-full">
                    <CalendarHeart className="h-8 w-8 text-cantinho-terracotta" />
                  </div>
                  <CardTitle>Festas & Aniversários</CardTitle>
                  <CardDescription>Celebrações privadas com atendimento exclusivo</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Buffets temáticos e menus personalizados para celebrar datas especiais com amigos e família.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* How it works section */}
        <div className="py-16 bg-cantinho-cream">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-3">Como Funciona</h2>
            <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
              Veja como é simples contratar nosso serviço de catering para o seu próximo evento
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center">
                <div className="mb-4 p-4 bg-white rounded-full shadow-md">
                  <Users className="h-8 w-8 text-cantinho-terracotta" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Consulta Inicial</h3>
                <p className="text-center">Entendemos suas necessidades e número de convidados.</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="mb-4 p-4 bg-white rounded-full shadow-md">
                  <ChefHat className="h-8 w-8 text-cantinho-terracotta" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Proposta de Menu</h3>
                <p className="text-center">Criamos um menu personalizado para satisfazer suas preferências.</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="mb-4 p-4 bg-white rounded-full shadow-md">
                  <CheckCircle2 className="h-8 w-8 text-cantinho-terracotta" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Confirmação</h3>
                <p className="text-center">Após aprovação, finalizamos todos os detalhes logísticos.</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="mb-4 p-4 bg-white rounded-full shadow-md">
                  <Utensils className="h-8 w-8 text-cantinho-terracotta" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Seu Evento</h3>
                <p className="text-center">Nossa equipe cuida de tudo para que você aproveite seu evento.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Options and Packages */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-3">Pacotes de Catering</h2>
            <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
              Escolha a opção que melhor se adapta às necessidades do seu evento
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-2 border-muted transition-all hover:border-cantinho-terracotta/50">
                <CardHeader>
                  <CardTitle className="text-center">Pacote Essencial</CardTitle>
                  <CardDescription className="text-center text-xl font-bold mt-2">A partir de 25.000 Kz por pessoa</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-cantinho-terracotta flex-shrink-0 mt-0.5" />
                      <span>Menu de entrada, prato principal e sobremesa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-cantinho-terracotta flex-shrink-0 mt-0.5" />
                      <span>Águas e refrigerantes incluídos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-cantinho-terracotta flex-shrink-0 mt-0.5" />
                      <span>Equipe de serviço básica</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-cantinho-terracotta flex-shrink-0 mt-0.5" />
                      <span>Material de serviço padrão</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-cantinho-navy hover:bg-cantinho-navy/90" onClick={() => document.getElementById('solicitar-evento')?.scrollIntoView({ behavior: 'smooth' })}>
                    Solicitar Orçamento
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-cantinho-terracotta relative shadow-lg">
                <div className="absolute top-0 right-0 bg-cantinho-terracotta text-white px-4 py-1 text-xs font-bold uppercase rounded-bl-lg">
                  Mais Popular
                </div>
                <CardHeader>
                  <CardTitle className="text-center">Pacote Premium</CardTitle>
                  <CardDescription className="text-center text-xl font-bold mt-2">A partir de 35.000 Kz por pessoa</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-cantinho-terracotta flex-shrink-0 mt-0.5" />
                      <span>Menu gourmet de 4 tempos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-cantinho-terracotta flex-shrink-0 mt-0.5" />
                      <span>Open bar de bebidas não alcoólicas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-cantinho-terracotta flex-shrink-0 mt-0.5" />
                      <span>Equipe completa de serviço</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-cantinho-terracotta flex-shrink-0 mt-0.5" />
                      <span>Material de serviço premium</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-cantinho-terracotta flex-shrink-0 mt-0.5" />
                      <span>Mesa de sobremesas especiais</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-cantinho-terracotta hover:bg-cantinho-terracotta/90" onClick={() => document.getElementById('solicitar-evento')?.scrollIntoView({ behavior: 'smooth' })}>
                    Solicitar Orçamento
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-muted transition-all hover:border-cantinho-terracotta/50">
                <CardHeader>
                  <CardTitle className="text-center">Pacote Exclusivo</CardTitle>
                  <CardDescription className="text-center text-xl font-bold mt-2">A partir de 50.000 Kz por pessoa</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-cantinho-terracotta flex-shrink-0 mt-0.5" />
                      <span>Menu degustação de luxo personalizado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-cantinho-terracotta flex-shrink-0 mt-0.5" />
                      <span>Open bar completo de bebidas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-cantinho-terracotta flex-shrink-0 mt-0.5" />
                      <span>Estações gastronômicas ao vivo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-cantinho-terracotta flex-shrink-0 mt-0.5" />
                      <span>Decoração de mesas temática</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-cantinho-terracotta flex-shrink-0 mt-0.5" />
                      <span>Consultoria de evento completa</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-cantinho-navy hover:bg-cantinho-navy/90" onClick={() => document.getElementById('solicitar-evento')?.scrollIntoView({ behavior: 'smooth' })}>
                    Solicitar Orçamento
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Booking form section */}
        <div id="solicitar-evento" className="py-16 bg-cantinho-cream scroll-mt-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-3">Solicite um Orçamento</h2>
            <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
              Preencha o formulário abaixo e entraremos em contato para discutir os detalhes do seu evento
            </p>
            
            <div className="max-w-3xl mx-auto">
              <EventForm />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-3">Perguntas Frequentes</h2>
            <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
              Respostas para as dúvidas mais comuns sobre nossos serviços de catering
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">Com quanto tempo de antecedência devo reservar?</h3>
                  <p className="text-muted-foreground">Recomendamos reservar com pelo menos 3-4 semanas de antecedência para eventos menores e 2-3 meses para eventos maiores como casamentos.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">Vocês atendem a restrições alimentares?</h3>
                  <p className="text-muted-foreground">Sim, podemos adaptar nossos menus para atender a restrições alimentares, alergias e preferências dietéticas específicas.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">Qual é o número mínimo de convidados?</h3>
                  <p className="text-muted-foreground">Nosso serviço de catering atende eventos a partir de 20 pessoas, mas temos flexibilidade para discutir suas necessidades específicas.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">Vocês fornecem equipamentos e decoração?</h3>
                  <p className="text-muted-foreground">Sim, oferecemos serviços de montagem de mesas, incluindo louças, talheres e decoração básica, com opções adicionais disponíveis.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Eventos;
