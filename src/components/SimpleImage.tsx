import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SimpleImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const SimpleImage = ({ src, alt, width = 800, height = 400, className }: SimpleImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
    console.log('Image loaded successfully:', src);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    console.error('Image failed to load:', src);
  };

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground border rounded",
          className
        )}
        style={{ width, height }}
      >
        <span className="text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)} style={{ width, height }}>
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse"
          style={{ width, height }}
        >
          <div className="w-8 h-8 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "w-full h-full object-cover rounded transition-opacity duration-300",
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default SimpleImage;

