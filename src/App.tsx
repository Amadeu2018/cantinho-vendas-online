import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useRoutes } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { EventProvider } from "./contexts/EventContext";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Contacto from "./pages/Contacto";
import Eventos from "./pages/Eventos";
import Carrinho from "./pages/Carrinho";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import EventAdmin from "./pages/EventAdmin";
import Sobre from "./pages/Sobre";
import FirstOrder from "./pages/FirstOrder";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import routes from "tempo-routes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <EventProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              {/* Tempo routes */}
              {import.meta.env.VITE_TEMPO && useRoutes(routes)}
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/primeiro-pedido" element={<FirstOrder />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/eventos" element={<Eventos />} />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/eventos" element={<EventAdmin />} />
                <Route path="/event-admin" element={<EventAdmin />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/auth/update-password" element={<UpdatePassword />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/sobre" element={<Sobre />} />
                
                {/* Add this before the catchall route */}
                {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </EventProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;