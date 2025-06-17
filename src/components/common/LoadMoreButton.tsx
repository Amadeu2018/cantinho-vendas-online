
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";

interface LoadMoreButtonProps {
  onClick: () => void;
  loading: boolean;
  hasMore: boolean;
  totalCount?: number;
  currentCount: number;
}

const LoadMoreButton = ({ 
  onClick, 
  loading, 
  hasMore, 
  totalCount, 
  currentCount 
}: LoadMoreButtonProps) => {
  if (!hasMore) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">
          {totalCount ? `${currentCount} de ${totalCount} pratos carregados` : 'Todos os pratos foram carregados'}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <Button
        onClick={onClick}
        disabled={loading}
        variant="outline"
        size="lg"
        className="px-8 py-3 border-2 border-cantinho-terracotta text-cantinho-terracotta hover:bg-cantinho-terracotta hover:text-white transition-all duration-300"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Carregando...
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4 mr-2" />
            Carregar mais pratos
          </>
        )}
      </Button>
      {totalCount && (
        <p className="text-gray-500 text-sm mt-2">
          {currentCount} de {totalCount} pratos
        </p>
      )}
    </div>
  );
};

export default LoadMoreButton;
