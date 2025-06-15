
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Mail, Phone, Calendar, MoreVertical, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CustomerCardProps {
  customer: any;
}

const CustomerCard = ({ customer }: CustomerCardProps) => (
  <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-gray-200 bg-white">
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Mail className="h-4 w-4 text-cantinho-terracotta flex-shrink-0" />
            <p className="font-medium text-sm truncate text-gray-900">{customer.email}</p>
          </div>
          {customer.phone && (
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4 text-cantinho-sage flex-shrink-0" />
              <p className="text-sm text-gray-600">{customer.phone}</p>
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
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
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="text-center p-3 bg-gradient-to-br from-cantinho-navy/5 to-cantinho-navy/10 rounded-lg border border-cantinho-navy/10">
          <p className="text-lg font-bold text-cantinho-navy">{customer.totalOrders}</p>
          <p className="text-xs text-gray-600">Pedidos</p>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-cantinho-terracotta/5 to-cantinho-terracotta/10 rounded-lg border border-cantinho-terracotta/10">
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
        <Badge 
          variant={customer.status === 'active' ? 'default' : 'secondary'} 
          className={`text-xs ${customer.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}
        >
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

export default CustomerCard;
