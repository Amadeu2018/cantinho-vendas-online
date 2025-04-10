
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Review } from '@/types/review';

export const useReviews = (dishId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Handle potential non-UUID dishId (causing the error in console)
      if (!dishId || typeof dishId !== 'string' || dishId.length < 32) {
        console.log("Invalid dishId format for database query:", dishId);
        setReviews([]);
        setAverageRating(0);
        setLoading(false);
        return;
      }
      
      // Fetch reviews from the reviews table
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', dishId);
      
      if (error) throw error;
      
      // Convert to our Review type
      const convertedReviews: Review[] = data?.map((review: any) => ({
        id: review.id,
        dishId: review.product_id,
        userName: review.user_id || 'Anonymous', // We'll need to fetch actual user names in a real app
        rating: review.rating,
        comment: review.comment || '',
        date: new Date(review.created_at).toISOString()
      })) || [];
      
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
        toast({
          title: 'Erro ao carregar avaliações',
          description: error.message,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (rating: number, comment: string, userName: string) => {
    try {
      // Validate dishId format before trying to add review
      if (!dishId || typeof dishId !== 'string' || dishId.length < 32) {
        toast({
          title: 'Erro ao adicionar avaliação',
          description: 'ID do produto inválido',
          variant: 'destructive',
        });
        return;
      }
      
      // Add review to the reviews table
      const { error } = await supabase
        .from('reviews')
        .insert({
          product_id: dishId,
          rating: rating,
          comment: comment,
          user_id: userName // In a real app, this would be the authenticated user's ID
        });
      
      if (error) throw error;
      
      // After adding the review, refresh the list
      fetchReviews();
      
      toast({
        title: 'Avaliação adicionada',
        description: 'Obrigado pela sua avaliação!',
      });
    } catch (error: any) {
      console.error('Error adding review:', error);
      toast({
        title: 'Erro ao adicionar avaliação',
        description: error.message,
        variant: 'destructive',
      });
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
