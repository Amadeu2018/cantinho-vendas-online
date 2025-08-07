import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Edit, Trash2, Eye, CalendarIcon, TrendingUp, Percent, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Promotion {
  id: string;
  product_id: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  created_at: string;
  promotion_type: string;
  min_quantity: number;
  products?: {
    name: string;
    price: number;
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
}

const PromotionsManager = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  
  // Form state
  const [formData, setFormData] = useState({
    product_id: "",
    discount_percentage: "",
    promotion_type: "percentage",
    min_quantity: "1",
    start_date: new Date(),
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchPromotions();
    fetchProducts();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      console.log("🎯 Carregando promoções...");
      
      const { data, error } = await supabase
        .from("promotions")
        .select(`
          *,
          products(name, price)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Erro ao carregar promoções:", error);
        throw error;
      }
      
      console.log("✅ Promoções carregadas:", data?.length || 0);
      setPromotions(data || []);
    } catch (error: any) {
      console.error("❌ Erro ao carregar promoções:", error);
      toast({
        title: "Erro ao carregar promoções",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      console.log("📦 Carregando produtos...");
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price")
        .order("name");

      if (error) throw error;
      console.log("✅ Produtos carregados:", data?.length || 0);
      setProducts(data || []);
    } catch (error: any) {
      console.error("❌ Erro ao carregar produtos:", error);
    }
  };

  const handleCreatePromotion = async () => {
    try {
      if (!formData.product_id || !formData.discount_percentage) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive"
        });
        return;
      }

      const promotionData = {
        product_id: formData.product_id,
        discount_percentage: parseFloat(formData.discount_percentage),
        promotion_type: formData.promotion_type,
        min_quantity: parseInt(formData.min_quantity),
        start_date: formData.start_date.toISOString(),
        end_date: formData.end_date.toISOString()
      };

      const { data, error } = await supabase
        .from("promotions")
        .insert([promotionData])
        .select(`
          *,
          products(name, price)
        `);

      if (error) throw error;

      setPromotions([...(data || []), ...promotions]);
      resetForm();
      setActiveTab("list");
      
      toast({
        title: "Promoção criada",
        description: "Promoção criada com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao criar promoção",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdatePromotion = async () => {
    if (!editingPromotion) return;

    try {
      const promotionData = {
        product_id: formData.product_id,
        discount_percentage: parseFloat(formData.discount_percentage),
        promotion_type: formData.promotion_type,
        min_quantity: parseInt(formData.min_quantity),
        start_date: formData.start_date.toISOString(),
        end_date: formData.end_date.toISOString()
      };

      const { data, error } = await supabase
        .from("promotions")
        .update(promotionData)
        .eq("id", editingPromotion.id)
        .select(`
          *,
          products(name, price)
        `);

      if (error) throw error;

      setPromotions(promotions.map(p => 
        p.id === editingPromotion.id ? (data?.[0] || p) : p
      ));
      
      resetForm();
      setActiveTab("list");
      
      toast({
        title: "Promoção atualizada",
        description: "Promoção atualizada com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar promoção",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeletePromotion = async (id: string) => {
    try {
      const { error } = await supabase
        .from("promotions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setPromotions(promotions.filter(p => p.id !== id));
      toast({
        title: "Promoção excluída",
        description: "Promoção excluída com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir promoção",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      product_id: promotion.product_id,
      discount_percentage: promotion.discount_percentage.toString(),
      promotion_type: promotion.promotion_type,
      min_quantity: promotion.min_quantity.toString(),
      start_date: new Date(promotion.start_date),
      end_date: new Date(promotion.end_date)
    });
    setActiveTab("form");
  };

  const resetForm = () => {
    setFormData({
      product_id: "",
      discount_percentage: "",
      promotion_type: "percentage",
      min_quantity: "1",
      start_date: new Date(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    setEditingPromotion(null);
    setIsCreating(false);
  };

  const getPromotionStatus = (promotion: Promotion) => {
    const now = new Date();
    const start = new Date(promotion.start_date);
    const end = new Date(promotion.end_date);

    if (now < start) return { status: "pending", label: "Agendada", variant: "secondary" as const };
    if (now > end) return { status: "expired", label: "Expirada", variant: "outline" as const };
    return { status: "active", label: "Ativa", variant: "default" as const };
  };

  const activePromotions = promotions.filter(p => {
    const { status } = getPromotionStatus(p);
    return status === "active";
  });

  const upcomingPromotions = promotions.filter(p => {
    const { status } = getPromotionStatus(p);
    return status === "pending";
  });

  const expiredPromotions = promotions.filter(p => {
    const { status } = getPromotionStatus(p);
    return status === "expired";
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Gift className="h-6 w-6 text-primary" />
          Gestão de Promoções
        </h2>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{promotions.length}</p>
              </div>
              <Gift className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ativas</p>
                <p className="text-2xl font-bold text-green-600">{activePromotions.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Agendadas</p>
                <p className="text-2xl font-bold text-orange-600">{upcomingPromotions.length}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiradas</p>
                <p className="text-2xl font-bold text-gray-600">{expiredPromotions.length}</p>
              </div>
              <Percent className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Lista de Promoções</TabsTrigger>
          <TabsTrigger value="form">
            {editingPromotion ? "Editar Promoção" : "Nova Promoção"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { resetForm(); setActiveTab("form"); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Promoção
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Promoções</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin h-6 w-6 border-4 border-primary border-opacity-50 border-t-primary rounded-full"></div>
                </div>
              ) : promotions.length === 0 ? (
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Nenhuma promoção encontrada</p>
                  <Button onClick={() => { resetForm(); setActiveTab("form"); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar primeira promoção
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Produto</th>
                        <th className="text-left py-2">Desconto</th>
                        <th className="text-left py-2">Tipo</th>
                        <th className="text-left py-2">Início</th>
                        <th className="text-left py-2">Fim</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-right py-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promotions.map((promotion) => {
                        const { label, variant } = getPromotionStatus(promotion);
                        return (
                          <tr key={promotion.id} className="border-b">
                            <td className="py-2">
                              {promotion.products?.name || "Produto não encontrado"}
                            </td>
                            <td className="py-2 font-semibold text-green-600">
                              {promotion.discount_percentage}%
                            </td>
                            <td className="py-2 capitalize">
                              {promotion.promotion_type}
                            </td>
                            <td className="py-2">
                              {format(new Date(promotion.start_date), "dd/MM/yyyy", { locale: pt })}
                            </td>
                            <td className="py-2">
                              {format(new Date(promotion.end_date), "dd/MM/yyyy", { locale: pt })}
                            </td>
                            <td className="py-2">
                              <Badge variant={variant}>{label}</Badge>
                            </td>
                            <td className="py-2">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditPromotion(promotion)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDeletePromotion(promotion.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingPromotion ? "Editar Promoção" : "Nova Promoção"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Produto</Label>
                  <Select
                    value={formData.product_id}
                    onValueChange={(value) => setFormData({...formData, product_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - €{product.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">Desconto (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({...formData, discount_percentage: e.target.value})}
                    placeholder="Ex: 20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Promoção</Label>
                  <Select
                    value={formData.promotion_type}
                    onValueChange={(value) => setFormData({...formData, promotion_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentual</SelectItem>
                      <SelectItem value="fixed">Valor Fixo</SelectItem>
                      <SelectItem value="combo">Combo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade Mínima</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.min_quantity}
                    onChange={(e) => setFormData({...formData, min_quantity: e.target.value})}
                    placeholder="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Data de Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.start_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.start_date ? (
                          format(formData.start_date, "dd/MM/yyyy", { locale: pt })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.start_date}
                        onSelect={(date) => date && setFormData({...formData, start_date: date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Data de Fim</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.end_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.end_date ? (
                          format(formData.end_date, "dd/MM/yyyy", { locale: pt })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.end_date}
                        onSelect={(date) => date && setFormData({...formData, end_date: date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={editingPromotion ? handleUpdatePromotion : handleCreatePromotion}
                  className="flex-1"
                >
                  {editingPromotion ? "Atualizar Promoção" : "Criar Promoção"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => { resetForm(); setActiveTab("list"); }}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromotionsManager;