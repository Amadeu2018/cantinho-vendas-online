
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt } from "lucide-react";
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
      <Card>
        <CardContent className="p-8 text-center">
          <Receipt className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">Nenhuma transação</h3>
          <p className="text-muted-foreground">Não há transações disponíveis para o período selecionado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <Receipt className="h-4 w-4 sm:h-5 sm:w-5" />
          Histórico de Transações
        </CardTitle>
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
