
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

type MobileCartSummaryProps = {
  onCheckout: () => void;
};

const MobileCartSummary: React.FC<MobileCartSummaryProps> = ({ onCheckout }) => {
  const { items, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onCheckout();
    navigate('/carrinho');
  };

  if (items.length === 0) return null;

  return (
    <div className="border-t pt-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium">{items.length} itens no carrinho</span>
        <span className="font-bold">
          {new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency: 'AOA',
            minimumFractionDigits: 0
          }).format(totalPrice)}
        </span>
      </div>
      <Button 
        onClick={handleCheckout}
        className="w-full bg-cantinho-navy hover:bg-cantinho-navy/90"
      >
        Ver Carrinho e Finalizar
      </Button>
    </div>
  );
};

export default MobileCartSummary;
