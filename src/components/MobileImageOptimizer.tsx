import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
}

const MobileImageOptimizer = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = "", 
  priority = false,
  aspectRatio = 'auto'
}: MobileImageProps) => {
  const isMobile = useIsMobile();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Mobile-optimized image sources
  const generateMobileSrcSet = (originalSrc: string) => {
    const extension = originalSrc.split('.').pop();
    const baseName = originalSrc.replace(`.${extension}`, '');
    
    if (isMobile) {
      // Serve smaller images for mobile to improve loading
      return `${baseName}-mobile.webp 480w, ${baseName}.webp 768w`;
    }
    
    return `${baseName}.webp 768w, ${baseName}-desktop.webp 1200w`;
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '16:9': return 'aspect-ratio-16-9';
      case '4:3': return 'aspect-ratio-4-3';
      case '1:1': return 'aspect-ratio-1-1';
      default: return '';
    }
  };

  useEffect(() => {
    // Preload priority images
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = src;
      link.as = 'image';
      if (isMobile) {
        link.media = '(max-width: 768px)';
      }
      document.head.appendChild(link);
    }
  }, [src, priority, isMobile]);

  return (
    <div className={`relative ${aspectRatio !== 'auto' ? 'aspect-ratio-container ' + getAspectRatioClass() : ''} ${className}`}>
      <picture className="block w-full h-full">
        {/* WebP mobile source */}
        <source 
          media="(max-width: 767px)" 
          srcSet={generateMobileSrcSet(src)} 
          type="image/webp"
          sizes={isMobile ? "100vw" : "50vw"}
        />
        
        {/* WebP desktop source */}
        <source 
          media="(min-width: 768px)" 
          srcSet={generateMobileSrcSet(src)} 
          type="image/webp"
          sizes="(min-width: 1200px) 1200px, 100vw"
        />
        
        {/* Fallback image */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`${aspectRatio !== 'auto' ? 'absolute inset-0 ' : ''}w-full h-full object-cover transition-opacity duration-300 ${
            !isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          style={{
            aspectRatio: width && height && aspectRatio === 'auto' ? `${width}/${height}` : undefined,
          }}
        />
      </picture>
      
      {/* Loading placeholder with proper aspect ratio */}
      {!isLoaded && !hasError && (
        <div 
          className={`${aspectRatio !== 'auto' ? 'absolute inset-0 ' : ''}flex items-center justify-center bg-muted animate-pulse`}
          style={{ 
            aspectRatio: width && height && aspectRatio === 'auto' ? `${width}/${height}` : undefined 
          }}
        >
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      )}
      
      {/* Error state */}
      {hasError && (
        <div 
          className={`${aspectRatio !== 'auto' ? 'absolute inset-0 ' : ''}flex items-center justify-center bg-muted`}
          style={{ 
            aspectRatio: width && height && aspectRatio === 'auto' ? `${width}/${height}` : undefined 
          }}
        >
          <div className="text-sm text-muted-foreground">Image unavailable</div>
        </div>
      )}
    </div>
  );
};

export default MobileImageOptimizer;