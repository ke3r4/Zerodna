import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onUpload: (file: File) => Promise<string>;
  accept?: string;
  maxSize?: number; // in MB
  currentValue?: string;
  placeholder?: string;
  className?: string;
}

export default function FileUpload({ 
  onUpload, 
  accept = "image/*", 
  maxSize = 5,
  currentValue,
  placeholder = "Click to upload or drag and drop",
  className = ""
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const url = await onUpload(file);
      toast({
        title: "File uploaded",
        description: "File has been uploaded successfully.",
      });
      return url;
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className={className}>
      <Card
        className={`p-6 border-2 border-dashed cursor-pointer transition-colors ${
          dragActive 
            ? "border-zerodna-blue bg-blue-50" 
            : "border-gray-300 hover:border-gray-400"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center space-y-4">
          {currentValue ? (
            <div className="space-y-2">
              <div className="w-16 h-16 mx-auto">
                <img 
                  src={currentValue} 
                  alt="Current file" 
                  className="w-full h-full object-contain rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center hidden">
                  <i className="fas fa-file text-2xl text-gray-400"></i>
                </div>
              </div>
              <p className="text-sm text-gray-600">Current file</p>
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <i className="fas fa-upload text-2xl text-gray-400"></i>
            </div>
          )}
          
          <div>
            <p className="text-sm text-gray-700 mb-1">
              {isUploading ? "Uploading..." : placeholder}
            </p>
            <p className="text-xs text-gray-500">
              {accept.includes("image") ? "PNG, JPG, GIF" : "Select file"} up to {maxSize}MB
            </p>
          </div>
          
          {!isUploading && (
            <Button type="button" variant="outline" size="sm" disabled={isUploading}>
              <i className="fas fa-plus mr-2"></i>
              Choose File
            </Button>
          )}
        </div>
      </Card>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}