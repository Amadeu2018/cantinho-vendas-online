import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Utensils, Truck, Star, Clock, Gift, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import heroBg1 from "@/assets/hero-bg-1.jpg";
import heroBg2 from "@/assets/hero-bg-2.jpg";
import heroBg3 from "@/assets/hero-bg-3.jpg";
import heroBg4 from "@/assets/hero-bg-4.jpg";
import heroBg5 from "@/assets/hero-bg-5.jpg";

const heroImages = [heroBg1, heroBg2, heroBg3, heroBg4, heroBg5];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[85vh] sm:min-h-[90vh] overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-cantinho-navy/85 via-cantinho-navy/70 to-cantinho-terracotta/75 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-20" />

      {/* Animated background slideshow with explosive transitions */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentImage}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImages[currentImage]}')` }}
          initial={{ opacity: 0, scale: 1.3, rotate: 2 }}
          animate={{ opacity: 0.8, scale: 1.05, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </AnimatePresence>

      {/* Explosive particle effects */}
      <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
        {isLoaded && (
          <>
            <motion.div
              className="absolute w-40 h-40 sm:w-72 sm:h-72 rounded-full"
              style={{ background: "radial-gradient(circle, hsla(var(--cantinho-sand), 0.3), transparent 70%)" }}
              animate={{
                x: ["-10%", "80%", "30%", "-10%"],
                y: ["10%", "60%", "20%", "10%"],
                scale: [1, 1.5, 0.8, 1],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute w-32 h-32 sm:w-56 sm:h-56 rounded-full"
              style={{ background: "radial-gradient(circle, hsla(15, 80%, 55%, 0.25), transparent 70%)" }}
              animate={{
                x: ["90%", "10%", "70%", "90%"],
                y: ["70%", "20%", "80%", "70%"],
                scale: [0.8, 1.3, 1, 0.8],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute w-24 h-24 sm:w-44 sm:h-44 rounded-full"
              style={{ background: "radial-gradient(circle, hsla(220, 60%, 30%, 0.2), transparent 70%)" }}
              animate={{
                x: ["50%", "20%", "80%", "50%"],
                y: ["30%", "80%", "10%", "30%"],
                scale: [1.2, 0.7, 1.4, 1.2],
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
      </div>

      {/* Slideshow indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentImage(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
              i === currentImage 
                ? "bg-white w-8 shadow-lg shadow-white/30" 
                : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      <div className="relative container mx-auto h-full flex flex-col items-center justify-center text-white text-center px-4 sm:px-6 py-8 sm:py-12 z-30">
        {/* Trust indicators with explosive entrance */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -50, scale: 0.5 }}
          animate={isLoaded ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.2 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-cantinho-sand">
            {[
              { icon: Star, text: "8+ Anos", fill: true },
              { icon: Utensils, text: "1000+ Pratos" },
              { icon: Clock, text: "30min" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 bg-white/10 px-3 py-2 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm border border-white/10"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={isLoaded ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.15, type: "spring", bounce: 0.5 }}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.fill ? "fill-current" : ""}`} />
                <span className="text-xs sm:text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Title with explosive text reveal */}
        <motion.h1
          className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 hero-text-shadow bg-gradient-to-r from-white via-cantinho-sand to-white bg-clip-text text-transparent leading-tight"
          initial={{ opacity: 0, scale: 0.3, y: 80 }}
          animate={isLoaded ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 1, type: "spring", bounce: 0.3, delay: 0.6 }}
        >
          Cantinho Algarvio
        </motion.h1>

        {/* Subtitle with stagger */}
        <motion.p
          className="text-base sm:text-xl md:text-3xl mb-3 sm:mb-4 max-w-4xl hero-text-shadow font-light leading-relaxed px-2"
          initial={{ opacity: 0, x: -100 }}
          animate={isLoaded ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
        >
          Sabores autênticos da culinária <span className="text-cantinho-sand font-bold">angolana</span> e <span className="text-cantinho-sand font-bold">portuguesa</span>
        </motion.p>

        <motion.p
          className="text-sm sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-3xl hero-text-shadow text-white/90 px-2"
          initial={{ opacity: 0, x: 100 }}
          animate={isLoaded ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
        >
          Líder em delivery e catering premium em Angola
        </motion.p>

        {/* CTA buttons with explosive pop */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-md sm:max-w-none"
          initial={{ opacity: 0, y: 60, scale: 0.8 }}
          animate={isLoaded ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.3, type: "spring", bounce: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            <Button asChild className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto">
              <Link to="/menu" className="flex items-center justify-center gap-2">
                <Utensils className="w-5 h-5" />
                Ver Menu Completo
              </Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            <Button asChild variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto">
              <Link to="/eventos" className="flex items-center justify-center gap-2">
                <Truck className="w-5 h-5" />
                Catering Premium
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Quick actions with staggered explosive entrance */}
        <motion.div
          className="mt-8 sm:mt-12 w-full max-w-md sm:max-w-2xl"
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ delay: 1.6 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <motion.div
              initial={{ opacity: 0, x: -80, rotate: -10 }}
              animate={isLoaded ? { opacity: 1, x: 0, rotate: 0 } : {}}
              transition={{ delay: 1.7, type: "spring", bounce: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 80, rotate: 10 }}
              animate={isLoaded ? { opacity: 1, x: 0, rotate: 0 } : {}}
              transition={{ delay: 1.8, type: "spring", bounce: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
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
            </motion.div>
          </div>
        </motion.div>

        {/* Trust certifications with explosive reveal */}
        <motion.div
          className="mt-8 sm:mt-12"
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={isLoaded ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ delay: 2, duration: 0.8, type: "spring", bounce: 0.4 }}
        >
          <p className="text-cantinho-sand/80 text-xs sm:text-sm mb-3 sm:mb-4">Certificações e Parcerias de Confiança</p>
          <div className="flex items-center justify-center gap-4 sm:gap-8 text-white/60">
            {[
              { name: "HACCP", label: "Certificado" },
              { name: "ETAL", label: "Parceiro" },
              { name: "SPIC", label: "Parceiro" },
            ].map((cert, i) => (
              <motion.div
                key={cert.name}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 2.1 + i * 0.1 }}
                whileHover={{ scale: 1.15, color: "rgba(255,255,255,0.9)" }}
              >
                <div className="text-lg sm:text-2xl font-bold">{cert.name}</div>
                <div className="text-xs">{cert.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
