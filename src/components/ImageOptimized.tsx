import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = "", 
  loading = "lazy",
  priority = false 
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate WebP and fallback URLs
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const fallbackSrc = src;

  return (
    <picture className={className}>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        decoding="async"
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : undefined,
          objectFit: 'cover'
        }}
      />
      {!isLoaded && !hasError && (
        <div 
          className="flex items-center justify-center bg-muted animate-pulse"
          style={{ 
            width: width || '100%', 
            height: height || 'auto',
            aspectRatio: width && height ? `${width}/${height}` : undefined
          }}
        >
          <div className="text-muted-foreground">Loading...</div>
        </div>
      )}
    </picture>
  );
};

export default OptimizedImage;