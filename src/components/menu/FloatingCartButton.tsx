
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

interface FloatingCartButtonProps {
  itemsCount: number;
}

const FloatingCartButton = ({ itemsCount }: FloatingCartButtonProps) => {
  if (itemsCount === 0) return null;

  return (
    <Link to="/carrinho">
      <Button
        size="lg"
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-cantinho-terracotta to-cantinho-sand hover:from-cantinho-sand hover:to-cantinho-terracotta shadow-2xl rounded-full w-20 h-20 flex items-center justify-center transition-all duration-300 hover:scale-110 animate-pulse"
      >
        <ShoppingCart className="h-7 w-7 text-white" />
        <Badge className="absolute -top-2 -right-2 bg-cantinho-navy text-white text-sm px-2 py-1 rounded-full">
          {itemsCount}
        </Badge>
      </Button>
    </Link>
  );
};

export default FloatingCartButton;
