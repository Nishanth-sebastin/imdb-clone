import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface MovieImageCarouselProps {
  images: string[];
  altText: string;
  className?: string;
}

export default function MovieImageCarousel({ images, altText, className = '' }: MovieImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no images or only one image, don't show navigation
  if (!images.length) {
    return (
      <div className={`relative overflow-hidden rounded-lg border border-cinema-800 ${className}`}>
        <div className="w-full aspect-[2/3] bg-cinema-900 flex items-center justify-center text-cinema-500">
          No images available
        </div>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className={`relative overflow-hidden rounded-lg border border-cinema-800 ${className}`}>
        <img src={images[0]} alt={altText} className="w-full h-auto" />
      </div>
    );
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={`relative overflow-hidden rounded-lg border border-cinema-800 group ${className}`}>
      <img src={images[currentIndex]} alt={`${altText} - Image ${currentIndex + 1}`} className="w-full h-auto" />

      {/* Navigation indicator */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-gold scale-125' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows - only visible on hover or on touch devices */}
      <Button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 h-auto w-auto opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous image"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <Button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 h-auto w-auto opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next image"
      >
        <ArrowRight className="h-5 w-5" />
      </Button>

      {/* Current position indicator */}
      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
