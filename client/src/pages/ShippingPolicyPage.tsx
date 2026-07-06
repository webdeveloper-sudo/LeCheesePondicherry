import { motion } from "framer-motion";
import { fadeUp } from "@/animations/variants";
import {
  MotionContainer,
  MotionHeading,
  MotionText,
} from "@/components/ui/MotionPrimitives";

export default function ShippingPolicyPage() {
  const lastUpdated = "July 6, 2026";

  return (
    <div className="bg-pattern py-10 min-h-screen">
      <div className="container bg-bg-cream-light border border-gray-200 mx-auto px-4 max-w-4xl">
        <MotionContainer stagger>
          <div className="flex px-5 justify-between items-center">
            <MotionHeading
              as="h1"
              className="text-4xl md:text-5xl font-bold my-8 text-green"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Shipping Policy
            </MotionHeading>
            <MotionText className="text-text-secondary md:block hidden text-end mb-8 italic">
              Last Updated: {lastUpdated}
            </MotionText>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-100 mb-8">
            <div className="space-y-12">
              <MotionText className="text-text-secondary md:hidden block text-end mb-8 italic">
                Last Updated: {lastUpdated}
              </MotionText>

              {/* Introduction Section */}
              <motion.section variants={fadeUp}>
                <p className="text-text-secondary leading-relaxed mb-6 text-justify">
                  At Le Pondicherry Cheese, we craft artisanal, premium cheeses and dairy products. 
                  Because our products are highly perishable, we handle every order with the utmost care, 
                  utilizing premium packaging and robust logistics to ensure your cheese arrives fresh and in perfect condition.
                </p>
              </motion.section>

              {/* Shipping Regions & Delivery Timelines */}
              <motion.section variants={fadeUp}>
                <h2
                  className="text-2xl font-bold mb-4 text-brand-green"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Shipping Regions & Delivery Timelines
                </h2>
                <p className="text-text-secondary mb-4">
                  We ship our premium artisanal cheese products across India. Depending on your location, estimated delivery timelines are as follows:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div className="p-5 bg-bg-cream-light rounded-lg border border-gray-100 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-text-primary text-lg mb-2">Within Pondicherry</h4>
                      <p className="text-sm text-text-secondary">Direct local deliveries handled with priority.</p>
                    </div>
                    <div className="mt-4 font-bold text-brand-green text-xl">Max 2 Days</div>
                  </div>
                  <div className="p-5 bg-bg-cream-light rounded-lg border border-gray-100 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-text-primary text-lg mb-2">Within Tamil Nadu</h4>
                      <p className="text-sm text-text-secondary">Shipped via reliable regional partners.</p>
                    </div>
                    <div className="mt-4 font-bold text-brand-green text-xl">3 – 5 Days</div>
                  </div>
                  <div className="p-5 bg-bg-cream-light rounded-lg border border-gray-100 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-text-primary text-lg mb-2">Outside Tamil Nadu</h4>
                      <p className="text-sm text-text-secondary">Shipped across India with express delivery.</p>
                    </div>
                    <div className="mt-4 font-bold text-brand-green text-xl">3 – 5 Days</div>
                  </div>
                </div>
                <p className="text-xs text-text-secondary italic">
                  Note: While we strive to meet these timelines, delivery may occasionally vary slightly due to logistics operations, public holidays, or external factors beyond our control.
                </p>
              </motion.section>

              {/* Shipping Charges */}
              <motion.section variants={fadeUp}>
                <h2
                  className="text-2xl font-bold mb-4 text-brand-green"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Shipping Charges & Rates
                </h2>
                <p className="text-text-secondary mb-4">
                  To cover the cost of premium temperature-controlled transit, shipping fees are calculated per 1 kg weight slab based on your delivery address:
                </p>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-100 rounded-lg overflow-hidden text-sm">
                    <thead className="bg-bg-cream-light">
                      <tr>
                        <th className="px-6 py-3 text-left font-bold text-text-primary uppercase tracking-wider">Region / Zone</th>
                        <th className="px-6 py-3 text-left font-bold text-text-primary uppercase tracking-wider">Examples / Details</th>
                        <th className="px-6 py-3 text-left font-bold text-text-primary uppercase tracking-wider">Rate (per 1 kg slab)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-text-secondary">
                      <tr>
                        <td className="px-6 py-4 font-semibold text-text-primary">Pondicherry & Tamil Nadu</td>
                        <td className="px-6 py-4">Local Pondicherry addresses and all locations in Tamil Nadu</td>
                        <td className="px-6 py-4 font-bold text-brand-green">₹50</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-text-primary">South India</td>
                        <td className="px-6 py-4">Kerala, Karnataka, Andhra Pradesh, Telangana</td>
                        <td className="px-6 py-4 font-bold text-brand-green">₹70</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-text-primary">Metro Cities</td>
                        <td className="px-6 py-4">Mumbai, Kolkata, Delhi / NCR</td>
                        <td className="px-6 py-4 font-bold text-brand-green">₹80</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-text-primary">Special Zones</td>
                        <td className="px-6 py-4">Jammu & Kashmir, Meghalaya, Nagpur</td>
                        <td className="px-6 py-4 font-bold text-brand-green">₹110</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-text-primary">Rest of India</td>
                        <td className="px-6 py-4">All other states and union territories</td>
                        <td className="px-6 py-4 font-bold text-brand-green">₹90</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-text-secondary mt-3 italic">
                  Note: Total shipping charges are computed automatically at checkout. Any partial weight is rounded up to the next full 1 kg slab.
                </p>
              </motion.section>

              {/* Premium Packaging & Handling */}
              <motion.section variants={fadeUp}>
                <div className="p-6 bg-brand-green text-white rounded-lg">
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Premium Cold Chain Packaging & Handling
                  </h3>
                  <p className="text-sm opacity-90 leading-relaxed text-justify mb-4">
                    Since cheese is a highly delicate and temperature-sensitive food product, all shipments are carefully handled and packed in our premium insulated cold chain packaging. We incorporate food-grade cooling gel ice packs to buffer temperature changes and lock in freshness throughout transit.
                  </p>
                  <p className="text-sm font-bold border-t border-white/20 pt-2">
                    CRITICAL: Please ensure that someone is available to collect the package upon arrival, and place the cheese products in the refrigerator immediately.
                  </p>
                </div>
              </motion.section>

              {/* Order Processing & Dispatch */}
              <motion.section variants={fadeUp}>
                <h2
                  className="text-2xl font-bold mb-4 text-brand-green"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Order Processing & Dispatch
                </h2>
                <ul className="list-disc pl-5 text-text-secondary space-y-2">
                  <li>
                    Orders are processed and packaged within 1–2 business days of payment confirmation.
                  </li>
                  <li>
                    To avoid transit delays over weekends where packages might sit in courier depots, we only dispatch long-distance shipments from Monday through Thursday.
                  </li>
                  <li>
                    Once dispatched, you will receive tracking coordinates via Email or WhatsApp to monitor your shipment's journey.
                  </li>
                </ul>
              </motion.section>
            </div>
          </div>
        </MotionContainer>
      </div>
    </div>
  );
}
