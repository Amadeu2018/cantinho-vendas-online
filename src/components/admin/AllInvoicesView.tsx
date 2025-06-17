
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Search, Download, Eye, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Invoice } from "./EventRequestDetail";

interface OrderInvoice {
  id: string;
  number: string;
  total: number;
  created_at: string;
  status: string;
  type: 'order';
  customer_name: string;
  customer_email: string;
}

interface EventInvoice extends Invoice {
  type: 'event';
  customer_name: string;
  customer_email: string;
  event_type: string;
}

type AllInvoices = (OrderInvoice | EventInvoice)[];

const AllInvoicesView = () => {
  const [invoices, setInvoices] = useState<AllInvoices>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchAllInvoices();
  }, []);

  const fetchAllInvoices = async () => {
    try {
      setLoading(true);
      
      // Fetch event invoices
      const { data: eventInvoices, error: eventError } = await supabase
        .from('event_invoices')
        .select(`
          *,
          event_requests (
            nome,
            email,
            tipo_evento
          )
        `)
        .order('created_at', { ascending: false });

      if (eventError) throw eventError;

      // Fetch order invoices (from orders table)
      const { data: orders, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (orderError) throw orderError;

      // Transform event invoices
      const transformedEventInvoices: EventInvoice[] = (eventInvoices || []).map(invoice => ({
        ...invoice,
        type: 'event' as const,
        customer_name: (invoice as any).event_requests?.nome || 'Cliente não identificado',
        customer_email: (invoice as any).event_requests?.email || '',
        event_type: (invoice as any).event_requests?.tipo_evento || ''
      }));

      // Transform order invoices
      const transformedOrderInvoices: OrderInvoice[] = (orders || []).map(order => ({
        id: order.id,
        number: `PED-${order.id.slice(0, 8).toUpperCase()}`,
        total: order.total,
        created_at: order.created_at,
        status: order.status,
        type: 'order' as const,
        customer_name: (order.customer_info as any)?.name || 'Cliente não identificado',
        customer_email: (order.customer_info as any)?.email || ''
      }));

      // Combine and sort all invoices
      const allInvoices = [...transformedEventInvoices, ...transformedOrderInvoices]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setInvoices(allInvoices);
    } catch (error: any) {
      console.error("Erro ao buscar faturas:", error);
      toast({
        title: "Erro ao carregar faturas",
        description: error.message || "Não foi possível carregar as faturas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, type: string) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'pendente': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'pago': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'cancelado': 'bg-red-100 text-red-800',
    };

    const statusText = {
      'pending': 'Pendente',
      'pendente': 'Pendente',
      'completed': 'Completo',
      'pago': 'Pago',
      'cancelled': 'Cancelado',
      'cancelado': 'Cancelado',
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {statusText[status as keyof typeof statusText] || status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    return type === 'event' ? (
      <Badge variant="secondary">Evento</Badge>
    ) : (
      <Badge variant="outline">Pedido</Badge>
    );
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.type === 'event' ? invoice.numero : invoice.number).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || invoice.status === selectedStatus;
    const matchesType = selectedType === 'all' || invoice.type === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewInvoice = (invoice: OrderInvoice | EventInvoice) => {
    // Implementation would depend on your routing setup
    console.log("View invoice:", invoice);
    toast({
      title: "Visualizar fatura",
      description: "Funcionalidade de visualização será implementada",
    });
  };

  const handleDownloadInvoice = (invoice: OrderInvoice | EventInvoice) => {
    // Implementation for PDF download
    console.log("Download invoice:", invoice);
    toast({
      title: "Download iniciado",
      description: `Baixando fatura ${invoice.type === 'event' ? invoice.numero : invoice.number}`,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin h-6 w-6 border-4 border-cantinho-terracotta border-opacity-50 border-t-cantinho-terracotta rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Todas as Faturas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Buscar por cliente, email ou número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="event">Eventos</SelectItem>
                <SelectItem value="order">Pedidos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Invoices List */}
          <div className="space-y-4">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <FileText className="mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-2" />
                <p>Nenhuma fatura encontrada</p>
              </div>
            ) : (
              filteredInvoices.map((invoice) => (
                <div key={`${invoice.type}-${invoice.id}`} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeBadge(invoice.type)}
                          <span className="font-mono font-medium">
                            {invoice.type === 'event' ? invoice.numero : invoice.number}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{invoice.customer_name}</p>
                        <p className="text-xs text-gray-500">{invoice.customer_email}</p>
                        {invoice.type === 'event' && (
                          <p className="text-xs text-gray-500">
                            Evento: {(invoice as EventInvoice).event_type}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(invoice.status, invoice.type)}
                      </div>
                      <p className="font-semibold">
                        {new Intl.NumberFormat('pt-AO', {
                          style: 'currency',
                          currency: 'AOA',
                        }).format(invoice.type === 'event' ? invoice.valor : invoice.total)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(invoice.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewInvoice(invoice)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadInvoice(invoice)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllInvoicesView;
