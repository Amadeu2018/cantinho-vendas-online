
import React from "react";
import { Activity } from "lucide-react";

const EmptyChartsState = () => {
  return (
    <div className="p-8 text-center">
      <Activity className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
      <h3 className="mt-4 text-lg font-medium">Nenhum dado disponível</h3>
      <p className="text-muted-foreground">Não há pedidos para gerar gráficos no período selecionado</p>
    </div>
  );
};

export default EmptyChartsState;
