
import React from "react";
import { ShoppingBag, CreditCard, Truck } from "lucide-react";

interface CartHeaderProps {
  checkoutStep: number;
}

const CartHeader = ({ checkoutStep }: CartHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${checkoutStep >= 1 ? 'bg-cantinho-terracotta text-white' : 'bg-gray-200 text-gray-500'}`}>
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className={`w-16 h-1 ${checkoutStep >= 2 ? 'bg-cantinho-terracotta' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${checkoutStep >= 2 ? 'bg-cantinho-terracotta text-white' : 'bg-gray-200 text-gray-500'}`}>
            <CreditCard className="w-5 h-5" />
          </div>
          <div className={`w-16 h-1 ${checkoutStep >= 3 ? 'bg-cantinho-terracotta' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${checkoutStep >= 3 ? 'bg-cantinho-terracotta text-white' : 'bg-gray-200 text-gray-500'}`}>
            <Truck className="w-5 h-5" />
          </div>
        </div>
      </div>
      <h1 className="text-4xl font-bold text-center mb-2 text-cantinho-navy">
        {checkoutStep === 1 ? "Seu Carrinho" : "Finalizar Pedido"}
      </h1>
      <p className="text-center text-gray-600">
        {checkoutStep === 1 ? "Revise seus itens antes de prosseguir" : "Complete seus dados para finalizar"}
      </p>
    </div>
  );
};

export default CartHeader;
