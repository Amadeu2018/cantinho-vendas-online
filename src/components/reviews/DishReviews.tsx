
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, Star } from "lucide-react";
import ReviewsList from "./ReviewsList";
import AddReviewForm from "./AddReviewForm";
import { useReviews } from "@/hooks/use-reviews";

type DishReviewsProps = {
  dishId: string | number;
  dishName: string;
};

const DishReviews = ({ dishId, dishName }: DishReviewsProps) => {
  const [isAddingReview, setIsAddingReview] = useState(false);
  const { reviews, loading, averageRating, addReview } = useReviews(dishId);
  
  const handleAddReview = async (reviewData: any) => {
    const result = await addReview(reviewData);
    if (result) {
      setIsAddingReview(false);
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-gray-600 hover:text-cantinho-terracotta hover:bg-cantinho-terracotta/10 w-full justify-start p-2"
        >
          <div className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            <span className="font-medium">{reviews.length} avaliações</span>
            {reviews.length > 0 && (
              <div className="flex items-center ml-2">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm ml-1">{averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Avaliações para {dishName}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-4 mt-4">
          {isAddingReview ? (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Adicionar avaliação</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAddingReview(false)}
                >
                  Cancelar
                </Button>
              </div>
              <AddReviewForm dishId={dishId} onAddReview={handleAddReview} />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {reviews.length > 0 && (
                    <>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xl font-bold ml-1">{averageRating.toFixed(1)}</span>
                      </div>
                      <span className="text-gray-500 ml-2">
                        ({reviews.length} {reviews.length === 1 ? "avaliação" : "avaliações"})
                      </span>
                    </>
                  )}
                </div>
                <Button 
                  onClick={() => setIsAddingReview(true)}
                  className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
                >
                  Avaliar
                </Button>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <p>Carregando avaliações...</p>
                </div>
              ) : (
                <ReviewsList reviews={reviews} dishId={dishId.toString()} />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DishReviews;
