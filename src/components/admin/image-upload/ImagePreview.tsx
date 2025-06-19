
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  onRemove: () => void;
  disabled?: boolean;
}

const ImagePreview = ({ imageUrl, onRemove, disabled }: ImagePreviewProps) => {
  return (
    <div className="relative w-40 h-40 border rounded-md overflow-hidden">
      <img 
        src={imageUrl} 
        alt="Preview" 
        className="w-full h-full object-cover"
        onError={onRemove}
      />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 rounded-full"
        onClick={onRemove}
        disabled={disabled}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ImagePreview;
