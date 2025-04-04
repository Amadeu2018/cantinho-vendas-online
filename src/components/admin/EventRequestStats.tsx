
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, CheckCircle, XCircle, Users } from "lucide-react";

interface EventStats {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
  averageGuests: number;
}

const EventRequestStats = () => {
  const [stats, setStats] = useState<EventStats>({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    averageGuests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Get total requests count
      const { count: totalCount, error: totalError } = await supabase
        .from('event_requests')
        .select('*', { count: 'exact', head: true });

      // Get pending requests count
      const { count: pendingCount, error: pendingError } = await supabase
        .from('event_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente');

      // Get completed requests count
      const { count: completedCount, error: completedError } = await supabase
        .from('event_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'atendido');

      // Get cancelled requests count
      const { count: cancelledCount, error: cancelledError } = await supabase
        .from('event_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'cancelado');

      // Get average guests
      const { data: guestsData, error: guestsError } = await supabase
        .from('event_requests')
        .select('num_convidados');

      if (totalError || pendingError || completedError || cancelledError || guestsError) {
        throw new Error("Erro ao buscar estatísticas");
      }

      // Calculate average guests
      let totalGuests = 0;
      if (guestsData && guestsData.length > 0) {
        totalGuests = guestsData.reduce((sum, item) => sum + item.num_convidados, 0);
      }
      
      const averageGuests = guestsData && guestsData.length > 0 
        ? Math.round(totalGuests / guestsData.length) 
        : 0;

      setStats({
        total: totalCount || 0,
        pending: pendingCount || 0,
        completed: completedCount || 0,
        cancelled: cancelledCount || 0,
        averageGuests
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total de Solicitações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <CalendarDays className="h-5 w-5 text-cantinho-terracotta mr-2" />
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.total}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-yellow-500 mr-2" />
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.pending}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Atendidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.completed}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Média de Convidados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-blue-500 mr-2" />
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.averageGuests}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventRequestStats;
