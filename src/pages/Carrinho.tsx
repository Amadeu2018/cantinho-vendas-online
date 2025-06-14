
import { useState } from "react";
import { ShoppingBag, Gift, MapPin, CreditCard, Truck, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useFirstOrder } from "@/hooks/use-first-order";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import CheckoutForm from "@/components/cart/CheckoutForm";
import OrderStatus from "@/components/cart/OrderStatus";
import { formatCurrency } from "@/lib/utils";
import CartItem from "@/components/cart/CartItem";
import { useNavigate } from "react-router-dom";

const Carrinho = () => {
  const { 
    items, 
    clearCart, 
    subtotal,
    selectedLocation
  } = useCart();
  
  const { isFirstOrder, discountApplied, applyFirstOrderDiscount, calculateDiscount } = useFirstOrder();
  const navigate = useNavigate();
  
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  // Function that will be passed to CheckoutForm
  const handleCheckoutSuccess = (orderId: string) => {
    setCurrentOrderId(orderId);
    setCheckoutStep(3);
    clearCart();
  };
  
  const handleBackToShopping = () => {
    navigate('/menu');
  };

  const handleClearCart = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
    }, 300);
  };

  const handleApplyFirstOrderDiscount = () => {
    applyFirstOrderDiscount();
  };

  const deliveryFee = selectedLocation ? selectedLocation.fee : 0;
  const discount = calculateDiscount(subtotal);
  const total = subtotal + deliveryFee - discount;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cantinho-cream/30 to-white">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          {checkoutStep === 3 && currentOrderId ? (
            <OrderStatus 
              orderId={currentOrderId} 
              onBackToShopping={handleBackToShopping} 
            />
          ) : (
            <>
              {/* Header with progress indicator */}
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

              {items.length === 0 ? (
                <Card className="text-center py-16 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="pt-6">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cantinho-terracotta/20 to-cantinho-navy/20 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-cantinho-terracotta" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-3 text-cantinho-navy">Seu carrinho está vazio</h2>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Parece que você ainda não adicionou nenhum prato delicioso ao seu carrinho. Que tal explorar nosso menu?
                    </p>
                    <Button asChild className="bg-gradient-to-r from-cantinho-terracotta to-cantinho-terracotta/90 hover:from-cantinho-terracotta/90 hover:to-cantinho-terracotta shadow-lg hover:shadow-xl transition-all duration-300">
                      <Link to="/menu" className="flex items-center">
                        Explorar Menu <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    {checkoutStep === 1 ? (
                      <>
                        {/* First Order Promotion */}
                        {isFirstOrder && !discountApplied && (
                          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-green-500 rounded-full">
                                    <Gift className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-green-800">Primeiro Pedido - 10% OFF!</h3>
                                    <p className="text-sm text-green-700">Use o código PRIMEIRO10 e economize</p>
                                  </div>
                                </div>
                                <Button 
                                  onClick={handleApplyFirstOrderDiscount}
                                  size="sm"
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  Aplicar Desconto
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Cart Items */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <ShoppingBag className="w-5 h-5 text-cantinho-terracotta" />
                              <span>Itens do Carrinho</span>
                              <Badge variant="secondary">{items.length}</Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className={`space-y-4 transition-opacity duration-300 ${isClearing ? 'opacity-50' : 'opacity-100'}`}>
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
                          </CardContent>
                        </Card>

                        {/* Cart Actions */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                          <CardContent className="p-6">
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
                          </CardContent>
                        </Card>
                      </>
                    ) : (
                      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <CreditCard className="w-5 h-5 text-cantinho-terracotta" />
                            <span>Dados de Entrega</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CheckoutForm 
                            onSuccess={handleCheckoutSuccess} 
                          />
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="lg:col-span-1">
                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl sticky top-24">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-cantinho-navy">
                          <MapPin className="w-5 h-5" />
                          <span>Resumo do Pedido</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">{formatCurrency(subtotal)}</span>
                          </div>
                          
                          {discount > 0 && (
                            <div className="flex justify-between items-center text-green-600">
                              <span className="flex items-center">
                                <Gift className="w-4 h-4 mr-1" />
                                Desconto (10%)
                              </span>
                              <span className="font-medium">-{formatCurrency(discount)}</span>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Taxa de Entrega</span>
                            {selectedLocation ? (
                              <span className="font-medium">{formatCurrency(deliveryFee)}</span>
                            ) : (
                              <span className="text-gray-500 text-sm">Selecione localização</span>
                            )}
                          </div>
                          
                          <Separator />
                          
                          <div className="flex justify-between font-bold text-lg text-cantinho-navy">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                          </div>
                        </div>

                        <div className="space-y-3 pt-4">
                          {checkoutStep === 1 ? (
                            <Button
                              className="w-full bg-gradient-to-r from-cantinho-terracotta to-cantinho-terracotta/90 hover:from-cantinho-terracotta/90 hover:to-cantinho-terracotta shadow-lg hover:shadow-xl transition-all duration-300"
                              onClick={() => setCheckoutStep(2)}
                              size="lg"
                            >
                              Prosseguir para Pagamento
                              <ArrowRight className="ml-2 w-4 h-4" />
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
                          
                          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                            <Shield className="w-4 h-4" />
                            <span>
                              {checkoutStep === 1 
                                ? "Pagamento seguro e dados protegidos"
                                : "Seus dados estão seguros conosco"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
