
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Review } from '@/types/review';
import { useAuth } from '@/contexts/AuthContext';

export const useReviews = (dishId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const { user } = useAuth();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Check if dishId is valid
      const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dishId);
      
      if (!dishId || !isValidUuid) {
        console.log("Invalid dishId format for database query:", dishId);
        setReviews([]);
        setAverageRating(0);
        setLoading(false);
        return;
      }
      
      // Fetch reviews from the reviews table
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(email)')
        .eq('product_id', dishId);
      
      if (error) throw error;
      
      console.log("Fetched reviews:", data);
      
      // Convert to our Review type
      const convertedReviews: Review[] = data?.map((review: any) => {
        // Get username from profile email or fallback to user_id
        const userName = review.profiles?.email 
          ? review.profiles.email.split('@')[0] 
          : (review.user_id || 'Anônimo');
          
        return {
          id: review.id,
          dishId: review.product_id,
          userName: userName,
          rating: review.rating,
          comment: review.comment || '',
          date: new Date(review.created_at).toISOString()
        };
      }) || [];
      
      setReviews(convertedReviews);
      
      // Calculate average rating
      if (convertedReviews.length > 0) {
        const total = convertedReviews.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating(Math.round((total / convertedReviews.length) * 10) / 10);
      } else {
        setAverageRating(0);
      }
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      // Don't show toast for expected errors with non-UUID dishIds
      if (!error.message.includes("invalid input syntax for type uuid")) {
        toast.error('Erro ao carregar avaliações: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (rating: number, comment: string, userName: string) => {
    try {
      // Validate dishId format before trying to add review
      const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dishId);
      
      if (!dishId || !isValidUuid) {
        toast.error('ID do produto inválido');
        return;
      }
      
      // Add review to the reviews table
      const { error } = await supabase
        .from('reviews')
        .insert({
          product_id: dishId,
          rating: rating,
          comment: comment,
          user_id: user?.id || 'anonymous' // Use authenticated user ID if available
        });
      
      if (error) throw error;
      
      // After adding the review, refresh the list
      fetchReviews();
      
      toast.success('Obrigado pela sua avaliação!');
    } catch (error: any) {
      console.error('Error adding review:', error);
      toast.error('Erro ao adicionar avaliação: ' + error.message);
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
    fetchReviews,
  };
};
