import React, { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = ".xlsx,.xlsb,.xls",
  disabled = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleDrag = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        setSelectedFileName(file.name);
        onFileSelect(file);
      }
    },
    [disabled, onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (disabled) return;

      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        setSelectedFileName(file.name);
        onFileSelect(file);
      }
    },
    [disabled, onFileSelect]
  );

  return (
    <Card
      className={cn(
        "border-2 border-dashed transition-all duration-500 bg-card/60 backdrop-blur-xl relative overflow-hidden group",
        dragActive && "border-primary bg-primary/10 shadow-[0_0_40px_-10px_rgba(var(--color-primary),0.3)] scale-[1.02]",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && !dragActive && "border-border/60 hover:border-primary/50 hover:shadow-xl hover:bg-card/80"
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <CardContent className="p-16">
        <input
          type="file"
          id="file-input"
          className="hidden"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          aria-label="Upload Excel file"
        />
        <label
          htmlFor="file-input"
          className={cn(
            "flex flex-col items-center justify-center cursor-pointer relative z-10",
            disabled && "cursor-not-allowed"
          )}
        >
          <div className={cn(
            "rounded-2xl p-6 mb-8 transition-all duration-500 relative",
            dragActive ? "bg-primary text-primary-foreground scale-110 shadow-xl shadow-primary/40" : "bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/25"
          )}>
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
            <Upload className="w-12 h-12 relative z-10 transition-transform duration-500 group-hover:-translate-y-1" />
          </div>
          <div className="text-center">
            {selectedFileName ? (
              <>
                <p className="text-xl font-semibold text-foreground mb-2">
                  Selected: {selectedFileName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Click or drag to change
                </p>
              </>
            ) : (
              <>
                <p className="text-xl font-semibold text-foreground mb-2">
                  Drag & drop your Excel file here
                </p>

                <p className="text-sm text-muted-foreground">
                  or click to browse (supports .xlsx, .xlsb, .xls)
                </p>
              </>
            )}
          </div>
        </label>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
