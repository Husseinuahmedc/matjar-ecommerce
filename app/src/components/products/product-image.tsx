"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImageProps extends Omit<ImageProps, "src" | "onError"> {
  src: string | null | undefined;
  fallbackSrc?: string;
}

/**
 * Robust Product Image component with error handling and fallback.
 * Uses next/image for optimization.
 */
export function ProductImage({ 
  src, 
  alt, 
  className, 
  fallbackSrc = "https://picsum.photos/seed/matjar/400/400",
  fill,
  ...props 
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  // Sync state if src prop changes — following React best practices for syncing state from props
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasError(false);
  }

  const currentSrc = hasError ? fallbackSrc : (src || fallbackSrc);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt || "Product image"}
      fill={fill}
      className={cn("object-cover", className)}
      onError={() => setHasError(true)}
    />
  );
}
