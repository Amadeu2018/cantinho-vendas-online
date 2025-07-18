import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AceternityCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export const AceternityCard = ({ 
  children, 
  className, 
  hover = true,
  gradient = false 
}: AceternityCardProps) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "relative group/card rounded-3xl border border-cantinho-offwhite/20 bg-gradient-to-br from-white/80 to-cantinho-cream/40 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300",
        gradient && "bg-gradient-to-br from-cantinho-sand/20 via-white to-cantinho-cornflower/10",
        className
      )}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cantinho-terracotta/5 to-cantinho-navy/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export const FeatureCard = ({ title, description, icon, className }: FeatureCardProps) => {
  return (
    <AceternityCard className={cn("p-8", className)}>
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-cantinho-terracotta/10 to-cantinho-navy/10 group-hover/card:scale-110 transition-transform duration-300">
          <div className="w-8 h-8 text-cantinho-terracotta">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-bold text-cantinho-navy">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </AceternityCard>
  );
};

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  image: string;
  className?: string;
  onAddToCart?: () => void;
}

export const ProductCard = ({ 
  name, 
  description, 
  price, 
  image, 
  className,
  onAddToCart 
}: ProductCardProps) => {
  return (
    <AceternityCard className={cn("overflow-hidden", className)}>
      <div className="relative h-48 overflow-hidden rounded-t-3xl">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-cantinho-navy">
          {name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-cantinho-terracotta">
            {price.toLocaleString('pt-AO')} Kz
          </span>
          {onAddToCart && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddToCart}
              className="px-4 py-2 bg-cantinho-navy text-white rounded-xl hover:bg-cantinho-terracotta transition-colors duration-300"
            >
              Adicionar
            </motion.button>
          )}
        </div>
      </div>
    </AceternityCard>
  );
};