
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
    <Button
      variant="ghost"
      className="relative p-2"
      onClick={handleClick}
      title="Verificar novos pedidos"
    >
      <Bell className="h-5 w-5" />
      {newOrders > 0 && (
        <Badge 
          className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] min-h-[1.25rem] flex items-center justify-center bg-red-500 text-white"
        >
          {newOrders}
        </Badge>
      )}
    </Button>
  );
};

export default AdminOrderNotifications;
