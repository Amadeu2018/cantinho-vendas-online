
import { useState } from "react";
import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Review } from "@/types/review";

type AddReviewFormProps = {
  dishId: number;
  onAddReview: (review: Review) => void;
};

const AddReviewForm = ({ dishId, onAddReview }: AddReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Por favor, selecione uma classificação");
      return;
    }
    
    if (!comment.trim()) {
      toast.error("Por favor, adicione um comentário");
      return;
    }
    
    if (!userName.trim()) {
      toast.error("Por favor, adicione seu nome");
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real application, this would be an API call
    setTimeout(() => {
      const newReview: Review = {
        id: Date.now().toString(),
        dishId,
        userName,
        rating,
        comment,
        date: new Date().toISOString(),
      };
      
      onAddReview(newReview);
      
      setRating(0);
      setComment("");
      setUserName("");
      setIsSubmitting(false);
      
      toast.success("Avaliação adicionada com sucesso!");
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sua classificação
        </label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <StarIcon
                className={`h-6 w-6 ${
                  (hoverRating || rating) >= star
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
          Nome
        </label>
        <Input
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Seu nome"
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Comentário
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Conte-nos o que achou desse prato..."
          className="w-full min-h-[100px]"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
      >
        {isSubmitting ? "Enviando..." : "Enviar avaliação"}
      </Button>
    </form>
  );
};

export default AddReviewForm;
