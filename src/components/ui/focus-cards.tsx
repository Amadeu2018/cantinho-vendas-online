import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Card {
  title: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
}

interface FocusCardsProps {
  cards: Card[];
  className?: string;
}

export const FocusCards = ({ cards, className }: FocusCardsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {cards.map((card, index) => (
        <motion.div
          key={index}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "relative group rounded-3xl overflow-hidden cursor-pointer",
            "transition-all duration-300 ease-out",
            hovered !== null && hovered !== index && "blur-sm scale-[0.98] opacity-60"
          )}
        >
          <div className="relative h-80 overflow-hidden rounded-3xl">
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: hovered === index ? 1 : 0.8, 
                y: hovered === index ? 0 : 10 
              }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 p-6 text-white"
            >
              <h3 className="text-2xl font-bold mb-2">
                {card.title}
              </h3>
              <p className="text-white/90 text-sm leading-relaxed mb-4">
                {card.description}
              </p>
              {card.ctaText && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-300"
                >
                  {card.ctaText}
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};