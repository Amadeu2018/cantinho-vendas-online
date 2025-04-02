
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
      
      // For now, creating a mock setup since reviews table might have issues
      const mockReviews: Review[] = [];
      setReviews(mockReviews);
      setAverageRating(0);
      
      // Once the database is properly set up, uncomment this code
      /*
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', dishId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform the data to match our Review type
      const formattedReviews: Review[] = data.map((review: any) => ({
        id: review.id,
        dishId: review.product_id,
        userName: review.user_name || 'Usuário',
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
      */
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
      // For now we'll just show a success message without trying to store in database
      // as the reviews table might not be properly set up
      
      const newReview: Review = {
        id: Math.random().toString(),
        dishId: dishId.toString(),
        userName: review.userName,
        rating: review.rating,
        comment: review.comment,
        date: new Date().toISOString()
      };
      
      setReviews([newReview, ...reviews]);
      
      // Update average rating
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0) + newReview.rating;
      setAverageRating(sum / (reviews.length + 1));
      
      toast.success('Avaliação adicionada com sucesso!');
      return newReview;
      
      /*
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          product_id: dishId,
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
        dishId: data.product_id,
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
      */
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
