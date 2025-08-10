import { useState, useCallback, memo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

const OptimizedImage = memo(({ 
  src, 
  alt, 
  width, 
  height, 
  className = "", 
  loading = "lazy",
  priority = false,
  sizes = "100vw",
  quality = 75
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => setIsLoaded(true), []);
  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
  }, []);

  // Generate responsive image sources
  const generateSrcSet = (baseSrc: string) => {
    const ext = baseSrc.split('.').pop()?.toLowerCase();
    const baseName = baseSrc.replace(/\.[^/.]+$/, "");
    
    if (width) {
      return [
        `${baseName}-${Math.round(width * 0.5)}.${ext} ${Math.round(width * 0.5)}w`,
        `${baseName}-${width}.${ext} ${width}w`,
        `${baseName}-${Math.round(width * 1.5)}.${ext} ${Math.round(width * 1.5)}w`,
      ].join(', ');
    }
    return baseSrc;
  };

  // Generate WebP sources
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const webpSrcSet = generateSrcSet(webpSrc);
  const fallbackSrcSet = generateSrcSet(src);

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
        style={{
          width: width || '100%',
          height: height || 'auto',
          aspectRatio: width && height ? `${width}/${height}` : undefined
        }}
      >
        <span className="text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <picture className={cn("block", className)}>
      <source 
        srcSet={webpSrcSet} 
        sizes={sizes}
        type="image/webp" 
      />
      <source 
        srcSet={fallbackSrcSet} 
        sizes={sizes}
        type={`image/${src.split('.').pop()?.toLowerCase()}`}
      />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        decoding="async"
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : undefined,
          objectFit: 'cover'
        }}
      />
      {!isLoaded && (
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-muted animate-pulse",
            className
          )}
          style={{ 
            width: width || '100%', 
            height: height || 'auto',
            aspectRatio: width && height ? `${width}/${height}` : undefined
          }}
        >
          <div className="w-8 h-8 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </picture>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;