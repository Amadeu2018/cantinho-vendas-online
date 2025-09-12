import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Search, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface SecurityLog {
  id: string;
  created_at: string;
  action: string;
  user_id: string | null;
  ip_address: unknown;
  user_agent: string | null;
  details: any;
}

const SecurityLogsManager = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchSecurityLogs();
  }, []);

  const fetchSecurityLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('security_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching security logs:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar logs de segurança",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (action: string) => {
    if (action.toLowerCase().includes('login') && !action.toLowerCase().includes('falhada')) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (action.toLowerCase().includes('falhada') || action.toLowerCase().includes('erro')) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    } else {
      return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (action: string) => {
    if (action.toLowerCase().includes('login') && !action.toLowerCase().includes('falhada')) {
      return <Badge variant="default">Sucesso</Badge>;
    } else if (action.toLowerCase().includes('falhada') || action.toLowerCase().includes('erro')) {
      return <Badge variant="destructive">Erro</Badge>;
    } else {
      return <Badge variant="secondary">Info</Badge>;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.ip_address && String(log.ip_address).includes(searchTerm)) ||
      (log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "success" && log.action.toLowerCase().includes('login') && !log.action.toLowerCase().includes('falhada')) ||
      (statusFilter === "error" && (log.action.toLowerCase().includes('falhada') || log.action.toLowerCase().includes('erro'))) ||
      (statusFilter === "info" && !log.action.toLowerCase().includes('login') && !log.action.toLowerCase().includes('falhada') && !log.action.toLowerCase().includes('erro'));
    
    return matchesSearch && matchesStatus;
  });

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Logs de Segurança
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="success">Sucesso</SelectItem>
            <SelectItem value="error">Erro</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registos de Atividade</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin h-8 w-8 border-2 border-cantinho-terracotta border-t-transparent rounded-full"></div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum log encontrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <Card key={log.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(log.action)}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className="font-medium">{log.action}</h4>
                            {getStatusBadge(log.action)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {log.details ? JSON.stringify(log.details) : 'Sem detalhes'}
                          </p>
                          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                            <span>Usuário: {log.user_id || 'Sistema'}</span>
                            <span>IP: {String(log.ip_address) || 'N/A'}</span>
                            <span>Data: {formatTimestamp(log.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityLogsManager;