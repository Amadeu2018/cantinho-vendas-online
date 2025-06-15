import { useState, useEffect } from "react";
import { Card, CardContent,  CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Download } from "lucide-react";

const AdminCustomers = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // Get customers from profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get order counts for each customer
      const { data: orderCounts, error: ordersError } = await supabase
        .from('orders')
        .select('customer_id, status')
        .not('customer_id', 'is', null);

      if (ordersError) throw ordersError;

      // Process customer data with order statistics
      const processedCustomers = profiles.map(profile => {
        const customerOrders = orderCounts.filter(order => order.customer_id === profile.id);
        const totalOrders = customerOrders.length;
        const completedOrders = customerOrders.filter(order => order.status === 'completed').length;

        return {
          ...profile,
          totalOrders,
          completedOrders,
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

  const downloadCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "A seleção atual não contém clientes para gerar o relatório.",
        variant: "default",
      });
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          let value = row[header];
          if (value === null || value === undefined) {
            return '';
          }
          let stringValue = String(value);
          if (stringValue.includes(',')) {
            stringValue = `"${stringValue}"`;
          }
          return stringValue;
        }).join(',')
      )
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
  
  const getExportableData = (customerList: any[]) => {
    return customerList.map(({ email, phone, totalOrders, completedOrders, status, created_at }) => ({
      email,
      telefone: phone || 'N/A',
      total_pedidos: totalOrders,
      pedidos_concluidos: completedOrders,
      status: status === 'active' ? 'Ativo' : 'Inativo',
      data_cadastro: new Date(created_at).toLocaleDateString('pt-PT'),
    }));
  };

  const handleExportAll = () => {
    downloadCSV(getExportableData(customers), 'relatorio_todos_clientes');
  };

  const handleExportActive = () => {
    const activeCustomers = customers.filter(c => c.status === 'active');
    downloadCSV(getExportableData(activeCustomers), 'relatorio_clientes_ativos');
  };

  const handleExportNew = () => {
    const newCustomers = customers.filter(c => {
      const createdDate = new Date(c.created_at);
      const now = new Date();
      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
    });
    downloadCSV(getExportableData(newCustomers), 'relatorio_novos_clientes');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-cantinho-terracotta border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestão de Clientes</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Clientes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {customers.filter(c => c.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Novos este Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {customers.filter(c => {
                const createdDate = new Date(c.created_at);
                const now = new Date();
                return createdDate.getMonth() === now.getMonth() && 
                       createdDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios de Clientes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={handleExportAll} className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Exportar Todos
          </Button>
          <Button onClick={handleExportActive} className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Exportar Ativos
          </Button>
          <Button onClick={handleExportNew} className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Exportar Novos do Mês
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Total Pedidos</TableHead>
                <TableHead>Concluídos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cadastrado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.email}</TableCell>
                  <TableCell>{customer.phone || 'N/A'}</TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>{customer.completedOrders}</TableCell>
                  <TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCustomers;
