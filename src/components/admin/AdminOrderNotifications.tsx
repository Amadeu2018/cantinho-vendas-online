
import { useState, useEffect } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, Wallet, CalendarDays } from 'lucide-react';

const AdminOrderNotifications = () => {
  const [newOrders, setNewOrders] = useState(0);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get current timestamp and initialize
    const now = new Date();
    const storedLastCheck = localStorage.getItem('adminLastOrderCheck');
    
    if (storedLastCheck) {
      setLastCheck(new Date(storedLastCheck));
    } else {
      // If first time, set current time as last check
      localStorage.setItem('adminLastOrderCheck', now.toISOString());
      setLastCheck(now);
    }
    
    // Check for new orders since last check
    checkNewOrders();
    
    // Set up real-time listener for new orders
    const channel = supabase
      .channel('orders-notification')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'orders' }, 
        (payload) => {
          setNewOrders(prev => prev + 1);
          toast({
            title: 'Novo pedido recebido',
            description: `Pedido #${payload.new.id.slice(0, 8)} foi recebido.`
          });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const checkNewOrders = async () => {
    if (!lastCheck) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id')
        .gte('created_at', lastCheck.toISOString());
        
      if (error) throw error;
      
      if (data) {
        setNewOrders(data.length);
      }
    } catch (error) {
      console.error('Error checking for new orders:', error);
    }
  };
  
  const handleClick = () => {
    // Update last check time
    const now = new Date();
    localStorage.setItem('adminLastOrderCheck', now.toISOString());
    setLastCheck(now);
    
    // Reset notification count
    setNewOrders(0);
    
    // Navigate to admin orders
    navigate("/admin");
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative p-2 rounded-full"
          title="Verificar novos pedidos"
        >
          {newOrders > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {newOrders > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] min-h-[1.25rem] flex items-center justify-center bg-red-500 text-white"
            >
              {newOrders}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="border-b bg-gray-50">Notificações</DropdownMenuLabel>
        <DropdownMenuItem className="py-3 cursor-pointer" onClick={handleClick}>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <ShoppingCart className="h-4 w-4" />
            </div>
            <div className="ml-3">
              <p className="font-medium text-sm">Novo pedido recebido</p>
              <p className="text-xs text-gray-500">5 min atrás</p>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="py-3 cursor-pointer">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <Wallet className="h-4 w-4" />
            </div>
            <div className="ml-3">
              <p className="font-medium text-sm">Pagamento confirmado</p>
              <p className="text-xs text-gray-500">1 hora atrás</p>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="py-3 cursor-pointer">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div className="ml-3">
              <p className="font-medium text-sm">Evento agendado</p>
              <p className="text-xs text-gray-500">Casamento - 2 horas atrás</p>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-xs font-medium text-center text-cantinho-navy">
          Ver todas
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminOrderNotifications;
