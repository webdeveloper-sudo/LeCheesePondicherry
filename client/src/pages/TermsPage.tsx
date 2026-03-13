import { motion } from "framer-motion";
import { fadeUp } from "@/animations/variants";
import {
  MotionContainer,
  MotionHeading,
  MotionText,
} from "@/components/ui/MotionPrimitives";

export default function TermsPage() {
  const lastUpdated = "March 11, 2026";

  return (
    <div className="min-h-screen bg-pattern py-10">
      <div className="container mx-auto  border border-gray-200 bg-white max-w-4xl">
        <MotionContainer stagger>
          <MotionHeading
            as="h1"
            className="text-4xl md:text-5xl font-bold my-8 text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Terms & Conditions
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
                  Welcome to Le Pondicherry Cheese
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed">
                  Operated by Comatha Agro & Dairy Enterprises Private Limited.
                  By accessing our website or purchasing our products, you agree
                  to the following terms and policies. Please read them
                  carefully before using our services.
                </p>
              </motion.section>

              <motion.section variants={fadeUp}>
                <h2
                  className="text-2xl font-bold mb-4 text-[#2C5530]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  1. Terms of Service
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">
                      Website Use
                    </h3>
                    <p className="text-[#6B6B6B] mb-2">
                      By using this website, you agree to:
                    </p>
                    <ul className="list-disc pl-5 text-[#6B6B6B] space-y-1">
                      <li>Provide accurate information when placing orders</li>
                      <li>Use the website only for lawful purposes</li>
                      <li>Not attempt to disrupt or misuse the website</li>
                    </ul>
                    <p className="text-[#6B6B6B] mt-2">
                      We reserve the right to refuse service or cancel orders if
                      fraudulent or suspicious activity is detected.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">
                      Product Information
                    </h3>
                    <p className="text-[#6B6B6B] mb-2 text-justify">
                      Le Pondicherry Cheese offers artisanal cheeses and premium
                      dairy products crafted using high-quality ingredients.
                      Because our products are fresh and perishable,
                      availability may vary depending on production batches and
                      seasonal milk supply.
                    </p>
                    <p className="text-[#6B6B6B] mb-2 font-medium">
                      We reserve the right to:
                    </p>
                    <ul className="list-disc pl-5 text-[#6B6B6B] space-y-1">
                      <li>Limit quantities of any product</li>
                      <li>Modify product descriptions or pricing</li>
                      <li>Discontinue products without prior notice.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">
                      Pricing
                    </h3>
                    <p className="text-[#6B6B6B] mb-2">
                      All prices listed on the website:
                    </p>
                    <ul className="list-disc pl-5 text-[#6B6B6B] space-y-1">
                      <li>Are in Indian Rupees (INR)</li>
                      <li>Include applicable taxes unless stated otherwise</li>
                      <li>Are subject to change without prior notice</li>
                    </ul>
                    <p className="text-[#6B6B6B] mt-2">
                      Shipping costs will be calculated during checkout.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">
                      Order Acceptance
                    </h3>
                    <p className="text-[#6B6B6B] mb-2 text-justify">
                      After placing an order, you will receive a confirmation
                      notification via Email or WhatsApp. However, orders are
                      subject to verification and product availability.
                    </p>
                    <p className="text-[#6B6B6B] mb-2 font-medium">
                      We reserve the right to cancel orders in cases of:
                    </p>
                    <ul className="list-disc pl-5 text-[#6B6B6B] space-y-1">
                      <li>Incorrect pricing</li>
                      <li>Stock unavailability</li>
                      <li>Payment verification issues.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">
                      Intellectual Property
                    </h3>
                    <p className="text-[#6B6B6B] text-justify">
                      All content on this website, including logos, images,
                      text, product descriptions, and branding, is the
                      intellectual property of Le Pondicherry Cheese and may not
                      be copied, reproduced, or used without permission.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">
                      Limitation of Liability
                    </h3>
                    <p className="text-[#6B6B6B] mb-2">
                      Le Pondicherry Cheese shall not be held responsible for:
                    </p>
                    <ul className="list-disc pl-5 text-[#6B6B6B] space-y-1">
                      <li>Indirect or incidental damages</li>
                      <li>Website interruptions or technical issues</li>
                      <li>Delays caused by third-party delivery partners.</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-[#2C5530] text-white rounded-lg">
                    <h3
                      className="text-xl font-bold mb-3"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Governing Law
                    </h3>
                    <p className="text-sm opacity-90 leading-relaxed text-justify">
                      These terms are governed by the laws of India. Any
                      disputes arising from the use of this website shall fall
                      under the jurisdiction of the courts in Pondicherry.
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
