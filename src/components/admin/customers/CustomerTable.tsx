
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Phone, MoreVertical, Eye, Mail, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";
import CustomerCard from "./CustomerCard";

interface CustomerTableProps {
  customers: any[];
  sortOrder: string;
  setSortOrder: (order: string) => void;
}

const CustomerTable = ({ customers, sortOrder, setSortOrder }: CustomerTableProps) => {
  const isMobile = useIsMobile();

  if (customers.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-200">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-gray-100 rounded-full p-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Nenhum cliente encontrado</h3>
              <p className="text-gray-500 mt-1">
                Tente ajustar os filtros de busca
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3 bg-gradient-to-r from-cantinho-sky/5 to-cantinho-sage/5 border-b border-gray-100">
        <CardTitle className="flex items-center justify-between">
          <span className="text-base sm:text-lg text-gray-900">Lista de Clientes ({customers.length})</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="border-gray-300 hover:bg-gray-50"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? "p-3" : "p-0"}>
        {isMobile ? (
          <div className="grid gap-3">
            {customers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-gray-50/50">
                <TableHead className="font-semibold text-gray-900">Cliente</TableHead>
                <TableHead className="font-semibold text-gray-900">Contacto</TableHead>
                <TableHead className="text-center font-semibold text-gray-900">Pedidos</TableHead>
                <TableHead className="text-center font-semibold text-gray-900">Concluídos</TableHead>
                <TableHead className="text-right font-semibold text-gray-900">Total Gasto</TableHead>
                <TableHead className="text-center font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-semibold text-gray-900">Cadastrado</TableHead>
                <TableHead className="font-semibold text-gray-900">Último Pedido</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-cantinho-sage" />
                      <span className="text-gray-700">{customer.phone || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium text-cantinho-navy">{customer.totalOrders}</TableCell>
                  <TableCell className="text-center text-gray-700">{customer.completedOrders}</TableCell>
                  <TableCell className="text-right font-medium text-cantinho-terracotta">
                    {new Intl.NumberFormat("pt-AO", {
                      style: "currency",
                      currency: "AOA",
                      minimumFractionDigits: 0,
                    }).format(customer.totalSpent || 0)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={customer.status === 'active' ? 'default' : 'secondary'}
                      className={customer.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}
                    >
                      {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDistanceToNow(new Date(customer.created_at), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </TableCell>
                  <TableCell className="text-gray-600">
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
                        <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-gray-200 shadow-lg">
                        <DropdownMenuItem className="hover:bg-gray-50">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-gray-50">
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
  );
};

export default CustomerTable;
