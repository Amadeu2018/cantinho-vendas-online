import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
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
    mensagem: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
        title: "Mensagem enviada",
        description: "Entraremos em contato o mais breve possível. Obrigado!",
      });
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        mensagem: "",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section */}
        <div className="bg-cantinho-navy text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Contacte-nos</h1>
            <p className="text-lg max-w-2xl mx-auto">
              Estamos disponíveis para responder às suas perguntas, receber seus comentários
              ou agendar o seu próximo evento.
            </p>
          </div>
        </div>

        {/* Contact information and form */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact information */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-cantinho-navy mb-6">
                Informações de Contacto
              </h2>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-cantinho-terracotta flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium text-lg">Localização</h3>
                      <p className="text-muted-foreground mt-1">
                        Luanda, Bairro Azul
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-cantinho-terracotta flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium text-lg">Telefone</h3>
                      <p className="text-muted-foreground mt-1">
                        +244 949 645 654
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-cantinho-terracotta flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium text-lg">Email</h3>
                      <p className="text-muted-foreground mt-1">
                        info@cantinhoalgarvio.ao
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-cantinho-terracotta flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium text-lg">Horário de Funcionamento</h3>
                      <div className="text-muted-foreground mt-1 space-y-1">
                        <p>Segunda a Sexta: 10:00 - 22:00</p>
                        <p>Sábado e Domingo: 11:00 - 23:00</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact form */}
            <div>
              <h2 className="text-2xl font-bold text-cantinho-navy mb-6">
                Envie-nos uma Mensagem
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block mb-2 font-medium">
                    Nome
                  </label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Seu endereço de email"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="telefone" className="block mb-2 font-medium">
                    Telefone
                  </label>
                  <Input
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="Seu número de telefone"
                  />
                </div>
                <div>
                  <label htmlFor="mensagem" className="block mb-2 font-medium">
                    Mensagem
                  </label>
                  <Textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    placeholder="Como podemos ajudar?"
                    rows={5}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="mr-2 h-4 w-4" /> Enviar Mensagem
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Map section */}
        <div className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Nossa Localização</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-[400px] w-full">
              {/* Mockup do mapa com uma imagem estática ou iframe */}
              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                <div className="text-center p-4">
                  <MapPin className="h-12 w-12 text-cantinho-terracotta mx-auto mb-4" />
                  <p className="text-lg font-medium">Cantinho Algarvio</p>
                  <p className="text-muted-foreground">Luanda, Bairro Azul</p>
                  <p className="mt-4 text-sm">
                    Coordenadas: Latitude/Longitude viriam aqui
                  </p>
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
