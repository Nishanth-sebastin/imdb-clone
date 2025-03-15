import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader, Upload } from "lucide-react";
import { toast } from "sonner";
import { FileUploadResult } from "@/types/movie";
import { LoadingSpinner } from "./ui/loading-spinner";

interface FileUploaderProps {
  onChange: (result: FileUploadResult | FileUploadResult[]) => void;
  className?: string;
  aspectRatio?: string;
  multiple?: boolean;
}

export default function FileUploader({
  onChange,
  className = "",
  aspectRatio,
  multiple = false,
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = async (file: File) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `https://imdb-clone-1-hohz.onrender.com/uploads`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      return data.fileUrl;
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload image");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload only image files");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Each image size should be less than 5MB");
        return;
      }
    }

    const uploadedResults = await Promise.all(files.map(uploadFile));
    const results = uploadedResults.filter(Boolean).map((url, index) => ({
      url,
      file: files[index],
    }));

    if (multiple) {
      onChange(results);
    } else {
      onChange(results[0]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
        onClick={() => !isLoading && fileInputRef.current?.click()}
      >
        {isLoading ? (
          <LoadingSpinner className="h-8 w-8" />
        ) : (
          <>
            <Upload className="h-8 w-8" />
            {multiple ? (
              <span className="text-xs">Click to upload images</span>
            ) : null}
          </>
        )}
      </Button>
    </div>
  );
}
