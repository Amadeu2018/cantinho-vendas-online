
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Review } from "@/types/review";

type ReviewsListProps = {
  reviews: Review[];
  dishId: number;
};

const ReviewsList = ({ reviews, dishId }: ReviewsListProps) => {
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
  const [likedReviews, setLikedReviews] = useState<string[]>([]);
  const [dislikedReviews, setDislikedReviews] = useState<string[]>([]);

  const toggleExpand = (reviewId: string) => {
    setExpandedReviews(prev =>
      prev.includes(reviewId)
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const handleLike = (reviewId: string) => {
    if (likedReviews.includes(reviewId)) {
      setLikedReviews(prev => prev.filter(id => id !== reviewId));
    } else {
      setLikedReviews(prev => [...prev, reviewId]);
      setDislikedReviews(prev => prev.filter(id => id !== reviewId));
    }
  };

  const handleDislike = (reviewId: string) => {
    if (dislikedReviews.includes(reviewId)) {
      setDislikedReviews(prev => prev.filter(id => id !== reviewId));
    } else {
      setDislikedReviews(prev => [...prev, reviewId]);
      setLikedReviews(prev => prev.filter(id => id !== reviewId));
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-4">
        <MessageCircle className="h-8 w-8 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-500">Sem avaliações ainda. Seja o primeiro a avaliar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-2">
      {reviews.map((review) => (
        <Card key={review.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{review.userName}</p>
                <div className="flex items-center mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-2 ${likedReviews.includes(review.id) ? "text-green-500" : ""}`}
                  onClick={() => handleLike(review.id)}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-2 ${dislikedReviews.includes(review.id) ? "text-red-500" : ""}`}
                  onClick={() => handleDislike(review.id)}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className={`mt-2 text-gray-700 text-sm ${
              !expandedReviews.includes(review.id) && review.comment.length > 120
                ? "line-clamp-2"
                : ""
            }`}>
              {review.comment}
            </p>
            {review.comment.length > 120 && (
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto mt-1 text-cantinho-terracotta"
                onClick={() => toggleExpand(review.id)}
              >
                {expandedReviews.includes(review.id) ? "Ver menos" : "Ver mais"}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReviewsList;
