
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Utensils, Truck, Star, Clock } from "lucide-react";

const Hero = () => {
  const [animationState, setAnimationState] = useState(0);

  useEffect(() => {
    // Create a smooth background animation that cycles between different states
    const interval = setInterval(() => {
      setAnimationState((prev) => (prev + 1) % 100);
    }, 70);

    return () => clearInterval(interval);
  }, []);

  // Calculate the opacity and scale values based on the animation state
  const backgroundOpacity = 0.7 + Math.sin(animationState / 10) * 0.1;
  const backgroundScale = 1 + Math.sin(animationState / 15) * 0.02;
  
  return (
    <div className="relative h-[90vh] overflow-hidden">
      {/* Enhanced gradient overlay with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-cantinho-navy/80 via-cantinho-navy/60 to-cantinho-terracotta/70 z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-20"></div>
      
      {/* Dynamic background with multiple images */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-[7000ms] ease-in-out"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1721322800607-8c38375eef04')", 
          opacity: backgroundOpacity,
          transform: `scale(${backgroundScale})`,
        }}
      ></div>
      
      {/* Floating elements for visual appeal */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-cantinho-sand/20 rounded-full blur-xl animate-pulse z-5"></div>
      <div className="absolute bottom-40 left-10 w-24 h-24 bg-cantinho-terracotta/30 rounded-full blur-lg animate-bounce z-5"></div>
      
      <div className="relative container mx-auto h-full flex flex-col items-center justify-center text-white text-center px-4 z-30">
        {/* Enhanced hero content with stats */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-6 mb-6 text-cantinho-sand">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-sm font-medium">8+ Anos</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Utensils className="w-5 h-5" />
              <span className="text-sm font-medium">1000+ Pratos</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">30min Entrega</span>
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 hero-text-shadow animate-fade-in bg-gradient-to-r from-white via-cantinho-sand to-white bg-clip-text text-transparent">
          Cantinho Algarvio
        </h1>
        
        <p className="text-xl md:text-3xl mb-4 max-w-4xl hero-text-shadow animate-fade-in font-light leading-relaxed">
          Sabores autênticos da culinária <span className="text-cantinho-sand font-bold">portuguesa</span> e <span className="text-cantinho-sand font-bold">angolana</span>
        </p>
        
        <p className="text-lg md:text-xl mb-10 max-w-3xl hero-text-shadow animate-fade-in text-white/90">
          Líder em delivery e catering premium em Angola • Entregamos excelência na sua porta
        </p>

        {/* Enhanced call-to-action buttons */}
        <div className="flex flex-col sm:flex-row gap-6 animate-fade-in">
          <Button asChild className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <Link to="/menu" className="flex items-center gap-2">
              <Utensils className="w-5 h-5" />
              Ver Menu Completo
            </Link>
          </Button>
          <Button asChild variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 px-8 py-4 text-lg font-semibold backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <Link to="/eventos" className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Catering Premium
            </Link>
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 animate-fade-in">
          <p className="text-cantinho-sand/80 text-sm mb-4">Certificações e Parcerias de Confiança</p>
          <div className="flex items-center justify-center gap-8 text-white/60">
            <div className="text-center">
              <div className="text-2xl font-bold">HACCP</div>
              <div className="text-xs">Certificado</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold">ETAL</div>
              <div className="text-xs">Parceiro</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold">SPIC</div>
              <div className="text-xs">Parceiro</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
