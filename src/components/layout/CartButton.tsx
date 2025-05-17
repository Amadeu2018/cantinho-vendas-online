
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";

type CartButtonProps = {
  totalItems: number;
};

const CartButton = ({ totalItems }: CartButtonProps) => {
  return (
    <Link to="/carrinho">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingBag className="h-5 w-5" />
        {totalItems > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
          >
            {totalItems}
          </Badge>
        )}
      </Button>
    </Link>
  );
};

export default CartButton;
