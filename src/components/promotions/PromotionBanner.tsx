import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePromotions } from "@/hooks/use-promotions";
import { Clock, Tag, Percent } from "lucide-react";

interface PromotionBannerProps {
  className?: string;
}

const PromotionBanner = ({ className = "" }: PromotionBannerProps) => {
  const { promotions, loading } = usePromotions();
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  // Auto-rotate promotions every 5 seconds
  useEffect(() => {
    if (promotions.length > 1) {
      const interval = setInterval(() => {
        setCurrentPromoIndex((prev) => (prev + 1) % promotions.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [promotions.length]);

  if (loading || promotions.length === 0) {
    return null;
  }

  const currentPromotion = promotions[currentPromoIndex];

  const formatTimeRemaining = (validUntil: string) => {
    const now = new Date();
    const endDate = new Date(validUntil);
    const timeDiff = endDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) return "Expirou";
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} dia${days > 1 ? 's' : ''}`;
    } else {
      return `${hours}h restante${hours > 1 ? 's' : ''}`;
    }
  };

  return (
    <Card className={`bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg ${className}`}>
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Percent className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg sm:text-xl">
                  {currentPromotion.title}
                </h3>
                <Badge className="bg-white/20 text-white border-white/30">
                  <Tag className="h-3 w-3 mr-1" />
                  {currentPromotion.discountPercentage}% OFF
                </Badge>
              </div>
              <p className="text-white/90 text-sm">
                {currentPromotion.description}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-white/90 text-sm mb-1">
              <Clock className="h-4 w-4" />
              <span>{formatTimeRemaining(currentPromotion.validUntil)}</span>
            </div>
            {promotions.length > 1 && (
              <div className="flex gap-1">
                {promotions.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 w-6 rounded-full transition-all duration-300 ${
                      index === currentPromoIndex ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {currentPromotion.dish && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-white/10 rounded-lg">
            <img
              src={currentPromotion.dish.image_url}
              alt={currentPromotion.dish.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h4 className="font-medium text-white">
                {currentPromotion.dish.name}
              </h4>
              <div className="flex items-center gap-2 text-sm">
                <span className="line-through text-white/60">
                  {currentPromotion.dish.price.toLocaleString('pt-AO', { 
                    style: 'currency', 
                    currency: 'AOA' 
                  })}
                </span>
                <span className="font-bold text-white">
                  {(currentPromotion.dish.price * (1 - currentPromotion.discountPercentage / 100)).toLocaleString('pt-AO', { 
                    style: 'currency', 
                    currency: 'AOA' 
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PromotionBanner;