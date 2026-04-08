import React from "react";
import { motion } from "framer-motion";
import TestimonialsSlider from "@/components/portfolio/TestimonialsSlider";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import testimonialBanner from "@/assets/images/process-hero-new.webp";
import { fadeUp } from "@/animations/variants";
import { Link } from "react-router-dom";

const TestimonialsPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <BannerAndBreadCrumb
        title="Customer Testimonials"
        img={testimonialBanner}
      />

      <TestimonialsSlider />

      {/* Additional Testimonials Section (Clean Grid) */}
      {/* <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "John Doe", role: "Home Chef", content: "The best cheese in town! Perfectly aged and incredibly flavorful." },
            { name: "Marie Curie", role: "Gourmet Enthusiast", content: "Le Pondicherry Cheese has a unique character that stands out from commercial brands." },
            { name: "Alex Wong", role: "Cafe Owner", content: "Our customers love the cheese platters we make with Le Pondy's selection." }
          ].map((item, index) => (
            <div key={index} className="p-6 border border-brand-green/10 rounded-2xl bg-bg-cream-light/30">
              <p className="text-text-primary mb-4 italic">"{item.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-gold text-brand-green flex items-center justify-center font-bold text-xs">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h5 className="font-semibold text-brand-green text-sm">{item.name}</h5>
                  <p className="text-[10px] text-text-secondary uppercase">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section> */}

    </div>
  );
};

export default TestimonialsPage;
