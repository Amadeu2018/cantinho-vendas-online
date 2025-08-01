import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tag, Plus, Pencil, Trash2, Save, Calendar } from "lucide-react";

interface Promotion {
  id: string;
  product_id: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  products?: {
    name: string;
  };
}

const PromotionSettings = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    discount_percentage: "",
    start_date: "",
    end_date: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPromotions();
    fetchProducts();
  }, []);

  const fetchPromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select(`
          *,
          products:products!promotions_product_id_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromotions(data || []);
    } catch (error) {
      console.error('Erro ao buscar promoções:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as promoções",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const handleSave = async () => {
    if (!formData.product_id || !formData.discount_percentage || !formData.start_date || !formData.end_date) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      toast({
        title: "Datas inválidas",
        description: "A data de início deve ser anterior à data de fim",
        variant: "destructive"
      });
      return;
    }

    try {
      const promotionData = {
        product_id: formData.product_id,
        discount_percentage: parseFloat(formData.discount_percentage),
        start_date: formData.start_date,
        end_date: formData.end_date
      };

      if (editingId) {
        const { error } = await supabase
          .from('promotions')
          .update(promotionData)
          .eq('id', editingId);

        if (error) throw error;
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from('promotions')
          .insert(promotionData);

        if (error) throw error;
        setShowAddForm(false);
      }

      setFormData({ product_id: "", discount_percentage: "", start_date: "", end_date: "" });
      fetchPromotions();
      
      toast({
        title: "Sucesso",
        description: editingId ? "Promoção atualizada com sucesso" : "Promoção criada com sucesso"
      });
    } catch (error: any) {
      console.error('Erro ao salvar promoção:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a promoção",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingId(promotion.id);
    setFormData({
      product_id: promotion.product_id,
      discount_percentage: promotion.discount_percentage.toString(),
      start_date: promotion.start_date.split('T')[0],
      end_date: promotion.end_date.split('T')[0]
    });
    setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchPromotions();
      toast({
        title: "Sucesso",
        description: "Promoção removida com sucesso"
      });
    } catch (error: any) {
      console.error('Erro ao remover promoção:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a promoção",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const isPromotionActive = (promotion: Promotion) => {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Configurações de Promoções
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Promotion Button */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Promoções Ativas</h3>
          <Button
            onClick={() => {
              setShowAddForm(true);
              setEditingId(null);
              setFormData({ product_id: "", discount_percentage: "", start_date: "", end_date: "" });
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Promoção
          </Button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingId) && (
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product_id">Produto *</Label>
                  <Select
                    value={formData.product_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, product_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount_percentage">Desconto (%) *</Label>
                  <Input
                    id="discount_percentage"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: e.target.value }))}
                    placeholder="Ex: 20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_date">Data de Início *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">Data de Fim *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingId ? "Atualizar" : "Criar"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setFormData({ product_id: "", discount_percentage: "", start_date: "", end_date: "" });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Promotions List */}
        <div className="space-y-3">
          {promotions.map((promotion) => (
            <Card key={promotion.id} className={`border-l-4 ${isPromotionActive(promotion) ? 'border-l-green-500' : 'border-l-gray-400'}`}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-lg">
                        {promotion.products?.name || 'Produto não encontrado'}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isPromotionActive(promotion) 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isPromotionActive(promotion) ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    <p className="text-cantinho-terracotta font-semibold text-lg">
                      {promotion.discount_percentage}% de desconto
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(promotion.start_date)} - {formatDate(promotion.end_date)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(promotion)}
                      className="flex items-center gap-1"
                    >
                      <Pencil className="h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(promotion.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                      Remover
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {promotions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Tag className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma promoção configurada</p>
            <p className="text-sm">Clique em "Nova Promoção" para criar uma</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromotionSettings;