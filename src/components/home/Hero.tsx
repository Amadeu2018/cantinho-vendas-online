
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Camada de animação de gradiente */}
      <div className="absolute inset-0 hero-gradient"></div>
      
      {/* Fundo com imagem */}
      <div 
        className="absolute inset-0 bg-cover bg-center transform transition-all duration-7000"
        style={{ 
          backgroundImage: "url('/background.jpg')", 
          opacity: 0.7 
        }}
      ></div>
      
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <div className="relative container mx-auto h-full flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 hero-text-shadow animate-fade-in">
          Cantinho Algarvio
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl hero-text-shadow animate-fade-in">
          Sabores autênticos da culinária portuguesa e angolana, entregues na sua porta.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
          <Button asChild className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 text-white">
            <Link to="/menu">Ver Menu</Link>
          </Button>
          <Button asChild variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
            <Link to="/eventos">Catering para Eventos</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
