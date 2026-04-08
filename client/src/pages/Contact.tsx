"use client";
import { useState, useRef, useEffect } from "react";
import CountryList from "country-list-with-dial-code-and-flag";
import heroImage from "@/assets/images/hero-cheese-board.webp";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import SubmissionSuccessModal from "@/components/ui/SubmissionSuccessModal";
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
import Outlet from "@/components/Outlet";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [modalOpen, setModalOpen] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [dialCode, setDialCode] = useState("+91");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allCountries = CountryList.getAll();
  const filteredCountries = search
    ? allCountries.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dialCode.includes(search),
      )
    : allCountries;

  const selectedCountry = allCountries.find((c) => c.dialCode === dialCode);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.target as HTMLFormElement);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      dialCode: dialCode,
      mobile: formData.get("mobile") || "",
      message: formData.get("message"),
    };

    try {
      const res = await fetch(import.meta.env.VITE_APPSCRIPT_URL_GENERAL, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("idle");
        setReferenceId(data.referenceId || "");
        setModalOpen(true);
        (e.target as HTMLFormElement).reset();
        setDialCode("+91");
      } else {
        console.error("AppScript error:", data.message);
        setStatus("idle");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-pattern">
      {/* Hero Banner */}
      <BannerAndBreadCrumb title="Contact Us" img={heroImage} />

      <section className="py-24 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <MotionContainer
              className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-12"
              stagger
            >
              {/* Contact Information Column */}
              <div className="lg:col-span-5 space-y-6">
                <motion.div variants={fadeUp}>
                  {/* <h2
                    className="text-4xl font-bold mb-6 text-text"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Visit Our Fromagerie
                  </h2>
                  <p className="text-text-light text-lg leading-relaxed mb-8">
                    Experience the art of cheese making firsthand. Our facility
                    is open for tours and tastings by appointment.
                  </p> */}

                  <h2
                    className="text-3xl font-boldtext-brand-green mb-5"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Reach Us
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 group bg-bg-cream-light p-6  py-8 shadow-md border-gray-300 border">
                      <div className="w-12 h-12 rounded-full bg-brand-gold-subtle/10 flex items-center justify-center shrink-0 group-hover:bg-brand-gold-subtle/20 transition-colors">
                        <MapPin className="w-6 h-6 text-brand-gold-subtle" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl mb-1 text-text-primary">
                          Our Location
                        </h3>
                        <p className="text-text-secondary leading-relaxed">
                          AGOC Food Park, Auroville Road
                          <br />
                          Pondicherry - 605101, India
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group bg-bg-cream-light p-6 py-8 shadow-md  border-gray-300 border">
                      <div className="w-12 h-12 rounded-full bg-brand-gold-subtle/10 flex items-center justify-center shrink-0 group-hover:bg-brand-gold-subtle/20 transition-colors">
                        <Mail className="w-6 h-6 text-brand-gold-subtle" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl mb-1 text-text-primary">
                          Email Us
                        </h3>
                        <a
                          href="mailto:vp.expansions@hopemarket.in"
                          className="text-text-secondary hover:text-brand-gold-subtle transition-colors"
                        >
                          vp.expansions@hopemarket.in
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group bg-bg-cream-light p-6 py-8 shadow-md border-gray-300 border">
                      <div className="w-12 h-12 rounded-full bg-brand-gold-subtle/10 flex items-center justify-center shrink-0 group-hover:bg-brand-gold-subtle/20 transition-colors">
                        <Phone className="w-6 h-6 text-brand-gold-subtle" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl mb-1 text-text-primary">
                          Call Us
                        </h3>
                        <a
                          href="tel:+917200504628"
                          className="text-text-secondary hover:text-brand-gold-subtle transition-colors"
                        >
                          +91 72005 04628
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group bg-bg-cream-light shadow-md p-6 py-8 border-gray-300 border">
                      <div className="w-12 h-12 rounded-full bg-brand-gold-subtle/10 flex items-center justify-center shrink-0 group-hover:bg-brand-gold-subtle/20 transition-colors">
                        <Clock className="w-6 h-6 text-brand-gold-subtle" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl mb-1 text-text-primary">
                          Opening Hours
                        </h3>
                        <p className="text-text-secondary">
                          Mon - Sat: 9:00 AM - 6:00 PM
                          <br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                    <h2
                      className="text-3xl font-boldtext-brand-green mt-5"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Follow us on
                    </h2>
                    <div>
                      <div className="flex justify-start md:justify-start gap-5 mt-2">
                        {[
                          {
                            href: "https://www.facebook.com/people/LepondicherryCheese/61579368624195/",
                            path: "M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z",
                          },
                          {
                            href: "https://www.instagram.com/lepondicherrycheese",
                            path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
                          },
                          {
                            href: "https://www.youtube.com/@lepondicherrycheese",
                            path: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z",
                          },
                          {
                            href: "https://www.linkedin.com/company/le-pondicherry-cheese",
                            path: "M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z",
                          },
                        ].map((social, i) => (
                          <a
                            key={i}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-15 h-15 rounded-full backdrop-blur-sm  text-brand-gold-subtle hover:bg-[#F9B618] hover:text-brand-green hover:border-brand-gold-subtle transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:shadow-lg group"
                          >
                            <svg
                              className="w-8 h-8 transition-transform duration-300 group-hover:scale-110"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d={social.path} />
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Contact Form Column */}
              <motion.div className="lg:col-span-7" variants={fadeUp}>
                <div className="bg-white p-8 md:p-10 rounded-sm shadow-xl border border-gray-300 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold-subtle to-transparent opacity-50"></div>

                  <h2
                    className="text-3xl font-bold mb-2 text-brand-green"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Send us a Message
                  </h2>
                  <p className="text-md py-2 mb-8">
                    Have a question about our cheeses or want to place a bulk
                    order? Fill out the form below.
                  </p>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-3">
                        <label className="block text-xs mb-2 font-medium text-text/80 uppercase tracking-wide">
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
                        <label className="block text-xs mb-2 font-medium text-text/80 uppercase tracking-wide">
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

                    {/* Mobile Number with Country Code */}
                    <div className="space-y-2">
                      <label className="block text-xs mb-2 font-medium text-text/80 uppercase tracking-wide">
                        Mobile Number
                      </label>
                      <div className="flex gap-2">
                        {/* Custom country code dropdown */}
                        <div className="relative shrink-0" ref={dropdownRef}>
                          <button
                            type="button"
                            onClick={() => {
                              setDropdownOpen(!dropdownOpen);
                              setSearch("");
                            }}
                            className="flex items-center gap-1.5 px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-brand-gold-subtle focus:outline-none focus:ring-2 focus:ring-brand-gold-subtle/50 transition-all text-sm h-full"
                            style={{ minWidth: "92px" }}
                          >
                            <span className="text-xl leading-none">
                              {selectedCountry?.flag}
                            </span>
                            <span className="font-medium text-gray-700">
                              {dialCode}
                            </span>
                            <svg
                              className={`w-3 h-3 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
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

                          {dropdownOpen && (
                            <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                              {/* Search */}
                              <div className="p-2 border-b border-gray-100">
                                <input
                                  autoFocus
                                  type="text"
                                  placeholder="Search country or code..."
                                  value={search}
                                  onChange={(e) => setSearch(e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold-subtle/50"
                                />
                              </div>
                              {/* Country list */}
                              <ul className="max-h-56 overflow-y-auto divide-y divide-gray-50">
                                {filteredCountries.length === 0 ? (
                                  <li className="px-4 py-3 text-sm text-gray-400 text-center">
                                    No results found
                                  </li>
                                ) : (
                                  filteredCountries.map((country, i) => (
                                    <li key={`${country.code}-${i}`}>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setDialCode(country.dialCode);
                                          setDropdownOpen(false);
                                          setSearch("");
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-left ${
                                          dialCode === country.dialCode
                                            ? "bg-brand-gold-subtle/10 font-semibold"
                                            : ""
                                        }`}
                                      >
                                        <span className="text-xl leading-none w-7 text-center">
                                          {country.flag}
                                        </span>
                                        <span className="flex-1 truncate text-gray-700">
                                          {country.name}
                                        </span>
                                        <span className="text-gray-400 font-mono text-xs">
                                          {country.dialCode}
                                        </span>
                                      </button>
                                    </li>
                                  ))
                                )}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Phone number input */}
                        <input
                          name="mobile"
                          type="tel"
                          maxLength={15}
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold-subtle/50 focus:border-brand-gold-subtle transition-all"
                          placeholder="9876543210"
                          pattern="[0-9\s\-()]+"
                        />
                      </div>
                    </div>
                    {/* Preferred Contact Method */}
                    <div className="space-y-2">
                      <label className="block text-xs mb-2 font-medium text-text/80 uppercase tracking-wide">
                        Preferred Contact Method
                      </label>

                      <div className="flex gap-6 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="whatsapp"
                            className="w-4 h-4 text-secondary border-gray-300 focus:ring-secondary"
                            required
                          />
                          <span className="text-sm text-gray-700">
                            WhatsApp
                          </span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="message"
                            className="w-4 h-4 text-secondary border-gray-300 focus:ring-secondary"
                          />
                          <span className="text-sm text-gray-700">Call</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs mb-2 font-medium text-text/80 uppercase tracking-wide">
                        Message
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold-subtle/50 focus:border-brand-gold-subtle transition-all resize-none"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>

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
      {/* ── Brand By Strip ──────────────────────────────────────────────────────── */}
      <section className="bg-brand-green py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <MotionContainer stagger>
              <MotionText className="text-brand-gold uppercase tracking-widest text-xs font-semibold mb-2">
                A Brand By
              </MotionText>
              <MotionHeading
                as="h3"
                className="text-2xl md:text-3xl text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Comatha Agro &amp; Dairy Enterprises Pvt. Ltd.
              </MotionHeading>
            </MotionContainer>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="max-w-sm text-white/70 text-sm leading-relaxed border-l border-brand-gold/40 pl-6"
            >
              Founded in 2019 by Dr. Arawindhan J., what began as a farm-based
              dairy initiative has grown into a modern dairy processing
              enterprise — rooted in ethical practices and a quality-first
              philosophy.
            </motion.div>
          </div>
        </div>
      </section>
      <section>
        <Outlet />
      </section>

      {/* Map Section Placeholder */}

      {/* Success Modal */}
      <SubmissionSuccessModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Message Sent!"
        message="Thank you for reaching out. Our team will get back to you shortly."
        referenceId={referenceId}
      />
    </div>
  );
}
