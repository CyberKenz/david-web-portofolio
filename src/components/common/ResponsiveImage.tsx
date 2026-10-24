import type { ResponsiveImage as ResponsiveImageData } from '../../types/portfolio';

interface ResponsiveImageProps {
  image: ResponsiveImageData;
  sizes: string;
  className?: string;
  priority?: boolean;
  imgClassName?: string;
  fit?: 'cover' | 'contain';
}

function srcSet(base: string, widths: number[], ext: 'webp' | 'jpg'): string {
  return widths.map((width) => `${base}-${width}.${ext} ${width}w`).join(', ');
}

/**
 * WebP with JPEG fallback, width descriptors, and reserved intrinsic space.
 * Loading is lazy unless the image is the LCP candidate.
 */
export function ResponsiveImage({
  image,
  sizes,
  className = '',
  priority = false,
  imgClassName = '',
  fit = 'cover'
}: ResponsiveImageProps) {
  const { base, widths, width, height, alt } = image;
  const fallbackWidth = widths[widths.length - 1] ?? width;

  return (
    <picture className={className}>
      <source type="image/webp" srcSet={srcSet(base, widths, 'webp')} sizes={sizes} />
      <img
        src={`${base}-${fallbackWidth}.jpg`}
        srcSet={srcSet(base, widths, 'jpg')}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={`h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} ${imgClassName}`}
      />
    </picture>
  );
}
