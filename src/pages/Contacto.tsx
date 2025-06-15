
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Headphones, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Contacto = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulando envio de formulário
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Entraremos em contato o mais breve possível. Obrigado pela sua mensagem!",
      });
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        assunto: "",
        mensagem: "",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 sm:pt-20">
        {/* Enhanced Hero section - Mobile first */}
        <div className="bg-gradient-to-br from-cantinho-navy via-cantinho-terracotta to-cantinho-navy text-white py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-cantinho-sand/10 rounded-full -translate-y-24 sm:-translate-y-48 translate-x-24 sm:translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full translate-y-16 sm:translate-y-32 -translate-x-16 sm:-translate-x-32"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in">
                Fale Connosco
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto animate-fade-in text-white/90 leading-relaxed px-2">
                Estamos aqui para responder às suas perguntas, receber os seus comentários 
                e ajudar a planear o seu próximo evento gastronómico inesquecível.
              </p>
              
              {/* Quick contact stats - Mobile optimized */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 animate-fade-in">
                <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-xl">
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-cantinho-sand" />
                  <div className="text-xl sm:text-2xl font-bold">Menos de 2h</div>
                  <div className="text-sm text-white/80">Tempo de Resposta</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-xl">
                  <Headphones className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-cantinho-sand" />
                  <div className="text-xl sm:text-2xl font-bold">24/7</div>
                  <div className="text-sm text-white/80">Suporte Disponível</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-xl">
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-cantinho-sand" />
                  <div className="text-xl sm:text-2xl font-bold">365</div>
                  <div className="text-sm text-white/80">Dias por Ano</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact information and form - Mobile first layout */}
        <div className="container mx-auto px-4 py-12 sm:py-20">
          <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-5 lg:gap-12">
            {/* Contact information - Mobile first, then desktop left column */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-cantinho-navy mb-6 sm:mb-8 animate-fade-in">
                  Informações de Contacto
                </h2>
                <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg animate-fade-in">
                  Entre em contacto connosco através de qualquer um dos canais abaixo. 
                  Estamos sempre prontos para ajudar!
                </p>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <Card className="hover:shadow-lg transition-shadow duration-300 animate-scale-in">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="bg-cantinho-terracotta/10 p-2 sm:p-3 rounded-full flex-shrink-0">
                        <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-cantinho-terracotta" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-base sm:text-lg mb-2">Telefone & WhatsApp</h3>
                        <div className="space-y-1">
                          <p className="text-gray-700 font-medium text-sm sm:text-base">+244 924 678 544</p>
                          <p className="text-gray-700 font-medium text-sm sm:text-base">+244 934 625 513</p>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 mt-2">
                          Disponível das 8h às 22h, todos os dias
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow duration-300 animate-scale-in">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="bg-cantinho-terracotta/10 p-2 sm:p-3 rounded-full flex-shrink-0">
                        <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-cantinho-terracotta" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-base sm:text-lg mb-2">Email</h3>
                        <p className="text-gray-700 font-medium mb-1 text-sm sm:text-base break-all">
                          info@cantinhoalgarvio.ao
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Resposta em até 2 horas úteis
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow duration-300 animate-scale-in">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="bg-cantinho-terracotta/10 p-2 sm:p-3 rounded-full flex-shrink-0">
                        <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-cantinho-terracotta" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-base sm:text-lg mb-2">Localização</h3>
                        <p className="text-gray-700 mb-1 text-sm sm:text-base">
                          Luanda, Bairro Azul
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Servimos toda Luanda e arredores
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow duration-300 animate-scale-in">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="bg-cantinho-terracotta/10 p-2 sm:p-3 rounded-full flex-shrink-0">
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-cantinho-terracotta" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-base sm:text-lg mb-2">Horário de Funcionamento</h3>
                        <div className="space-y-1 text-gray-700 text-sm sm:text-base">
                          <p><span className="font-medium">Segunda a Sexta:</span> 10:00 - 22:00</p>
                          <p><span className="font-medium">Sábado e Domingo:</span> 11:00 - 23:00</p>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 mt-2">
                          Delivery disponível em todos os horários
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Enhanced Contact form - Mobile first */}
            <div className="lg:col-span-3">
              <Card className="shadow-xl">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-cantinho-navy mb-4 sm:mb-6 animate-fade-in">
                    Envie-nos uma Mensagem
                  </h2>
                  <p className="text-gray-600 mb-6 sm:mb-8 animate-fade-in text-sm sm:text-base">
                    Preencha o formulário abaixo e entraremos em contacto consigo o mais breve possível.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label htmlFor="nome" className="block mb-2 font-semibold text-gray-700 text-sm sm:text-base">
                          Nome Completo *
                        </label>
                        <Input
                          id="nome"
                          name="nome"
                          value={formData.nome}
                          onChange={handleChange}
                          placeholder="O seu nome completo"
                          className="border-2 focus:border-cantinho-terracotta h-12 text-base"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="telefone" className="block mb-2 font-semibold text-gray-700 text-sm sm:text-base">
                          Telefone *
                        </label>
                        <Input
                          id="telefone"
                          name="telefone"
                          value={formData.telefone}
                          onChange={handleChange}
                          placeholder="O seu número de telefone"
                          className="border-2 focus:border-cantinho-terracotta h-12 text-base"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block mb-2 font-semibold text-gray-700 text-sm sm:text-base">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="O seu endereço de email"
                        className="border-2 focus:border-cantinho-terracotta h-12 text-base"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="assunto" className="block mb-2 font-semibold text-gray-700 text-sm sm:text-base">
                        Assunto *
                      </label>
                      <select
                        id="assunto"
                        name="assunto"
                        value={formData.assunto}
                        onChange={handleChange}
                        className="flex h-12 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-cantinho-terracotta focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="" disabled>Selecione o assunto</option>
                        <option value="pedido">Fazer um Pedido</option>
                        <option value="orcamento">Solicitar Orçamento para Evento</option>
                        <option value="catering">Serviços de Catering</option>
                        <option value="reclamacao">Reclamação</option>
                        <option value="sugestao">Sugestão</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="mensagem" className="block mb-2 font-semibold text-gray-700 text-sm sm:text-base">
                        Mensagem *
                      </label>
                      <Textarea
                        id="mensagem"
                        name="mensagem"
                        value={formData.mensagem}
                        onChange={handleChange}
                        placeholder="Como podemos ajudar? Descreva a sua necessidade em detalhes..."
                        rows={6}
                        className="border-2 focus:border-cantinho-terracotta resize-none text-base"
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 text-base sm:text-lg py-4 sm:py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={loading}
                      size="lg"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando mensagem...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Send className="mr-2 h-5 w-5" /> 
                          Enviar Mensagem
                        </span>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Enhanced Map section - Mobile first */}
        <div className="bg-gradient-to-br from-cant

