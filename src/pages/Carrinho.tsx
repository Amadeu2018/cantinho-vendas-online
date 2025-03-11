
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import CheckoutForm from "@/components/cart/CheckoutForm";
import OrderStatus from "@/components/cart/OrderStatus";
import { formatCurrency } from "@/lib/utils";
import CartItem from "@/components/cart/CartItem";

const Carrinho = () => {
  const { 
    items, 
    clearCart, 
    subtotal,
    selectedLocation
  } = useCart();
  
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const handleCheckoutSuccess = (orderId: string) => {
    setCurrentOrderId(orderId);
    setCheckoutStep(3);
    clearCart();
  };
  
  const handleBackToShopping = () => {
    setCheckoutStep(1);
    setCurrentOrderId(null);
  };

  const handleClearCart = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
    }, 300);
  };

  const deliveryFee = selectedLocation ? selectedLocation.fee : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          {checkoutStep === 3 && currentOrderId ? (
            <>
              <h1 className="text-3xl font-bold mb-8 text-cantinho-navy">
                Acompanhar Pedido
              </h1>
              <OrderStatus 
                orderId={currentOrderId} 
                onBackToShopping={handleBackToShopping} 
              />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-8 text-cantinho-navy">
                {checkoutStep === 1 ? "Seu Carrinho" : "Finalizar Pedido"}
              </h1>

              {items.length === 0 ? (
                <div className="text-center py-16 bg-muted/30 rounded-lg">
                  <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-medium mb-2">Seu carrinho está vazio</h2>
                  <p className="text-muted-foreground mb-6">
                    Parece que você ainda não adicionou nenhum prato ao seu carrinho.
                  </p>
                  <Button asChild className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90">
                    <Link to="/menu">Explorar Nosso Menu</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    {checkoutStep === 1 ? (
                      <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="p-6">
                          <h2 className="text-xl font-semibold mb-4">Itens do Carrinho</h2>
                          <div className={`transition-opacity duration-300 ${isClearing ? 'opacity-50' : 'opacity-100'}`}>
                            {items.map((item) => (
                              <CartItem 
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                price={item.price}
                                quantity={item.quantity}
                                image={item.image}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="p-6 bg-muted/20">
                          <div className="flex flex-wrap gap-3">
                            <Button
                              variant="outline"
                              onClick={handleClearCart}
                              disabled={isClearing}
                              className="transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            >
                              Limpar Carrinho
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                              className="transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                            >
                              <Link to="/menu">Continuar Comprando</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="p-6">
                          <CheckoutForm 
                            onSuccess={handleCheckoutSuccess} 
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-1">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxa de Entrega</span>
                            {selectedLocation ? (
                              <span>{formatCurrency(deliveryFee)}</span>
                            ) : (
                              <span className="text-gray-500 text-sm">Selecione localização</span>
                            )}
                          </div>
                          <Separator />
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 bg-muted/20">
                        {checkoutStep === 1 ? (
                          <Button
                            className="w-full bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 transition-all"
                            onClick={() => setCheckoutStep(2)}
                          >
                            Prosseguir para Pagamento
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full transition-all hover:bg-muted"
                            onClick={() => setCheckoutStep(1)}
                          >
                            Voltar ao Carrinho
                          </Button>
                        )}
                        <p className="text-xs text-center text-muted-foreground mt-3">
                          {checkoutStep === 1 
                            ? "Os impostos estão incluídos no preço. Taxa de entrega baseada na localização."
                            : "Seus dados estão seguros e não serão compartilhados com terceiros."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Carrinho;
