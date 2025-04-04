
import { useState } from 'react';
import { useReviews } from '@/hooks/use-reviews';
import ReviewsList from './ReviewsList';
import AddReviewForm from './AddReviewForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface DishReviewsProps {
  dishId: string;
  dishName?: string;
}

const DishReviews = ({ dishId, dishName }: DishReviewsProps) => {
  const { reviews, loading, averageRating, addReview } = useReviews(dishId);
  const [showAddReview, setShowAddReview] = useState(false);

  const handleAddReview = (reviewData: { userName: string; rating: number; comment: string }) => {
    addReview(reviewData.rating, reviewData.comment, reviewData.userName);
    setShowAddReview(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Carregando avaliações...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Avaliações</CardTitle>
          <div className="flex items-center space-x-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({reviews.length})</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.length > 0 ? (
          <ReviewsList reviews={reviews} dishId={dishId} />
        ) : (
          <p className="text-center py-4 text-gray-500">
            Ainda não há avaliações para este prato.
          </p>
        )}

        {showAddReview ? (
          <div className="mt-6">
            <AddReviewForm 
              dishId={dishId}
              onAddReview={handleAddReview}
              onCancel={() => setShowAddReview(false)} 
            />
          </div>
        ) : (
          <div className="flex justify-center mt-4">
            <Button 
              onClick={() => setShowAddReview(true)}
              variant="outline"
            >
              Adicionar Avaliação
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DishReviews;
