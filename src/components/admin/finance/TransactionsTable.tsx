
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import TransactionsMobileView from "./transactions/TransactionsMobileView";
import TransactionsDesktopView from "./transactions/TransactionsDesktopView";

interface TransactionsTableProps {
  orders: any[];
}

const TransactionsTable = ({ orders }: TransactionsTableProps) => {
  const isMobile = useIsMobile();
  
  const recentTransactions = orders
    .filter(order => order.status !== "cancelled")
    .sort((a, b) => {
      const dateA = new Date(a.created_at || a.createdAt);
      const dateB = new Date(b.created_at || b.createdAt);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 20);

  if (recentTransactions.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-200">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-gray-100 rounded-full p-4">
              <Receipt className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Nenhuma transação</h3>
              <p className="text-gray-500 mt-1">
                Não há transações disponíveis para o período selecionado
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalValue = recentTransactions.reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3 bg-gradient-to-r from-cantinho-sky/5 to-cantinho-sage/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-cantinho-terracotta" />
            Histórico de Transações
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span className="font-medium">
              {recentTransactions.length} transações
            </span>
            <span className="text-gray-400">•</span>
            <span className="font-semibold text-cantinho-navy">
              {new Intl.NumberFormat("pt-AO", {
                style: "currency",
                currency: "AOA",
                minimumFractionDigits: 0,
              }).format(totalValue)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className={isMobile ? "p-3" : "p-0"}>
        {isMobile ? (
          <TransactionsMobileView transactions={recentTransactions} />
        ) : (
          <TransactionsDesktopView transactions={recentTransactions} />
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsTable;
