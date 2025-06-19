
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ImagePlus, Loader2 } from "lucide-react";

interface FileUploadAreaProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  disabled?: boolean;
}

const FileUploadArea = ({ onFileUpload, isUploading, disabled }: FileUploadAreaProps) => {
  return (
    <Label
      htmlFor="image-upload"
      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
    >
      {isUploading ? (
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
        onChange={onFileUpload}
        disabled={isUploading || disabled}
      />
    </Label>
  );
};

export default FileUploadArea;
