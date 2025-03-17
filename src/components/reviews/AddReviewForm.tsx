
import { useState } from "react";
import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type AddReviewFormProps = {
  dishId: string | number;
  onAddReview: (review: { userName: string; rating: number; comment: string }) => void;
};

const AddReviewForm = ({ dishId, onAddReview }: AddReviewFormProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState(user?.email?.split('@')[0] || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
    
    try {
      await onAddReview({
        userName,
        rating,
        comment
      });
      
      // Limpar formulário apenas se bem-sucedido
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Erro ao adicionar avaliação:", error);
    } finally {
      setIsSubmitting(false);
    }
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
