import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Download, Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import CustomerStats from "./customers/CustomerStats";
import CustomerFilters from "./customers/CustomerFilters";
import CustomerTable from "./customers/CustomerTable";

const AdminCustomers = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: orderCounts, error: ordersError } = await supabase
        .from('orders')
        .select('customer_id, status, total, created_at')
        .not('customer_id', 'is', null);

      if (ordersError) throw ordersError;

      const processedCustomers = profiles.map(profile => {
        const customerOrders = orderCounts.filter(order => order.customer_id === profile.id);
        const totalOrders = customerOrders.length;
        const completedOrders = customerOrders.filter(order => order.status === 'completed').length;
        const totalSpent = customerOrders
          .filter(order => order.status === 'completed')
          .reduce((sum, order) => sum + (order.total || 0), 0);
        
        const lastOrderDate = customerOrders.length > 0 
          ? new Date(Math.max(...customerOrders.map(order => new Date(order.created_at).getTime())))
          : null;

        return {
          ...profile,
          totalOrders,
          completedOrders,
          totalSpent,
          lastOrderDate,
          status: totalOrders > 0 ? 'active' : 'inactive'
        };
      });

      setCustomers(processedCustomers);
    } catch (error: any) {
      console.error('Erro ao buscar clientes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes. Verifique as permissões da base de dados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers.filter(customer => {
      const matchesSearch = 
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'created_at' || sortBy === 'lastOrderDate') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [customers, searchTerm, statusFilter, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const newThisMonth = customers.filter(c => {
      const createdDate = new Date(c.created_at);
      const now = new Date();
      return createdDate.getMonth() === now.getMonth() && 
             createdDate.getFullYear() === now.getFullYear();
    }).length;
    
    const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
    const avgOrderValue = customers.length > 0 
      ? customers.reduce((sum, c) => sum + c.totalOrders, 0) / customers.length 
      : 0;

    return {
      total: customers.length,
      active: activeCustomers,
      newThisMonth,
      totalRevenue,
      avgOrderValue: avgOrderValue.toFixed(1)
    };
  }, [customers]);

  const downloadCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "A seleção atual não contém clientes para gerar o relatório.",
        variant: "default",
      });
      return;
    }

    const headers = ['Email', 'Telefone', 'Total Pedidos', 'Pedidos Concluídos', 'Total Gasto', 'Status', 'Data Cadastro', 'Último Pedido'];
    const csvContent = [
      headers.join(','),
      ...data.map(customer => [
        customer.email || '',
        customer.phone || '',
        customer.totalOrders || 0,
        customer.completedOrders || 0,
        customer.totalSpent || 0,
        customer.status === 'active' ? 'Ativo' : 'Inativo',
        new Date(customer.created_at).toLocaleDateString('pt-PT'),
        customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString('pt-PT') : 'Nunca'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-cantinho-terracotta border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-cantinho-navy flex items-center gap-2">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-cantinho-terracotta" />
            Gestão de Clientes
          </h2>
          <p className="text-gray-600 mt-1">Gerencie e acompanhe seus clientes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => downloadCSV(filteredAndSortedCustomers, 'relatorio_clientes')}
            className="flex items-center gap-2 bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Download className="h-4 w-4" />
            {isMobile ? 'Exportar' : 'Exportar Dados'}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <CustomerStats stats={stats} />

      {/* Filters */}
      <CustomerFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Results Table */}
      <CustomerTable
        customers={filteredAndSortedCustomers}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
    </div>
  );
};

export default AdminCustomers;
