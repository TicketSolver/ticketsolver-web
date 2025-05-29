// components/upload/UploadDropzone.tsx
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

type Props = {
  onFilesSelected: (files: FileList) => void;
  isLoading?: boolean;
};

export function UploadDropzone({ onFilesSelected, isLoading }: Props) {
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsHovering(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsHovering(false);
      }}
      onDrop={handleDrop}
      className="flex flex-col items-center justify-center border-4 border-dashed border-muted rounded-xl p-6 text-center cursor-pointer hover:bg-muted/50 transition"
      onClick={() => {
        if(isLoading) return;
        fileInputRef.current?.click()
      }}
    >
      <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
      {isLoading ? (
        <p>Enviando arquivos...</p>
      ) : (
        <p className="text-sm text-muted-foreground mb-1">
          {isHovering ? 'Solte arquivos aqui para enviar' : 'Arraste arquivos aqui ou clique para selecionar'}
        </p>
      )}
      <Button variant="outline" size="sm" className="mt-2" disabled={isLoading}>
        Selecionar Arquivos
      </Button>
      <input
        type="file"
        multiple
        hidden
        ref={fileInputRef}
        disabled={isLoading}
        onChange={(e) => {
          if (e.target.files && !isLoading) onFilesSelected(e.target.files);
        }}
      />
    </div >
  );
}
