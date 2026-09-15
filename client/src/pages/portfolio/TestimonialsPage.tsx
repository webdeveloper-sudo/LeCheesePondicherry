import React from "react";
import TestimonialsSlider from "@/components/portfolio/TestimonialsSlider";
import DynamicPageBanner from "@/components/DynamicPageBanner";
import testimonialBanner from "@/assets/images/process-hero-new.webp";

const TestimonialsPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Dynamic Hero Banner */}
      <DynamicPageBanner
        pageKey="/portfolio/testimonials"
        fallbackTitle="What Our Customers Say"
        fallbackVariant="BannerAndBreadCrumb"
        fallbackImage={testimonialBanner}
      />

      <TestimonialsSlider />
    </div>
  );
};

export default TestimonialsPage;
