import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Quote, Star } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { MotionHeading, MotionText } from "../ui/MotionPrimitives";
import { Link } from "react-router-dom";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Regular Customer",
    content:
      "The artisanal cheeses from Le Pondicherry are simply unmatched. The texture and flavor profiles are exactly what I was looking for in premium cheese. My favorites are the aged cheddar and the truffle-infused varieties.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sophie Laurent",
    role: "Restaurateur",
    content:
      "As a French chef, I'm very picky about my cheese. I was pleasantly surprised to find such high-quality, authentic artisanal cheese in Pondicherry. It has become a staple in my restaurant's cheese platters.",
    rating: 5,
  },
  {
    id: 3,
    name: "Anita Desai",
    role: "Food Blogger",
    content:
      "Le Pondicherry Cheese isn't just about food; it's about the craft. Their commitment to traditional methods is evident in every bite. A must-try for any cheese lover!",
    rating: 4,
  },
  {
    id: 4,
    name: "David Smith",
    role: "Gourmet Enthusiast",
    content:
      "I've tasted cheeses all over the world, and what Le Pondicherry is doing is truly special. The facility tour was enlightening, and the passion of the cheesemakers is inspiring.",
    rating: 5,
  },
];

const TestimonialsSlider: React.FC = () => {
  return (
    <section className="py-20 bg-bg-cream-light overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <MotionText className="text-brand-gold uppercase tracking-wider mb-4">
            Our Heritage
          </MotionText>
          <MotionHeading
            className="text-2xl md:text-4xl max-w-2xl mx-auto mb-4 text-green"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What Our Clients Say
          </MotionHeading>
          <MotionText className="text-gray-800 max-w-2xl mx-auto mb-7 md:mb-8 text-sm md:text-base">
            Every wheel of cheese tells a story of patience, passion, and
            perfection
          </MotionText>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="pb-16 testimonial-swiper"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-green/5 h-full flex flex-col hover:shadow-md transition-shadow duration-300 relative">
                <Quote className="absolute top-6 right-6 text-brand-gold/20 w-12 h-12" />

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={
                        i < testimonial.rating
                          ? "var(--color-brand-gold)"
                          : "none"
                      }
                      className={
                        i < testimonial.rating
                          ? "text-brand-gold"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                <p className="text-text-primary italic mb-6 flex-1 text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4 border-t border-brand-green/10 pt-6">
                  <div className="w-12 h-12 rounded-full bg-brand-green text-white flex items-center justify-center font-heading text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-brand-green">
                      {testimonial.name}
                    </h4>
                    <p className="text-text-secondary text-xs uppercase tracking-widest">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="flex justify-center mt-8">
        <Link
          to="/shop"
          className="group inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-subtle text-[#1A1A1A] font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-300 shadow-xl hover:-translate-y-0.5"
        >
          Shop Our Cheeses
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .testimonial-swiper {
          padding-left: 50px;
          padding-right: 50px;
        }
        .testimonial-swiper .swiper-wrapper {
          display: flex;
          align-items: stretch;
        }
        .testimonial-swiper .swiper-slide {
          height: auto;
          display: flex;
          padding: 10px 0;
        }
        .testimonial-swiper .swiper-pagination-bullet-active {
          background: var(--color-brand-gold);
        }
        .testimonial-swiper .swiper-button-next,
        .testimonial-swiper .swiper-button-prev {
          color: var(--color-brand-green);
          background: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          border: 1px solid var(--color-brand-gold);
          padding: 10px;
          transition: all 0.3s ease;
        }
        .testimonial-swiper .swiper-button-prev {
          left: 0;
        }
        .testimonial-swiper .swiper-button-next {
          right: 0;
        }
        .testimonial-swiper .swiper-button-next:after,
        .testimonial-swiper .swiper-button-prev:after {
          font-size: 20px;
          font-weight: bold;
        }
        .testimonial-swiper .swiper-button-next:hover,
        .testimonial-swiper .swiper-button-prev:hover {
          background: var(--color-brand-gold);
          color: white;
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(250, 181, 25, 0.3);
        }
        @media (max-width: 768px) {
          .testimonial-swiper {
            padding-left: 0;
            padding-right: 0;
          }
          .testimonial-swiper .swiper-button-next,
          .testimonial-swiper .swiper-button-prev {
            display: none;
          }
        }
      `,
        }}
      />
    </section>
  );
};

export default TestimonialsSlider;
