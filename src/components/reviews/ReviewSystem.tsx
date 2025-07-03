import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, MessageCircle, ThumbsUp, Flag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  helpful_count?: number;
  user_name?: string;
  order_id?: string;
}

interface ReviewSystemProps {
  productId?: string;
  orderId?: string;
  showAddReview?: boolean;
}

const ReviewSystem = ({ productId, orderId, showAddReview = false }: ReviewSystemProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [filter, setFilter] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, filter]);

  const fetchReviews = async () => {
    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (productId) {
        query = query.eq('product_id', productId);
      }

      if (filter !== 'all') {
        query = query.eq('rating', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para deixar uma avaliação",
        variant: "destructive"
      });
      return;
    }

    if (newReview.rating === 0) {
      toast({
        title: "Avaliação necessária",
        description: "Selecione uma classificação de 1 a 5 estrelas",
        variant: "destructive"
      });
      return;
    }

    try {
      const reviewData = {
        user_id: user.id,
        product_id: productId,
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        order_id: orderId
      };

      const { error } = await supabase
        .from('reviews')
        .insert([reviewData]);

      if (error) throw error;

      toast({
        title: "Avaliação enviada",
        description: "Obrigado pelo seu feedback!"
      });

      setNewReview({ rating: 0, comment: '' });
      setShowReviewForm(false);
      fetchReviews();
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua avaliação",
        variant: "destructive"
      });
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRatingChange?.(star)}
          />
        ))}
      </div>
    );
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-2 border-cantinho-terracotta border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {reviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Avaliações dos Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">{getAverageRating()}</div>
                <div className="flex justify-center my-2">
                  {renderStars(Math.round(parseFloat(getAverageRating().toString())))}
                </div>
                <p className="text-sm text-gray-600">{reviews.length} avaliações</p>
              </div>
              
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center space-x-2">
                    <span className="text-sm w-2">{rating}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 transition-all"
                        style={{ 
                          width: `${reviews.length > 0 ? (distribution[rating as keyof typeof distribution] / reviews.length) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm w-8 text-gray-600">
                      {distribution[rating as keyof typeof distribution]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Review Button/Form */}
      {showAddReview && (
        <Card>
          <CardHeader>
            <CardTitle>Deixe sua Avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            {!showReviewForm ? (
              <Button onClick={() => setShowReviewForm(true)}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Avaliar
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Classificação</label>
                  {renderStars(newReview.rating, true, (rating) => 
                    setNewReview(prev => ({ ...prev, rating }))
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Comentário (opcional)</label>
                  <Textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Conte-nos sobre sua experiência..."
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={submitReview}>
                    Enviar Avaliação
                  </Button>
                  <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filter Buttons */}
      {reviews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todas ({reviews.length})
          </Button>
          {[5, 4, 3, 2, 1].map(rating => (
            distribution[rating as keyof typeof distribution] > 0 && (
              <Button
                key={rating}
                variant={filter === rating ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(rating as 1 | 2 | 3 | 4 | 5)}
              >
                {rating} ⭐ ({distribution[rating as keyof typeof distribution]})
              </Button>
            )
          ))}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Ainda não há avaliações</p>
              <p className="text-sm text-gray-400 mt-1">Seja o primeiro a avaliar!</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map(review => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {review.user_name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {review.user_name || 'Cliente'}
                      </p>
                      <div className="flex items-center space-x-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(review.created_at), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {review.order_id && (
                    <Badge variant="outline" className="text-xs">
                      Compra verificada
                    </Badge>
                  )}
                </div>
                
                {review.comment && (
                  <p className="mt-3 text-gray-700">{review.comment}</p>
                )}
                
                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-gray-700">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Útil ({review.helpful_count || 0})</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-gray-700">
                    <Flag className="h-4 w-4" />
                    <span>Reportar</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;