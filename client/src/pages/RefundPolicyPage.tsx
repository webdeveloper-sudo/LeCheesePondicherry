import { motion } from "framer-motion";
import { fadeUp } from "@/animations/variants";
import {
  MotionContainer,
  MotionHeading,
  MotionText,
} from "@/components/ui/MotionPrimitives";

export default function RefundPolicyPage() {
  const lastUpdated = "March 11, 2026";

  return (
    <div className="min-h-screen bg-pattern py-10">
      <div className="container bg-[#FAF7F2]  border border-gray-200 mx-auto px-4 max-w-4xl">
        <MotionContainer stagger>
          <MotionHeading
            as="h1"
            className="text-4xl md:text-5xl font-bold my-8 text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Refund & Shipping Policy
          </MotionHeading>

          <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-100">
            <MotionText className="text-[#6B6B6B] mb-8 italic">
              Last Updated: {lastUpdated}
            </MotionText>

            <div className="space-y-12">
              <motion.section variants={fadeUp}>
                <h2
                  className="text-2xl font-bold mb-4 text-[#2C5530]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  3. Refund & Return Policy
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed mb-6">
                  Due to the perishable nature of cheese and dairy products,
                  returns are limited.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">
                      Eligible Refund Situations
                    </h3>
                    <p className="text-[#6B6B6B] mb-2">
                      Refunds may be considered if:
                    </p>
                    <ul className="list-disc pl-5 text-[#6B6B6B] space-y-1">
                      <li>The product arrives damaged during transit</li>
                      <li>The product is spoiled upon delivery</li>
                      <li>The wrong item was delivered</li>
                      <li>The product packaging is tampered</li>
                      <li>
                        The product received is significantly different from the
                        order placed
                      </li>
                    </ul>
                    <p className="text-[#6B6B6B] mt-4 font-medium">
                      Customers must notify us within 24 hours of receiving the
                      product, along with clear photo or video evidence of the
                      issue.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">
                      Non-Refundable Situations
                    </h3>
                    <p className="text-[#6B6B6B] mb-2">
                      Refunds cannot be provided for:
                    </p>
                    <ul className="list-disc pl-5 text-[#6B6B6B] space-y-1">
                      <li>
                        Incorrect shipping address or contact details provided
                        by the customer
                      </li>
                      <li>
                        Delivery delays caused by third-party logistics partners
                      </li>
                      <li>
                        Change of mind after the order has been dispatched
                      </li>
                      <li>
                        Products that have been partially consumed or opened
                      </li>
                      <li>Requests made after the 24-hour reporting window</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">
                      Refund Process
                    </h3>
                    <p className="text-[#6B6B6B] mb-2">
                      Once the claim is verified:
                    </p>
                    <ul className="list-disc pl-5 text-[#6B6B6B] space-y-1">
                      <li>
                        Our team will review the request and may contact you for
                        additional information
                      </li>
                      <li>
                        Refunds or replacements will be approved based on
                        verification
                      </li>
                      <li>Refunds will be processed within 5–7 business days</li>
                      <li>
                        The amount will be credited to the original payment
                        method
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">
                      Order Cancellation
                    </h3>
                    <p className="text-[#6B6B6B] leading-relaxed">
                      Orders may be cancelled before they are dispatched. Once
                      the order has been shipped, cancellations may not be
                      possible due to the perishable nature of the products.
                    </p>
                  </div>
                </div>
              </motion.section>

              <motion.section variants={fadeUp}>
                <h2
                  className="text-2xl font-bold mb-4 text-[#2C5530]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  4. Shipping Policy
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">
                      Shipping Locations
                    </h3>
                    <p className="text-[#6B6B6B]">
                      We currently ship across India. Some remote locations may
                      have delivery limitations.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">
                      Order Processing
                    </h3>
                    <p className="text-[#6B6B6B]">
                      Orders are typically processed within 1–2 business days
                      after payment confirmation.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">
                      Delivery Timeline
                    </h3>
                    <p className="text-[#6B6B6B] mb-2">
                      Estimated delivery times:
                    </p>
                    <ul className="list-disc pl-5 text-[#6B6B6B] space-y-1">
                      <li>Pondicherry: Within 24 hours</li>
                      <li>Tamil Nadu: 2–4 business days</li>
                      <li>Rest of India: Within 5–7 business days</li>
                      <li>Metro Cities: 2–4 business days</li>
                    </ul>
                    <p className="text-xs text-[#6B6B6B] mt-2 italic">
                      Delivery timelines may vary slightly depending on
                      location, logistics operations, and external factors
                      beyond our control.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">
                      Shipping Charges
                    </h3>
                    <p className="text-[#6B6B6B] mb-2">
                      Shipping charges are calculated based on:
                    </p>
                    <ul className="list-disc pl-5 text-[#6B6B6B] space-y-1">
                      <li>Order weight</li>
                      <li>Delivery location</li>
                      <li>Shipping method</li>
                    </ul>
                    <p className="text-[#6B6B6B] mt-2 text-justify">
                      The final shipping cost will be displayed at checkout
                      prior to payment confirmation. Applicable payment gateway
                      processing fees and delivery charges, where applicable,
                      may be included in the final order value displayed during
                      checkout.
                    </p>
                  </div>

                  <div className="p-6 bg-[#2C5530] text-white rounded-lg">
                    <h3
                      className="text-xl font-bold mb-3"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Cold Chain Packaging
                    </h3>
                    <p className="text-sm opacity-90 leading-relaxed text-justify mb-4">
                      To maintain freshness and quality, our cheeses are shipped
                      using temperature-controlled insulated packaging.
                    </p>
                    <p className="text-sm font-bold border-t border-white/20 pt-2">
                      Important: Customers are advised to refrigerate the
                      products immediately upon delivery.
                    </p>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>
        </MotionContainer>
      </div>
    </div>
  );
}
