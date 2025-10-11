import React, { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizedImageProps {
  src: string;
  webpSrc?: string;
  avifSrc?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Mobile-optimized image component with next-gen formats, lazy loading, and Core Web Vitals optimization
 */
const MobileOptimizedImage: React.FC<MobileOptimizedImageProps> = ({
  src,
  webpSrc,
  avifSrc,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const isMobile = useIsMobile();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: isMobile ? '50px' : '100px', // Smaller margin on mobile for better performance
        threshold: 0.1
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority, isMobile]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate responsive srcSet for mobile optimization
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc) return '';
    
    const extension = baseSrc.split('.').pop();
    const baseName = baseSrc.replace(`.${extension}`, '');
    
    // Generate different sizes for mobile optimization
    const sizes = isMobile 
      ? [320, 480, 640, 768] // Mobile-focused sizes
      : [480, 768, 1024, 1280, 1600]; // Desktop sizes
    
    return sizes
      .map(size => `${baseName}-${size}w.${extension} ${size}w`)
      .join(', ');
  };

  // Mobile-specific image dimensions
  const getMobileDimensions = () => {
    if (!isMobile || !width || !height) return { width, height };
    
    // Scale down images for mobile to improve performance
    const maxMobileWidth = 768;
    if (width > maxMobileWidth) {
      const ratio = height / width;
      return {
        width: maxMobileWidth,
        height: Math.round(maxMobileWidth * ratio)
      };
    }
    
    return { width, height };
  };

  const { width: mobileWidth, height: mobileHeight } = getMobileDimensions();

  // Placeholder styles
  const placeholderStyle = placeholder === 'blur' && blurDataURL ? {
    backgroundImage: `url(${blurDataURL})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(5px)',
    transition: 'filter 0.3s ease'
  } : {};

  // Container styles for aspect ratio preservation
  const containerStyle = mobileWidth && mobileHeight ? {
    aspectRatio: `${mobileWidth} / ${mobileHeight}`,
    width: '100%',
    maxWidth: mobileWidth
  } : {};

  if (!isInView) {
    return (
      <div
        ref={imgRef}
        className={`mobile-image-placeholder ${className}`}
        style={{
          ...containerStyle,
          ...placeholderStyle,
          backgroundColor: placeholder === 'empty' ? '#f3f4f6' : 'transparent'
        }}
        aria-label={`Loading ${alt}`}
      />
    );
  }

  if (hasError) {
    return (
      <div
        className={`mobile-image-error ${className}`}
        style={containerStyle}
        role="img"
        aria-label={`Failed to load ${alt}`}
      >
        <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500 text-sm">
          Image unavailable
        </div>
      </div>
    );
  }

  return (
    <picture className={`mobile-optimized-picture ${className}`}>
      {/* AVIF format for modern browsers (best compression) */}
      {avifSrc && (
        <source
          srcSet={generateSrcSet(avifSrc) || avifSrc}
          sizes={sizes}
          type="image/avif"
        />
      )}
      
      {/* WebP format for modern browsers */}
      {webpSrc && (
        <source
          srcSet={generateSrcSet(webpSrc) || webpSrc}
          sizes={sizes}
          type="image/webp"
        />
      )}
      
      {/* Fallback to original format */}
      <img
        ref={imgRef}
        src={src}
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        alt={alt}
        width={mobileWidth}
        height={mobileHeight}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`
          mobile-optimized-image
          ${isLoaded ? 'loaded' : 'loading'}
          ${className}
        `}
        style={{
          ...(!isLoaded && placeholderStyle),
          filter: isLoaded ? 'none' : (placeholder === 'blur' ? 'blur(5px)' : 'none'),
          transition: 'filter 0.3s ease, opacity 0.3s ease',
          opacity: isLoaded ? 1 : 0.8,
          width: '100%',
          height: 'auto',
          maxWidth: mobileWidth || '100%'
        }}
        // Mobile-specific optimizations
        {...(isMobile && {
          'data-mobile-optimized': 'true',
          'data-priority': priority.toString()
        })}
      />
      
      <style jsx>{`
        .mobile-optimized-picture {
          display: block;
          width: 100%;
          position: relative;
        }
        
        .mobile-optimized-image {
          display: block;
          width: 100%;
          height: auto;
          object-fit: cover;
        }
        
        .mobile-image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f3f4f6;
          border-radius: 4px;
        }
        
        .mobile-image-error {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 4px;
          min-height: 200px;
        }
        
        @media (max-width: 768px) {
          .mobile-optimized-image {
            border-radius: 8px;
          }
          
          .mobile-image-placeholder {
            min-height: 150px;
            border-radius: 8px;
          }
          
          .mobile-image-error {
            min-height: 150px;
            border-radius: 8px;
          }
        }
        
        /* Performance optimizations for mobile */
        @media (max-width: 768px) and (prefers-reduced-motion: reduce) {
          .mobile-optimized-image {
            transition: none;
          }
        }
        
        /* High DPI display optimizations */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .mobile-optimized-image {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
        }
      `}</style>
    </picture>
  );
};

export default MobileOptimizedImage;
