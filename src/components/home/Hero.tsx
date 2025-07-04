import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Utensils, Truck, Star, Clock, Gift, Phone } from "lucide-react";
const Hero = () => {
  const [animationState, setAnimationState] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationState(prev => (prev + 1) % 100);
    }, 70);
    return () => clearInterval(interval);
  }, []);
  const backgroundOpacity = 0.7 + Math.sin(animationState / 10) * 0.1;
  const backgroundScale = 1 + Math.sin(animationState / 15) * 0.02;
  return <div className="relative min-h-[85vh] sm:min-h-[90vh] overflow-hidden">
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cantinho-navy/85 via-cantinho-navy/70 to-cantinho-terracotta/75 z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-20"></div>
      
      {/* Dynamic background */}
      <div className="absolute inset-0 bg-cover bg-center transition-all duration-[7000ms] ease-in-out" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1721322800607-8c38375eef04')",
      opacity: backgroundOpacity,
      transform: `scale(${backgroundScale})`
    }}></div>
      
      {/* Floating elements */}
      <div className="absolute top-16 right-4 sm:top-20 sm:right-20 w-20 h-20 sm:w-32 sm:h-32 bg-cantinho-sand/20 rounded-full blur-xl animate-pulse z-5"></div>
      <div className="absolute bottom-32 left-4 sm:bottom-40 sm:left-10 w-16 h-16 sm:w-24 sm:h-24 bg-cantinho-terracotta/30 rounded-full blur-lg animate-bounce z-5"></div>
      
      <div className="relative container mx-auto h-full flex flex-col items-center justify-center text-white text-center px-4 sm:px-6 py-8 sm:py-12 z-30">
        {/* Mobile-first trust indicators */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-cantinho-sand">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              <span className="text-xs sm:text-sm font-medium">8+ Anos</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm">
              <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">1000+ Pratos</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">30min</span>
            </div>
          </div>
        </div>

        {/* Mobile-optimized title */}
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 hero-text-shadow animate-fade-in bg-gradient-to-r from-white via-cantinho-sand to-white bg-clip-text text-transparent leading-tight">
          Cantinho Algarvio
        </h1>
        
        {/* Mobile-first subtitle */}
        <p className="text-base sm:text-xl md:text-3xl mb-3 sm:mb-4 max-w-4xl hero-text-shadow animate-fade-in font-light leading-relaxed px-2">
          Sabores autênticos da culinária <span className="text-cantinho-sand font-bold">angolana</span> e <span className="text-cantinho-sand font-bold">angolana</span>
        </p>
        
        <p className="text-sm sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-3xl hero-text-shadow animate-fade-in text-white/90 px-2">
          Líder em delivery e catering premium em Angola
        </p>

        {/* Mobile-first action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-in w-full max-w-md sm:max-w-none">
          <Button asChild className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto">
            <Link to="/menu" className="flex items-center justify-center gap-2">
              <Utensils className="w-5 h-5" />
              Ver Menu Completo
            </Link>
          </Button>
          <Button asChild variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto">
            <Link to="/eventos" className="flex items-center justify-center gap-2">
              <Truck className="w-5 h-5" />
              Catering Premium
            </Link>
          </Button>
        </div>

        {/* Mobile-optimized quick actions */}
        <div className="mt-8 sm:mt-12 animate-fade-in w-full max-w-md sm:max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Link to="/primeiro-pedido">
              <Button className="bg-green-500 hover:bg-green-600 text-white w-full p-4 sm:p-3 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-center gap-3">
                  <Gift className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="font-bold">Primeiro Pedido</div>
                    <div className="text-xs text-green-100">10% desconto</div>
                  </div>
                </div>
              </Button>
            </Link>
            
            <a href="tel:+244924678544">
              <Button variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 w-full p-4 sm:p-3 text-sm sm:text-base font-semibold backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-center gap-3">
                  <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="font-bold">Ligar Agora</div>
                    <div className="text-xs text-white/80">Entrega rápida</div>
                  </div>
                </div>
              </Button>
            </a>
          </div>
        </div>

        {/* Mobile-optimized trust indicators */}
        <div className="mt-8 sm:mt-12 animate-fade-in">
          <p className="text-cantinho-sand/80 text-xs sm:text-sm mb-3 sm:mb-4">Certificações e Parcerias de Confiança</p>
          <div className="flex items-center justify-center gap-4 sm:gap-8 text-white/60">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold">HACCP</div>
              <div className="text-xs">Certificado</div>
            </div>
            <div className="w-px h-6 sm:h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold">ETAL</div>
              <div className="text-xs">Parceiro</div>
            </div>
            <div className="w-px h-6 sm:h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold">SPIC</div>
              <div className="text-xs">Parceiro</div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Hero;