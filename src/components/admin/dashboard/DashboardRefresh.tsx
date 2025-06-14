
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface DashboardRefreshProps {
  onRefresh: () => Promise<void>;
}

const DashboardRefresh = ({ onRefresh }: DashboardRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await onRefresh();
      toast({
        title: "Dados atualizados",
        description: "Dashboard atualizado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar os dados",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return { handleRefresh, isRefreshing };
};

export default DashboardRefresh;
