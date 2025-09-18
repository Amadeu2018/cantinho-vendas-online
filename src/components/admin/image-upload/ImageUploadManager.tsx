import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Image, Trash2, Download, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UploadedImage {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  created_at: string;
}

const ImageUploadManager = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from('product-images')
        .list('', {
          limit: 100,
          offset: 0,
        });

      if (error) throw error;

      const imagesList: UploadedImage[] = data.map(file => ({
        id: file.id || file.name,
        name: file.name,
        url: supabase.storage.from('product-images').getPublicUrl(file.name).data.publicUrl,
        size: file.metadata?.size || 0,
        type: file.metadata?.mimetype || 'image/jpeg',
        created_at: file.created_at || file.updated_at || new Date().toISOString()
      }));

      setImages(imagesList);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar imagens",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadedFiles = [];
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        uploadedFiles.push({ name: fileName, size: file.size });
      }

      // Log security event for image uploads
      await supabase.rpc('log_security_event', {
        _action: `${files.length} imagem(ns) carregada(s)`,
        _details: { 
          files_count: files.length,
          files: uploadedFiles,
          total_size: Array.from(files).reduce((sum, file) => sum + file.size, 0)
        }
      });

      toast({
        title: "Upload concluído",
        description: `${files.length} imagem(ns) carregada(s) com sucesso!`
      });

      fetchImages(); // Refresh the list
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível carregar as imagens",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (fileName: string) => {
    try {
      // Get image info before deletion for logging
      const imageToDelete = images.find(img => img.name === fileName);
      
      const { error } = await supabase.storage
        .from('product-images')
        .remove([fileName]);

      if (error) throw error;

      // Log security event
      await supabase.rpc('log_security_event', {
        _action: `Imagem removida: ${fileName}`,
        _details: { 
          filename: fileName,
          size: imageToDelete?.size || 0,
          url: imageToDelete?.url
        }
      });

      toast({
        title: "Imagem removida",
        description: "Imagem removida com sucesso!"
      });

      fetchImages(); // Refresh the list
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover imagem",
        variant: "destructive"
      });
    }
  };

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestão de Imagens</h2>
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Carregando..." : "Carregar Imagens"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Biblioteca de Imagens</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar imagens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin h-8 w-8 border-2 border-cantinho-terracotta border-t-transparent rounded-full"></div>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-8">
              <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "Nenhuma imagem encontrada" : "Nenhuma imagem carregada"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm truncate" title={image.name}>
                        {image.name}
                      </h4>
                      <div className="text-xs text-muted-foreground">
                        <p>{formatFileSize(image.size)}</p>
                        <p>{new Date(image.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => window.open(image.url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(image.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUploadManager;