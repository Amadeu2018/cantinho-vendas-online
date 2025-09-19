import React from 'react';
import CheckoutForm from '@/components/cart/checkout/CheckoutForm';

const CheckoutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cantinho-cream via-white to-cantinho-cream/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-cantinho-navy mb-2">
              Finalizar Pedido
            </h1>
            <p className="text-gray-600">
              Complete suas informações e confirme seu pedido
            </p>
          </div>
          
          <CheckoutForm />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;