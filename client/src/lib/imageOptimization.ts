/**
 * Image optimization utilities for performance
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "avif" | "jpg" | "png";
  lazy?: boolean;
}

/**
 * Generate optimized image URL with query parameters
 * Can be used with CDN or image optimization service
 */
export function getOptimizedImageUrl(
  imageUrl: string,
  options: ImageOptimizationOptions = {}
): string {
  if (!imageUrl) return "";

  // If already optimized, return as-is
  if (imageUrl.includes("?")) {
    return imageUrl;
  }

  const params = new URLSearchParams();

  if (options.width) {
    params.append("w", options.width.toString());
  }

  if (options.height) {
    params.append("h", options.height.toString());
  }

  if (options.quality) {
    params.append("q", options.quality.toString());
  }

  if (options.format) {
    params.append("f", options.format);
  }

  const queryString = params.toString();
  return queryString ? `${imageUrl}?${queryString}` : imageUrl;
}

/**
 * Create responsive image srcset for different screen sizes
 */
export function createResponsiveImageSrcSet(
  imageUrl: string,
  sizes: number[] = [320, 640, 960, 1280]
): string {
  return sizes
    .map((size) => {
      const optimizedUrl = getOptimizedImageUrl(imageUrl, { width: size });
      return `${optimizedUrl} ${size}w`;
    })
    .join(", ");
}

/**
 * Create picture element with multiple formats for better browser support
 */
export function createPictureElement(
  imageUrl: string,
  alt: string,
  options: ImageOptimizationOptions = {}
): string {
  const webpUrl = getOptimizedImageUrl(imageUrl, { ...options, format: "webp" });
  const avifUrl = getOptimizedImageUrl(imageUrl, { ...options, format: "avif" });
  const jpgUrl = getOptimizedImageUrl(imageUrl, { ...options, format: "jpg" });

  const srcSet = createResponsiveImageSrcSet(imageUrl);

  return `
    <picture>
      <source srcset="${createResponsiveImageSrcSet(avifUrl)}" type="image/avif" />
      <source srcset="${createResponsiveImageSrcSet(webpUrl)}" type="image/webp" />
      <img
        src="${jpgUrl}"
        srcset="${srcSet}"
        alt="${alt}"
        loading="lazy"
        decoding="async"
      />
    </picture>
  `;
}

/**
 * Setup lazy loading observer for images
 */
export function setupLazyLoadingObserver(): IntersectionObserver {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;

        // Load the actual image
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }

        // Load srcset if available
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }

        // Remove lazy loading class
        img.classList.remove("lazy");

        // Stop observing this image
        observer.unobserve(img);
      }
    });
  });

  // Observe all lazy images
  document.querySelectorAll("img.lazy").forEach((img) => {
    imageObserver.observe(img);
  });

  return imageObserver;
}

/**
 * Get image dimensions for aspect ratio preservation
 */
export function getImageDimensions(
  imageUrl: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${imageUrl}`));
    };

    img.src = imageUrl;
  });
}

/**
 * Calculate aspect ratio for responsive images
 */
export function calculateAspectRatio(
  width: number,
  height: number
): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}/${height / divisor}`;
}

/**
 * Generate CSS for aspect ratio container
 */
export function getAspectRatioCss(
  width: number,
  height: number
): Record<string, string> {
  const aspectRatio = (height / width) * 100;

  return {
    position: "relative",
    paddingBottom: `${aspectRatio}%`,
    height: "0",
    overflow: "hidden",
  };
}

/**
 * Preload images for better performance
 */
export function preloadImages(imageUrls: string[]): void {
  imageUrls.forEach((url) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Prefetch images for likely next navigation
 */
export function prefetchImages(imageUrls: string[]): void {
  imageUrls.forEach((url) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  });
}