ho-cream to-gray-50 py-12 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-4xl font-bold mb-4 text-cantinho-navy animate-fade-in">
                Nossa Localização
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 animate-fade-in">
                Encontre-nos no coração de Luanda
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden h-64 sm:h-[400px] lg:h-[500px] w-full max-w-6xl mx-auto">
              <div className="h-full w-full bg-gradient-to-br from-cantinho-navy/20 to-cantinho-terracotta/20 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cantinho-navy/10 to-cantinho-terracotta/10"></div>
                <div className="text-center p-6 sm:p-8 relative z-10">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl max-w-md mx-auto">
                    <MapPin className="h-12 w-12 sm:h-16 sm:w-16 text-cantinho-terracotta mx-auto mb-4 sm:mb-6" />
                    <h3 className="text-xl sm:text-2xl font-bold text-cantinho-navy mb-2">
                      Cantinho Algarvio
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 mb-4">
                      Luanda, Bairro Azul
                    </p>
                    <div className="space-y-2 text-xs sm:text-sm text-gray-500">
                      <p>Área de cobertura: Toda Luanda e arredores</p>
                      <p>Tempo médio de entrega: 20-45 minutos</p>
                    </div>
                    <Button className="mt-4 sm:mt-6 bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 w-full sm:w-auto">
                      Ver no Mapa
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contacto;
