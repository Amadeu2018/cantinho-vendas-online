
import { useState } from "react";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import CheckoutForm from "@/components/cart/CheckoutForm";
import OrderStatus from "@/components/cart/OrderStatus";

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  }).format(price);
};

const Carrinho = () => {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    subtotal,
    selectedLocation
  } = useCart();
  
  // Estado para gerenciar o passo do checkout (1: carrinho, 2: checkout, 3: rastreamento de pedido)
  const [checkoutStep, setCheckoutStep] = useState(1);
  // Estado para armazenar o ID do pedido após o envio bem-sucedido
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  const handleCheckoutSuccess = (orderId: string) => {
    setCurrentOrderId(orderId);
    setCheckoutStep(3);
    clearCart();
  };
  
  const handleBackToShopping = () => {
    setCheckoutStep(1);
    setCurrentOrderId(null);
  };

  // Calcula a taxa de entrega baseada na localização selecionada
  const deliveryFee = selectedLocation ? selectedLocation.fee : 0;
  
  // Calcula o total (subtotal + taxa de entrega)
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          {checkoutStep === 3 && currentOrderId ? (
            // Tela de rastreamento de pedido
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
                  {/* Items do Carrinho ou Formulário de Checkout */}
                  <div className="lg:col-span-2">
                    {checkoutStep === 1 ? (
                      // Mostrar itens do carrinho
                      <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="p-6">
                          <h2 className="text-xl font-semibold mb-4">Itens do Carrinho</h2>
                          {items.map((item) => (
                            <div key={item.id} className="flex flex-col sm:flex-row border-b py-4 last:border-b-0 last:pb-0">
                              <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 sm:ml-4 flex flex-col">
                                <div className="flex justify-between mb-2">
                                  <h3 className="font-medium">{item.name}</h3>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-500 hover:text-red-500"
                                    onClick={() => removeItem(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="text-cantinho-navy font-medium">
                                  {formatPrice(item.price)}
                                </div>
                                <div className="flex items-center mt-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="mx-3 font-medium">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                  <div className="ml-auto font-semibold">
                                    {formatPrice(item.price * item.quantity)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-6 bg-muted/20">
                          <div className="flex flex-wrap gap-3">
                            <Button
                              variant="outline"
                              onClick={clearCart}
                            >
                              Limpar Carrinho
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                            >
                              <Link to="/menu">Continuar Comprando</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Mostrar formulário de checkout
                      <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="p-6">
                          <CheckoutForm 
                            onSuccess={(orderId) => handleCheckoutSuccess(orderId)} 
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Resumo do Pedido */}
                  <div className="lg:col-span-1">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxa de Entrega</span>
                            {selectedLocation ? (
                              <span>{formatPrice(deliveryFee)}</span>
                            ) : (
                              <span className="text-gray-500 text-sm">Selecione localização</span>
                            )}
                          </div>
                          <Separator />
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 bg-muted/20">
                        {checkoutStep === 1 ? (
                          <Button
                            className="w-full bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
                            onClick={() => setCheckoutStep(2)}
                          >
                            Prosseguir para Pagamento
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full"
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
