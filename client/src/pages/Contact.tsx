"use client";
import { useState, useRef, useEffect } from "react";
import CountryList from "country-list-with-dial-code-and-flag";
import heroImage from "@/assets/images/hero-cheese-board.jpg";
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
          c.dialCode.includes(search)
      )
    : allCountries;

  const selectedCountry = allCountries.find((c) => c.dialCode === dialCode);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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
          <MotionText className="block text-white font-medium tracking-[0.2em] mb-4 uppercase text-sm md:text-base">
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

                  <div className="space-y-4"> 
                    <div className="flex items-start gap-4 group bg-[#FADB9A]/20 p-6  py-8 shadow-md border-gray-300 border">
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

                    <div className="flex items-start gap-4 group bg-[#FADB9A]/20 p-6 py-8 shadow-md  border-gray-300 border">
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

                    <div className="flex items-start gap-4 group bg-[#FADB9A]/20 p-6 py-8 shadow-md border-gray-300 border">
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

                    <div className="flex items-start gap-4 group bg-[#FADB9A]/20 shadow-md p-6 py-8 border-gray-300 border">
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
                <div className="bg-white p-8 md:p-10 rounded-sm shadow-xl border border-green relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50"></div>

                  <h2
                    className="text-3xl font-bold mb-2 text-green"
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

                    {/* Mobile Number with Country Code */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-text/80 uppercase tracking-wide">
                        Mobile Number 
                      </label>
                      <div className="flex gap-2">
                        {/* Custom country code dropdown */}
                        <div className="relative shrink-0" ref={dropdownRef}>
                          <button
                            type="button"
                            onClick={() => { setDropdownOpen(!dropdownOpen); setSearch(""); }}
                            className="flex items-center gap-1.5 px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all text-sm h-full"
                            style={{ minWidth: "92px" }}
                          >
                            <span className="text-xl leading-none">{selectedCountry?.flag}</span>
                            <span className="font-medium text-gray-700">{dialCode}</span>
                            <svg className={`w-3 h-3 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                                />
                              </div>
                              {/* Country list */}
                              <ul className="max-h-56 overflow-y-auto divide-y divide-gray-50">
                                {filteredCountries.length === 0 ? (
                                  <li className="px-4 py-3 text-sm text-gray-400 text-center">No results found</li>
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
                                          dialCode === country.dialCode ? "bg-secondary/10 font-semibold" : ""
                                        }`}
                                      >
                                        <span className="text-xl leading-none w-7 text-center">{country.flag}</span>
                                        <span className="flex-1 truncate text-gray-700">{country.name}</span>
                                        <span className="text-gray-400 font-mono text-xs">{country.dialCode}</span>
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
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                          placeholder="9876543210"
                          pattern="[0-9\s\-()]+"
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
