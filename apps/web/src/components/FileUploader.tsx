import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { FileUploadResult } from '@/types/movie';

interface FileUploaderProps {
  onChange: (result: FileUploadResult | FileUploadResult[]) => void;
  className?: string;
  aspectRatio?: string;
  multiple?: boolean;
}

export default function FileUploader({ onChange, className = '', aspectRatio, multiple = false }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    // Validate files
    for (const file of files) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload only image files');
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Each image size should be less than 5MB');
        return;
      }
    }

    // Create file upload results
    const results = files.map((file) => ({
      url: URL.createObjectURL(file),
      file: file,
    }));

    // Call the onChange handler with appropriate format based on multiple prop
    if (multiple) {
      onChange(results);
    } else {
      onChange(results[0]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        multiple={multiple}
      />

      <Button
        type="button"
        variant="ghost"
        className={`${aspectRatio} w-full h-20 flex flex-col items-center justify-center space-y-2 text-cinema-400 hover:text-white hover:bg-cinema-700/50 border-2 border-dashed border-cinema-700 rounded-lg`}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-8 w-8" />
        {multiple ? <span className="text-xs">Click to upload images</span> : null}
      </Button>
    </div>
  );
}
