import { useState, useCallback, memo } from 'react';
import { cn } from '@/lib/utils';

interface WebPOptimizedImageProps {
  src: string;
  webpSrc?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

const WebPOptimizedImage = memo(({ 
  src, 
  webpSrc,
  alt, 
  width, 
  height, 
  className = "", 
  loading = "lazy",
  priority = false,
  sizes = "100vw",
  objectFit = 'cover'
}: WebPOptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => setIsLoaded(true), []);
  const handleError = useCallback(() => {
    console.error('Image failed to load:', src);
    setHasError(true);
    setIsLoaded(true);
  }, [src]);

  // For Vite, imported images are already processed and have the correct URL
  // No need to auto-generate WebP source since Vite handles this
  const imageSrc = typeof src === 'string' ? src : src;

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
        style={{
          width,
          height,
          aspectRatio: `${width}/${height}`
        }}
      >
        <span className="text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)} style={{ aspectRatio: `${width}/${height}` }}>
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        decoding="async"
        className={cn(
          "w-full h-full transition-opacity duration-300",
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          objectFit,
          aspectRatio: `${width}/${height}`
        }}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Loading placeholder to prevent CLS */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse"
          style={{ 
            aspectRatio: `${width}/${height}`
          }}
        >
          <div className="w-8 h-8 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
});

WebPOptimizedImage.displayName = 'WebPOptimizedImage';

export default WebPOptimizedImage;