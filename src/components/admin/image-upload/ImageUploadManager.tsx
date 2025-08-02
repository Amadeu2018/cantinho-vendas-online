import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Image as ImageIcon, X, Check } from "lucide-react";

interface ImageUploadManagerProps {
  productId?: string;
  onImageUploaded?: (url: string) => void;
  maxImages?: number;
  existingImages?: string[];
}

const ImageUploadManager = ({ 
  productId, 
  onImageUploaded, 
  maxImages = 5,
  existingImages = []
}: ImageUploadManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>(existingImages);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    if (uploadedImages.length >= maxImages) {
      toast({
        title: "Limite atingido",
        description: `Você pode carregar no máximo ${maxImages} imagens`,
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = productId ? `products/${productId}/${fileName}` : `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;
      
      if (productId) {
        // Salvar referência no banco se for para um produto específico
        const { error: dbError } = await supabase
          .from('product_images')
          .insert([{
            product_id: productId,
            url: imageUrl,
            is_primary: uploadedImages.length === 0
          }]);
        
        if (dbError) throw dbError;
      }

      setUploadedImages(prev => [...prev, imageUrl]);
      onImageUploaded?.(imageUrl);
      
      toast({
        title: "Sucesso",
        description: "Imagem carregada com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível carregar a imagem",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(uploadImage);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(uploadImage);
  };

  const removeImage = async (imageUrl: string) => {
    try {
      // Remove do storage se necessário
      const path = imageUrl.split('/').slice(-2).join('/');
      await supabase.storage.from('product-images').remove([path]);
      
      // Remove do banco se for produto específico
      if (productId) {
        await supabase
          .from('product_images')
          .delete()
          .eq('url', imageUrl);
      }
      
      setUploadedImages(prev => prev.filter(url => url !== imageUrl));
      
      toast({
        title: "Sucesso",
        description: "Imagem removida com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro ao remover imagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a imagem",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Upload de Imagens
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver 
              ? 'border-cantinho-terracotta bg-cantinho-cream/20' 
              : 'border-gray-300 hover:border-cantinho-terracotta'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-gray-600">
              Arraste imagens aqui ou clique para selecionar
            </p>
            <p className="text-sm text-gray-400">
              PNG, JPG até 5MB • Máximo {maxImages} imagens
            </p>
          </div>
          <Label htmlFor="image-upload" className="cursor-pointer">
            <Input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              disabled={uploading || uploadedImages.length >= maxImages}
            >
              {uploading ? "Carregando..." : "Selecionar Imagens"}
            </Button>
          </Label>
        </div>

        {/* Preview das imagens */}
        {uploadedImages.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Imagens Carregadas ({uploadedImages.length}/{maxImages})</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedImages.map((imageUrl, index) => (
                <div key={imageUrl} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(imageUrl)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {index === 0 && (
                    <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                      Principal
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dicas de otimização */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Check className="h-4 w-4" />
            Dicas para melhores imagens:
          </h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use imagens de alta qualidade (mínimo 800x600px)</li>
            <li>• A primeira imagem será a principal do produto</li>
            <li>• Prefira fundos neutros ou brancos</li>
            <li>• Mostre o produto de diferentes ângulos</li>
            <li>• Comprima as imagens para web antes do upload</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploadManager;