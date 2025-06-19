
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ImagePreview from "./image-upload/ImagePreview";
import FileUploadArea from "./image-upload/FileUploadArea";
import UrlInput from "./image-upload/UrlInput";

interface ProductImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
  disabled?: boolean;
}

const ProductImageUpload = ({ currentImageUrl, onImageChange, disabled }: ProductImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(currentImageUrl || null);
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
    setImageUploading(true);
    
    try {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
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
    setUrlInput("");
    onImageChange("");
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Imagem do Produto</Label>
      
      {/* Mode Toggle - Mobile First */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Button
          type="button"
          variant={uploadMode === "file" ? "default" : "outline"}
          size="sm"
          onClick={() => setUploadMode("file")}
          disabled={disabled}
          className="w-full sm:w-auto justify-center"
        >
          <Upload className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Upload de Arquivo</span>
          <span className="sm:hidden">Arquivo</span>
        </Button>
        <Button
          type="button"
          variant={uploadMode === "url" ? "default" : "outline"}
          size="sm"
          onClick={() => setUploadMode("url")}
          disabled={disabled}
          className="w-full sm:w-auto justify-center"
          title="Adicionar URL da imagem"
        >
          <Link className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">URL da Imagem</span>
          <span className="sm:hidden">URL</span>
        </Button>
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <ImagePreview
          imageUrl={imagePreview}
          onRemove={removeImage}
          disabled={disabled}
        />
      )}

      {/* Upload Mode: File */}
      {uploadMode === "file" && !imagePreview && (
        <FileUploadArea
          onFileUpload={handleFileUpload}
          isUploading={imageUploading}
          disabled={disabled}
        />
      )}

      {/* Upload Mode: URL */}
      {uploadMode === "url" && !imagePreview && (
        <UrlInput
          value={urlInput}
          onChange={setUrlInput}
          onSubmit={handleUrlSubmit}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default ProductImageUpload;
