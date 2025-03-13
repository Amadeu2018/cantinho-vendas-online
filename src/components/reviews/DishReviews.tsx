
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, Star } from "lucide-react";
import ReviewsList from "./ReviewsList";
import AddReviewForm from "./AddReviewForm";
import { Review } from "@/types/review";

type DishReviewsProps = {
  dishId: number;
  dishName: string;
};

// Dados fictícios para demonstração
const MOCK_REVIEWS: Record<number, Review[]> = {
  1: [
    {
      id: "1",
      dishId: 1,
      userName: "António Ferreira",
      rating: 5,
      comment: "Os pastéis de bacalhau são os melhores que já provei em Angola! Muito bem temperados e com um sabor que me faz lembrar Portugal.",
      date: "2023-10-15T14:30:00Z"
    },
    {
      id: "2",
      dishId: 1,
      userName: "Maria Sousa",
      rating: 4,
      comment: "Deliciosos e autênticos! Poderiam ser um pouco maiores.",
      date: "2023-11-20T09:15:00Z"
    }
  ],
  4: [
    {
      id: "3",
      dishId: 4,
      userName: "Pedro Costa",
      rating: 5,
      comment: "O melhor Bacalhau à Brás que já comi fora de Portugal! Recomendo a todos!",
      date: "2023-09-05T18:45:00Z"
    }
  ],
  9: [
    {
      id: "4",
      dishId: 9,
      userName: "Carla Santos",
      rating: 5,
      comment: "Pastéis de nata incríveis! Sabor autêntico e massa folhada perfeita.",
      date: "2023-12-01T16:20:00Z"
    }
  ]
};

const DishReviews = ({ dishId, dishName }: DishReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS[dishId] || []);
  const [isAddingReview, setIsAddingReview] = useState(false);
  
  const averageRating = reviews.length 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";
  
  const handleAddReview = (newReview: Review) => {
    setReviews(prev => [newReview, ...prev]);
    setIsAddingReview(false);
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
                <span className="text-sm ml-1">{averageRating}</span>
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
                        <span className="text-xl font-bold ml-1">{averageRating}</span>
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
              
              <ReviewsList reviews={reviews} dishId={dishId} />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DishReviews;
