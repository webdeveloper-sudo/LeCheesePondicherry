import React from "react";
import DynamicPageBanner from "@/components/DynamicPageBanner";
import galleryBanner from "@/assets/images/process-hero-new.webp";
import MasonryGallery from "@/components/portfolio/MasonryGallery";

const GalleryPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Dynamic Hero Banner */}
      <DynamicPageBanner
        pageKey="/portfolio/gallery"
        fallbackTitle="Visual Gallery"
        fallbackVariant="BannerAndBreadCrumb"
        fallbackImage={galleryBanner}
      />

      <section className="py-20">
        <MasonryGallery />
      </section>
    </div>
  );
};

export default GalleryPage;
