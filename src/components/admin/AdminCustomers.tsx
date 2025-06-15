
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Download, 
  Users, 
  UserCheck, 
  UserPlus, 
  Search, 
  Filter,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  Eye,
  TrendingUp,
  Activity
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

  const CustomerCard = ({ customer }: { customer: any }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <p className="font-medium text-sm truncate">{customer.email}</p>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <p className="text-sm text-gray-600">{customer.phone}</p>
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="h-4 w-4 mr-2" />
                Enviar Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-cantinho-navy">{customer.totalOrders}</p>
            <p className="text-xs text-gray-600">Pedidos</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-cantinho-terracotta">
              {new Intl.NumberFormat("pt-AO", {
                style: "currency",
                currency: "AOA",
                minimumFractionDigits: 0,
              }).format(customer.totalSpent || 0)}
            </p>
            <p className="text-xs text-gray-600">Total Gasto</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant={customer.status === 'active' ? 'default' : 'secondary'} className="text-xs">
            {customer.status === 'active' ? 'Ativo' : 'Inativo'}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            {formatDistanceToNow(new Date(customer.created_at), {
              addSuffix: true,
              locale: ptBR
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-cantinho-terracotta border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-cantinho-navy">Gestão de Clientes</h2>
          <p className="text-gray-600 mt-1">Gerencie e acompanhe seus clientes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => downloadCSV(filteredAndSortedCustomers, 'relatorio_clientes')}
            className="flex items-center gap-2 bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
          >
            <Download className="h-4 w-4" />
            {isMobile ? 'Exportar' : 'Exportar Dados'}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Ativos</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Novos</p>
                <p className="text-2xl font-bold">{stats.newThisMonth}</p>
              </div>
              <UserPlus className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Receita</p>
                <p className="text-xl lg:text-2xl font-bold">
                  {new Intl.NumberFormat("pt-AO", {
                    style: "currency",
                    currency: "AOA",
                    minimumFractionDigits: 0,
                    notation: isMobile ? "compact" : "standard"
                  }).format(stats.totalRevenue)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm">Média Pedidos</p>
                <p className="text-2xl font-bold">{stats.avgOrderValue}</p>
              </div>
              <Activity className="h-8 w-8 text-teal-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Data Cadastro</SelectItem>
                <SelectItem value="totalOrders">Total Pedidos</SelectItem>
                <SelectItem value="totalSpent">Total Gasto</SelectItem>
                <SelectItem value="lastOrderDate">Último Pedido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Clientes ({filteredAndSortedCustomers.length})</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className={isMobile ? "p-3" : "p-6"}>
          {filteredAndSortedCustomers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros de busca</p>
            </div>
          ) : isMobile ? (
            <div className="grid gap-3">
              {filteredAndSortedCustomers.map((customer) => (
                <CustomerCard key={customer.id} customer={customer} />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead className="text-center">Pedidos</TableHead>
                  <TableHead className="text-center">Concluídos</TableHead>
                  <TableHead className="text-right">Total Gasto</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Cadastrado</TableHead>
                  <TableHead>Último Pedido</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{customer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {customer.phone || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">{customer.totalOrders}</TableCell>
                    <TableCell className="text-center">{customer.completedOrders}</TableCell>
                    <TableCell className="text-right font-medium">
                      {new Intl.NumberFormat("pt-AO", {
                        style: "currency",
                        currency: "AOA",
                        minimumFractionDigits: 0,
                      }).format(customer.totalSpent || 0)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                        {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(customer.created_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </TableCell>
                    <TableCell>
                      {customer.lastOrderDate 
                        ? formatDistanceToNow(new Date(customer.lastOrderDate), {
                            addSuffix: true,
                            locale: ptBR
                          })
                        : 'Nunca'
                      }
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCustomers;
