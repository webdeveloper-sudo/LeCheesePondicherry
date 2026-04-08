import { motion } from "framer-motion";

import {
  fadeUp,
  staggerContainer,
  headingVariant,

  viewportConfig,
} from "@/animations/variants";
import {

  MapPin,
 
} from "lucide-react";

const Outlet = () => {
    const outlets = [
  {
    name: "Pondicherry Flagship",
    address: "Auroville Road, Pondicherry",
    status: "Flagship Store",
    image:
      "https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Chennai Bistro",
    address: "Adyar, Chennai",
    status: "Experience Center",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Bangalore Gourmet",
    address: "Indiranagar, Bangalore",
    status: "Partner Outlet",
    image:
      "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?q=80&w=2070&auto=format&fit=crop",
  },
];
  return (
    <div>
        {/* ── Outlets ────────────────────────────────────────────────────────────── */}
              <div className="bg-pattern">
                <section className="py-20">
                  <div className="container mx-auto px-4">
                    {/* Header */}
                    <motion.div
                      className="text-center mb-16"
                      variants={headingVariant}
                      initial="hidden"
                      whileInView="visible"
                      viewport={viewportConfig}
                    >
                      <p className="text-brand-gold uppercase tracking-widest text-sm font-semibold mb-3">
                        Find Us
                      </p>
                      <h2
                        className="text-3xl md:text-4xl font-heading text-brand-green mb-4"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        Our Premium Outlets
                      </h2>
                      <p className="text-text-secondary max-w-2xl mx-auto">
                        Experience our full range of artisanal cheeses at these select
                        locations across Pondicherry and beyond.
                      </p>
                    </motion.div>
        
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-3 gap-8"
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                      viewport={viewportConfig}
                    >
                      {outlets.map((outlet, index) => (
                        <motion.div
                          key={index}
                          variants={fadeUp}
                          className="group cursor-pointer"
                        >
                          {/* Image */}
                          <div className="aspect-video bg-gray-100 overflow-hidden relative mb-6 rounded-2xl shadow-md">
                            <img
                              src={outlet.image}
                              alt={outlet.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            {/* Status badge */}
                            <div className="absolute top-4 right-4 bg-brand-gold text-brand-green text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                              {outlet.status}
                            </div>
                            {/* Bottom overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-green/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </div>
                          <h3
                            className="text-xl font-heading text-brand-green mb-2"
                            style={{ fontFamily: "var(--font-heading)" }}
                          >
                            {outlet.name}
                          </h3>
                          <div className="flex items-center gap-2 text-text-secondary">
                            <MapPin size={15} className="text-brand-gold flex-shrink-0" />
                            <span className="text-sm">{outlet.address}</span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </section>
              </div>
    </div>
  )
}

export default Outlet