import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Promotion {
  id: string;
  product_id: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  created_at: string;
  products?: {
    name: string;
    price: number;
  };
}

const PromotionsManager = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("promotions")
        .select(`
          *,
          products(name, price)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPromotions(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar promoções:", error);
      toast({
        title: "Erro ao carregar promoções",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestão de Promoções</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Promoção
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promoções Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin h-6 w-6 border-4 border-primary border-opacity-50 border-t-primary rounded-full"></div>
            </div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma promoção encontrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Produto</th>
                    <th className="text-left py-2">Desconto</th>
                    <th className="text-left py-2">Início</th>
                    <th className="text-left py-2">Fim</th>
                    <th className="text-right py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((promotion) => (
                    <tr key={promotion.id} className="border-b">
                      <td className="py-2">
                        {promotion.products?.name || "Produto não encontrado"}
                      </td>
                      <td className="py-2">
                        {promotion.discount_percentage}%
                      </td>
                      <td className="py-2">
                        {new Date(promotion.start_date).toLocaleDateString()}
                      </td>
                      <td className="py-2">
                        {new Date(promotion.end_date).toLocaleDateString()}
                      </td>
                      <td className="py-2">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromotionsManager;