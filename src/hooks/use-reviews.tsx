
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Review } from '@/types/review';

export const useReviews = (dishId: string | number) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState<number>(0);
  const { user } = useAuth();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('dish_id', dishId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform the data to match our Review type
      const formattedReviews: Review[] = data.map(review => ({
        id: review.id,
        dishId: review.dish_id,
        userName: review.user_name,
        rating: review.rating,
        comment: review.comment || '',
        date: review.created_at
      }));
      
      setReviews(formattedReviews);
      
      // Calculate average rating
      if (formattedReviews.length > 0) {
        const sum = formattedReviews.reduce((acc, review) => acc + review.rating, 0);
        setAverageRating(sum / formattedReviews.length);
      }
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (review: Omit<Review, 'id' | 'date' | 'dishId'>) => {
    if (!user) {
      toast.error('Você precisa estar logado para enviar uma avaliação');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          dish_id: dishId,
          user_id: user.id,
          user_name: review.userName,
          rating: review.rating,
          comment: review.comment
        })
        .select()
        .single();
        
      if (error) throw error;
      
      const newReview: Review = {
        id: data.id,
        dishId: data.dish_id,
        userName: data.user_name,
        rating: data.rating,
        comment: data.comment || '',
        date: data.created_at
      };
      
      setReviews([newReview, ...reviews]);
      
      // Update average rating
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0) + newReview.rating;
      setAverageRating(sum / (reviews.length + 1));
      
      toast.success('Avaliação adicionada com sucesso!');
      return newReview;
    } catch (error: any) {
      console.error('Error adding review:', error);
      toast.error(error.message);
      return null;
    }
  };

  useEffect(() => {
    if (dishId) {
      fetchReviews();
    }
  }, [dishId]);

  return {
    reviews,
    loading,
    averageRating,
    addReview,
    fetchReviews
  };
};
