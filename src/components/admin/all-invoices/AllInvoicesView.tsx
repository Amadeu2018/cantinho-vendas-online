
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import InvoiceFilters from "./InvoiceFilters";
import InvoiceCard from "./InvoiceCard";

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

interface EventInvoice {
  id: string;
  numero: string;
  valor: number;
  created_at: string;
  status: string;
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

      const { data: orders, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (orderError) throw orderError;

      const transformedEventInvoices: EventInvoice[] = (eventInvoices || []).map(invoice => ({
        ...invoice,
        type: 'event' as const,
        customer_name: (invoice as any).event_requests?.nome || 'Cliente não identificado',
        customer_email: (invoice as any).event_requests?.email || '',
        event_type: (invoice as any).event_requests?.tipo_evento || ''
      }));

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
    console.log("View invoice:", invoice);
    toast({
      title: "Visualizar fatura",
      description: "Funcionalidade de visualização será implementada",
    });
  };

  const handleDownloadInvoice = (invoice: OrderInvoice | EventInvoice) => {
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
          <InvoiceFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />

          <div className="space-y-4">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <FileText className="mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-2" />
                <p>Nenhuma fatura encontrada</p>
              </div>
            ) : (
              filteredInvoices.map((invoice) => (
                <InvoiceCard
                  key={`${invoice.type}-${invoice.id}`}
                  invoice={invoice}
                  onViewInvoice={handleViewInvoice}
                  onDownloadInvoice={handleDownloadInvoice}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllInvoicesView;
