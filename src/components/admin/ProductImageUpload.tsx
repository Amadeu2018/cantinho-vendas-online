
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ImagePlus, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
  disabled?: boolean;
}

const ProductImageUpload = ({ currentImageUrl, onImageChange, disabled }: ProductImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(currentImageUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(currentImageUrl || "");
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const { toast } = useToast();

  const uploadImageToStorage = async (file: File): Promise<string> => {
    try {
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      let bucketName = 'product-images';
      
      if (!buckets?.some(b => b.name === bucketName) || bucketError) {
        console.log("Creating product-images bucket");
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
        
        if (createError) {
          console.error("Error creating bucket:", createError);
          throw createError;
        }
      }
      
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
      
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image to storage:", error);
      toast({
        title: "Erro ao fazer upload da imagem",
        description: "Não foi possível salvar a imagem. Usando imagem de placeholder.",
        variant: "destructive"
      });
      return '/placeholder.svg';
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setImageFile(file);
    setImageUploading(true);
    
    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Upload to storage
      const uploadedUrl = await uploadImageToStorage(file);
      onImageChange(uploadedUrl);
      
      toast({
        title: "Imagem carregada",
        description: "A imagem foi carregada com sucesso.",
      });
    } catch (error) {
      console.error("Error handling file upload:", error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer o upload da imagem.",
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setImagePreview(urlInput);
      onImageChange(urlInput);
      toast({
        title: "URL da imagem definida",
        description: "A URL da imagem foi definida com sucesso.",
      });
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setUrlInput("");
    onImageChange("");
  };

  return (
    <div className="space-y-4">
      <Label>Imagem do Produto</Label>
      
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          variant={uploadMode === "file" ? "default" : "outline"}
          size="sm"
          onClick={() => setUploadMode("file")}
          disabled={disabled}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload de Arquivo
        </Button>
        <Button
          type="button"
          variant={uploadMode === "url" ? "default" : "outline"}
          size="sm"
          onClick={() => setUploadMode("url")}
          disabled={disabled}
        >
          <ImagePlus className="h-4 w-4 mr-2" />
          URL da Imagem
        </Button>
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="relative w-40 h-40 border rounded-md overflow-hidden">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-full h-full object-cover"
            onError={() => {
              setImagePreview(null);
              toast({
                title: "Erro ao carregar imagem",
                description: "Não foi possível carregar a imagem.",
                variant: "destructive",
              });
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 rounded-full"
            onClick={removeImage}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Upload Mode: File */}
      {uploadMode === "file" && !imagePreview && (
        <div className="flex items-center">
          <Label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
          >
            {imageUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            ) : (
              <>
                <ImagePlus className="h-8 w-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500 text-center">
                  Clique para selecionar arquivo
                </span>
              </>
            )}
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={imageUploading || disabled}
            />
          </Label>
        </div>
      )}

      {/* Upload Mode: URL */}
      {uploadMode === "url" && !imagePreview && (
        <div className="flex gap-2">
          <Input
            placeholder="Cole aqui a URL da imagem..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            disabled={disabled}
          />
          <Button
            type="button"
            onClick={handleUrlSubmit}
            disabled={!urlInput.trim() || disabled}
            size="sm"
          >
            Aplicar
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;
