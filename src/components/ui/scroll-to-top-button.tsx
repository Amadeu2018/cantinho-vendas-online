
import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollToTopButtonProps {
  threshold?: number;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const ScrollToTopButton = ({ threshold = 400, className, size = 'icon' }: ScrollToTopButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      size={size}
      className={cn(
        "fixed bottom-4 right-4 z-50 shadow-lg hover:shadow-xl transition-all duration-300",
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        "animate-bounce-in hover:scale-110",
        className
      )}
    >
      <ArrowUp className="h-4 w-4" />
      {size !== 'icon' && <span className="ml-2">Topo</span>}
    </Button>
  );
};

export default ScrollToTopButton;
