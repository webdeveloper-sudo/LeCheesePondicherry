import React from "react";

// Breakpoints match Tailwind: mobile < md (768px), tab md–lg, large >= lg (1024px)
export const BANNER_MEDIA = {
  large: "(min-width: 1024px)",
  tablet: "(min-width: 768px)",
};

interface ResponsiveBannerImageProps {
  image: string; // Large screen image
  tabletImage?: string; // Optional — falls back to the large screen image
  mobileImage?: string; // Falls back to the large screen image for older slides
  alt?: string;
  className?: string;
  loading?: "eager" | "lazy";
}

const ResponsiveBannerImage = ({
  image,
  tabletImage,
  mobileImage,
  alt = "",
  className = "",
  loading = "eager",
}: ResponsiveBannerImageProps) => {
  return (
    <picture>
      <source media={BANNER_MEDIA.large} srcSet={image} />
      <source media={BANNER_MEDIA.tablet} srcSet={tabletImage || image} />
      <img
        src={mobileImage || image}
        alt={alt}
        loading={loading}
        draggable={false}
        className={`absolute inset-0 w-full h-full object-cover object-center ${className}`}
      />
    </picture>
  );
};

export default ResponsiveBannerImage;
