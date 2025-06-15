
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Gift } from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const handleFirstOrder = () => {
    navigate('/primeiro-pedido');
  };

  const handlePremiumCatering = () => {
    navigate('/eventos?package=premium');
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={handleFirstOrder}
        size="sm"
        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
      >
        <Gift className="w-4 h-4 mr-2" />
        Primeiro Pedido
      </Button>
      
      <Button
        onClick={handlePremiumCatering}
        size="sm"
        variant="outline"
        className="border-2 border-cantinho-terracotta text-cantinho-terracotta hover:bg-cantinho-terracotta hover:text-white transition-all duration-300 font-semibold"
      >
        Catering Premium
      </Button>
    </div>
  );
};

export default QuickActions;
