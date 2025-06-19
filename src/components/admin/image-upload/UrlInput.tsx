
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const UrlInput = ({ value, onChange, onSubmit, disabled }: UrlInputProps) => {
  return (
    <div className="flex gap-2 w-full">
      <Input
        placeholder="Cole aqui a URL da imagem..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="flex-1"
      />
      <Button
        type="button"
        onClick={onSubmit}
        disabled={!value.trim() || disabled}
        size="sm"
        className="whitespace-nowrap"
      >
        Aplicar
      </Button>
    </div>
  );
};

export default UrlInput;
