
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CalendarDays, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Users, 
  TrendingUp,
  Calendar 
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface EventStats {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
  averageGuests: number;
  monthlyStats: {
    month: string;
    count: number;
  }[];
  popularTypes: {
    type: string;
    count: number;
  }[];
}

const months = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

const EventRequestStats = () => {
  const [stats, setStats] = useState<EventStats>({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    averageGuests: 0,
    monthlyStats: [],
    popularTypes: []
  });
  const [loading, setLoading] = useState(true);
  const [expandedStats, setExpandedStats] = useState(false);

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

      // Get all event data for advanced stats
      const { data: eventData, error: eventError } = await supabase
        .from('event_requests')
        .select('num_convidados, data_evento, tipo_evento');

      if (totalError || pendingError || completedError || cancelledError || eventError) {
        throw new Error("Erro ao buscar estatísticas");
      }

      // Calculate average guests
      let totalGuests = 0;
      if (eventData && eventData.length > 0) {
        totalGuests = eventData.reduce((sum, item) => sum + item.num_convidados, 0);
      }
      
      const averageGuests = eventData && eventData.length > 0 
        ? Math.round(totalGuests / eventData.length) 
        : 0;

      // Calculate monthly stats
      const monthlyData = new Map<string, number>();
      
      eventData?.forEach(event => {
        if (event.data_evento) {
          const date = new Date(event.data_evento);
          const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
          
          if (monthlyData.has(monthYear)) {
            monthlyData.set(monthYear, (monthlyData.get(monthYear) || 0) + 1);
          } else {
            monthlyData.set(monthYear, 1);
          }
        }
      });
      
      const monthlyStats = Array.from(monthlyData, ([month, count]) => ({ month, count }))
        .sort((a, b) => {
          const [aMonth, aYear] = a.month.split(' ');
          const [bMonth, bYear] = b.month.split(' ');
          
          if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
          return months.indexOf(aMonth) - months.indexOf(bMonth);
        });

      // Calculate popular event types
      const typesData = new Map<string, number>();
      
      eventData?.forEach(event => {
        if (event.tipo_evento) {
          if (typesData.has(event.tipo_evento)) {
            typesData.set(event.tipo_evento, (typesData.get(event.tipo_evento) || 0) + 1);
          } else {
            typesData.set(event.tipo_evento, 1);
          }
        }
      });
      
      const popularTypes = Array.from(typesData, ([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5 types

      setStats({
        total: totalCount || 0,
        pending: pendingCount || 0,
        completed: completedCount || 0,
        cancelled: cancelledCount || 0,
        averageGuests,
        monthlyStats,
        popularTypes
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => setExpandedStats(!expandedStats)}
        >
          {expandedStats ? "Ocultar estatísticas detalhadas" : "Ver estatísticas detalhadas"}
        </Button>
      </div>

      {expandedStats && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Eventos por Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.monthlyStats.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead className="text-right">Quantidade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.monthlyStats.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.month}</TableCell>
                        <TableCell className="text-right">{item.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Sem dados disponíveis
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Tipos de Eventos Mais Populares
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.popularTypes.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo de Evento</TableHead>
                      <TableHead className="text-right">Quantidade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.popularTypes.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.type}</TableCell>
                        <TableCell className="text-right">{item.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Sem dados disponíveis
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EventRequestStats;
