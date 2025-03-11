import React from 'react';
import { Label } from '@/components/ui/label';
import FileUploader from './FileUploader';
import { FileUploadResult } from '@/types/movie';
import { Button } from '@/components/ui/button';
import { Star, X } from 'lucide-react';
import { toast } from 'sonner';

interface MovieImageSelectorProps {
  value?: string[];
  onChange: (urls: string[]) => void;
}

export default function MovieImageSelector({ value = [], onChange }: MovieImageSelectorProps) {
  const handleImagesChange = (results: FileUploadResult | FileUploadResult[]) => {
    // Handle both single and multiple file uploads
    const resultsArray = Array.isArray(results) ? results : [results];

    if (value.length + resultsArray.length > 5) {
      toast.error('Maximum of 5 images allowed');
      return;
    }

    const urls = resultsArray.map((result) => result.url);
    onChange([...value, ...urls]);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  const handleSetAsPrimary = (indexToPromote: number) => {
    const newImages = [...value];
    const [imageToPromote] = newImages.splice(indexToPromote, 1);
    newImages.unshift(imageToPromote);
    onChange(newImages);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="block mb-2">Movie Images</Label>
        <p className="text-xs text-cinema-400 mb-4">
          Upload up to 5 images. The first image will be used as the primary poster.
        </p>

        {/* Preview area */}
        <div className="mb-4">
          {value[0] && (
            <div className="max-h-[200px] relative w-full aspect-[2/3] rounded-lg overflow-hidden border border-cinema-800">
              <img src={value[0]} alt="Selected preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Thumbnail status bar */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {value.map((url, index) => (
            <div
              key={index}
              className="relative group shrink-0 w-20 aspect-[2/3] rounded-md overflow-hidden border border-cinema-800"
            >
              <img src={url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {index !== 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetAsPrimary(index)}
                    className="h-8 w-8 p-0 text-white hover:text-gold hover:bg-black/50"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveImage(index)}
                  className="h-8 w-8 p-0 text-white hover:text-red-500 hover:bg-black/50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {index === 0 && (
                <div className="absolute bottom-0 inset-x-0 bg-gold/80 py-1">
                  <span className="text-[10px] text-black text-center block font-medium">Primary</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* File uploader */}
        {value.length < 5 && (
          <FileUploader
            onChange={handleImagesChange}
            className="w-full"
            aspectRatio="aspect-[2/3] max-h-[300px]"
            multiple={true}
          />
        )}
      </div>
    </div>
  );
}
