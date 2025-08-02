import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Percent, Calendar, Tag, Edit, Trash2 } from "lucide-react";
import PromotionForm from "./PromotionForm";

interface Promotion {
  id: string;
  product_id?: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  min_quantity?: number;
  promotion_type: string;
  applies_to_category_id?: string;
  products?: { name: string };
  categories?: { name: string };
}

const PromotionsManager = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [promotionsData, productsData, categoriesData] = await Promise.all([
        supabase
          .from("promotions")
          .select(`
            *,
            products(name),
            categories(name)
          `)
          .order("created_at", { ascending: false }),
        supabase
          .from("products")
          .select("id, name")
          .order("name"),
        supabase
          .from("categories")
          .select("id, name")
          .order("name")
      ]);

      if (promotionsData.error) throw promotionsData.error;
      if (productsData.error) throw productsData.error;
      if (categoriesData.error) throw categoriesData.error;

      setPromotions(promotionsData.data || []);
      setProducts(productsData.data || []);
      setCategories(categoriesData.data || []);
    } catch (error: any) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as promoções",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePromotion = async (formData: any) => {
    try {
      if (editingPromotion) {
        const { error } = await supabase
          .from("promotions")
          .update(formData)
          .eq("id", editingPromotion.id);
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Promoção atualizada com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from("promotions")
          .insert([formData]);
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Promoção criada com sucesso!",
        });
      }
      
      setShowForm(false);
      setEditingPromotion(null);
      fetchData();
    } catch (error: any) {
      console.error("Erro ao salvar promoção:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar a promoção",
        variant: "destructive",
      });
    }
  };

  const handleDeletePromotion = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta promoção?")) return;

    try {
      const { error } = await supabase
        .from("promotions")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Promoção deletada com sucesso!",
      });
      
      fetchData();
    } catch (error: any) {
      console.error("Erro ao deletar promoção:", error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar a promoção",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isActive = (promotion: Promotion) => {
    const now = new Date();
    const start = new Date(promotion.start_date);
    const end = new Date(promotion.end_date);
    return now >= start && now <= end;
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
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sistema de Promoções</h2>
          <p className="text-gray-600">Gerencie descontos e ofertas especiais</p>
        </div>
        <Button
          onClick={() => {
            setEditingPromotion(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Promoção
        </Button>
      </div>

      {showForm && (
        <PromotionForm
          promotion={editingPromotion}
          products={products}
          categories={categories}
          onSave={handleSavePromotion}
          onCancel={() => {
            setShowForm(false);
            setEditingPromotion(null);
          }}
        />
      )}

      <div className="grid gap-4">
        {promotions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Percent className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Nenhuma promoção criada ainda</p>
              <p className="text-sm text-gray-400 mt-1">Crie promoções para aumentar suas vendas</p>
            </CardContent>
          </Card>
        ) : (
          promotions.map((promotion) => (
            <Card key={promotion.id} className={`border-l-4 ${isActive(promotion) ? 'border-l-green-500' : 'border-l-gray-300'}`}>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive(promotion) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                      <Percent className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {promotion.discount_percentage}% de desconto
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {isActive(promotion) ? (
                          <Badge className="bg-green-100 text-green-700 border-green-300">
                            Ativa
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-600">
                            Inativa
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {promotion.promotion_type === 'percentage' ? 'Percentual' : 'Fixo'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPromotion(promotion);
                        setShowForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePromotion(promotion.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {formatDate(promotion.start_date)} - {formatDate(promotion.end_date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {promotion.products?.name || promotion.categories?.name || 'Geral'}
                    </span>
                  </div>
                  {promotion.min_quantity && (
                    <div className="text-gray-600">
                      Mín. {promotion.min_quantity} itens
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PromotionsManager;