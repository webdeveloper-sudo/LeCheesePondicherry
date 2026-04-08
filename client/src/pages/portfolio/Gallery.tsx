import React from "react";
import { motion } from "framer-motion";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import galleryBanner from "@/assets/images/process-hero-new.webp";
import MasonryGallery from "@/components/portfolio/MasonryGallery";
import { headingVariant, viewportConfig } from "@/animations/variants";

const GalleryPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen ">
      {/* Hero Banner */}
      <BannerAndBreadCrumb title="Visual Portfolio" img={galleryBanner} />

     <section className="py-20">
       <MasonryGallery />
     </section>
    </div>
  );
};

export default GalleryPage;
