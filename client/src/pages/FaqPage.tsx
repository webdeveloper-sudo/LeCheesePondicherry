"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MotionContainer,
  MotionHeading,
  MotionText,
} from "@/components/ui/MotionPrimitives";
import { motion } from "framer-motion";
import { fadeUp } from "@/animations/variants";

const faqs = [
  {
    category: "Ordering & Portal",
    questions: [
      {
        q: "How do I create an account on the cheese portal?",
        a: "You can sign in using your Google account or your email address during the checkout process. This will automatically create your profile where you can see order history.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes, we use Razorpay for all our transactions. We do not store any credit card or banking information on our servers.",
      },
      {
        q: "What if I forget my login email?",
        a: "Please contact us at technicalhead@achariya.org with your order ID or phone number, and we will help you regain access.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "How do you ship cheese in the heat?",
        a: "We use high-grade thermal insulation and gel packs. Every box is designed to maintain a safe temperature (2°C-8°C) for up to 72 hours in transit.",
      },
      {
        q: "What are the shipping charges?",
        a: "Shipping is FREE for orders above ₹1500. For orders below ₹1500, a flat fee of ₹99 is charged.",
      },
      {
        q: "Which cities do you deliver to?",
        a: "We deliver PAN India, covering all major metros and most tier-1 cities.",
      },
    ],
  },
  {
    category: "Product & Storage",
    questions: [
      {
        q: "Are your cheeses vegetarian?",
        a: "Yes! 100% of Le Pondicherry cheeses are vegetarian. We use microbial rennet, never animal-derived enzymes.",
      },
      {
        q: "How should I store the cheese once it arrives?",
        a: "Transfer the cheese to your refrigerator immediately. Keep it in its original parchment or breathable wrap. Avoid plastic wrap as it 'suffocates' the cheese.",
      },
      {
        q: "My cheese has a bit of surface mold, is it spoiled?",
        a: "For hard cheeses like Cheddar, surface mold is natural and can be scraped off. For soft cheeses like Brie, white mold is part of the rind and is perfectly edible!",
      },
    ],
  },
  {
    category: "Wholesale & Business",
    questions: [
      {
        q: "Do you supply to hotels and cafes?",
        a: "Absolutely! We partner with premium establishments. Please visit our 'Wholesale' section to submit an inquiry for B2B pricing.",
      },
      {
        q: "Can I customize a gift hamper for my company?",
        a: "Yes, we offer corporate gifting solutions. You can choose specific assortments and add custom notes.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <MotionContainer className="text-center mb-16" stagger>
          <MotionHeading
            as="h1"
            className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Frequently Asked Questions
          </MotionHeading>
          <MotionText className="text-[#6B6B6B] max-w-2xl mx-auto">
            Everything you need to know about our handcrafted cheese, shipping
            logistics, and the AGOC portal.
          </MotionText>
        </MotionContainer>

        <div className="space-y-12">
          {faqs.map((cat, catIdx) => (
            <MotionContainer key={catIdx} stagger>
              <MotionHeading
                as="h2"
                className="text-xl font-bold text-[#2C5530] mb-6 border-b border-[#2C5530]/10 pb-2 uppercase tracking-wider text-sm"
              >
                {cat.category}
              </MotionHeading>
              <MotionContainer className="space-y-4" stagger>
                {cat.questions.map((faq, faqIdx) => {
                  const id = `${catIdx}-${faqIdx}`;
                  const isOpen = openIndex === id;
                  return (
                    <motion.div
                      key={faqIdx}
                      variants={fadeUp}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : id)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-[#1A1A1A] pr-8">
                          {faq.q}
                        </span>
                        <svg
                          className={`w-5 h-5 text-[#C9A961] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                          <p className="text-[#6B6B6B] leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </MotionContainer>
            </MotionContainer>
          ))}
        </div>

        {/* Still have questions? */}
        <div className="mt-20 bg-[#2C5530] rounded-2xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10">
            <h3
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Still have questions?
            </h3>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              Our team is here to help you choose the perfect cheese or assist
              with your portal queries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/wholesale"
                className="px-8 py-3 bg-[#FAB519] text-[#1D161A] rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
              >
                Wholesale Inquiry
              </Link>
              <a
                href="mailto:technicalhead@achariya.org"
                className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-full font-bold hover:bg-white/20 transition-all"
              >
                Email Technical Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
