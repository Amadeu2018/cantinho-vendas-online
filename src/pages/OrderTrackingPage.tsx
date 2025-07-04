import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RealTimeOrderTracking from "@/components/tracking/RealTimeOrderTracking";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

const OrderTrackingPage = () => {
  const [orderId, setOrderId] = useState("");
  const [searchedOrderId, setSearchedOrderId] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      setSearchedOrderId(orderId.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-cantinho-navy text-center">
            Rastrear Pedido
          </h1>
          
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Insira o ID do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="ID do pedido (ex: 12345678)"
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!orderId.trim()}>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                </form>
              </CardContent>
            </Card>

            {searchedOrderId && (
              <RealTimeOrderTracking 
                orderId={searchedOrderId} 
                showFullDetails={true}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTrackingPage;