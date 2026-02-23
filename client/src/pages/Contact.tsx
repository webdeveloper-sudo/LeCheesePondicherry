"use client";
import { useState } from "react";
import heroImage from "@/assets/images/hero-cheese-board.jpg";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  MotionContainer,
  MotionHeading,
  MotionText,
} from "@/components/ui/MotionPrimitives";
import { fadeUp, staggerContainer } from "@/animations/variants";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.target as HTMLFormElement);
    const emailPayload = {
      to: "technicalhead@achariya.org",
      subject: `New Inquiry from Le Pondicherry Cheese Contact Form`,
      body: `
                Brand: Le Pondicherry Cheese
                From: ${formData.get("name")} (${formData.get("email")})
                Message: ${formData.get("message")}
            `.trim(),
    };

    // Simulate API call
    setTimeout(() => {
      console.log("MOCK EMAIL SEND:", emailPayload);
      setStatus("success");
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setStatus("idle"), 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background-cream">
      {/* Enhanced Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <MotionContainer
          className="container mx-auto px-4 relative z-10 text-center"
          stagger
        >
          <MotionText className="block text-secondary font-medium tracking-[0.2em] mb-4 uppercase text-sm md:text-base">
            Get in Touch
          </MotionText>
          <MotionHeading
            as="h1"
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-lg"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Contact Us
          </MotionHeading>
          <MotionText className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
            We'd love to hear from you. Visit our tasting room or reach out
            online.
          </MotionText>
        </MotionContainer>
      </section>

      <section className="py-24 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[url('/assets/pattern.png')] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <MotionContainer
              className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-12"
              stagger
            >
              {/* Contact Information Column */}
              <div className="lg:col-span-5 space-y-12">
                <motion.div variants={fadeUp}>
                  <h2
                    className="text-4xl font-bold mb-6 text-text"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Visit Our Fromagerie
                  </h2>
                  <p className="text-text-light text-lg leading-relaxed mb-8">
                    Experience the art of cheese making firsthand. Our facility
                    is open for tours and tastings by appointment.
                  </p>

                  <div className="space-y-8">
                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                        <MapPin className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl mb-1 text-text">
                          Our Location
                        </h3>
                        <p className="text-text-light leading-relaxed">
                          AGOC Food Park, Auroville Road
                          <br />
                          Pondicherry - 605101, India
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                        <Mail className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl mb-1 text-text">
                          Email Us
                        </h3>
                        <a
                          href="mailto:hello@lepondycheese.com"
                          className="text-text-light hover:text-secondary transition-colors"
                        >
                          hello@lepondycheese.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                        <Phone className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl mb-1 text-text">
                          Call Us
                        </h3>
                        <a
                          href="tel:+914132234567"
                          className="text-text-light hover:text-secondary transition-colors"
                        >
                          +91 413 2234 567
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                        <Clock className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl mb-1 text-text">
                          Opening Hours
                        </h3>
                        <p className="text-text-light">
                          Mon - Sat: 9:00 AM - 6:00 PM
                          <br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Contact Form Column */}
              <motion.div className="lg:col-span-7" variants={fadeUp}>
                <div className="bg-white p-8 md:p-10 rounded-xl shadow-xl border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50"></div>

                  <h2
                    className="text-3xl font-bold mb-2 text-text"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Send us a Message
                  </h2>
                  <p className="text-text-light mb-8">
                    Have a question about our cheeses or want to place a bulk
                    order? Fill out the form below.
                  </p>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-text/80 uppercase tracking-wide">
                          Name
                        </label>
                        <input
                          name="name"
                          type="text"
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-text/80 uppercase tracking-wide">
                          Email
                        </label>
                        <input
                          name="email"
                          type="email"
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-text/80 uppercase tracking-wide">
                        Message
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all resize-none"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>

                    {status === "success" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <p>
                          Message sent successfully! We'll be in touch soon.
                        </p>
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      className={`btn btn-primary w-full md:w-auto min-w-[200px] py-4 text-base tracking-wide shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden ${status === "loading" ? "opacity-80 cursor-wait" : ""}`}
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin h-5 w-5" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Send Message
                          <Send className="w-4 h-4" />
                        </span>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            </MotionContainer>
          </div>
        </div>
      </section>

      {/* Map Section Placeholder or Additional decorative section could go here */}
    </div>
  );
}
