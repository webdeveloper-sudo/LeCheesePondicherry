"use client";

import { Link } from "react-router-dom";
import SubmissionSuccessModal from "@/components/ui/SubmissionSuccessModal";
import { useState, useRef, useEffect } from "react";
import { MotionHeading, MotionText } from "@/components/ui/MotionPrimitives";
import { fadeUp } from "@/animations/variants";
import fssai from "@/assets/icons/fssai.webp";
import chef from "@/assets/icons/chef.webp";
import coldchain from "@/assets/icons/cold-chain.webp";
import CountryList from "country-list-with-dial-code-and-flag";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

export default function WholesalePage() {
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
      businessName: formData.get("businessName"),
      businessType: formData.get("businessType"),
      email: formData.get("email"),
      dialCode: dialCode,
      mobile: formData.get("mobile") || "",
      volume: formData.get("volume") || "",
    };

    try {
      const res = await fetch(import.meta.env.VITE_APPSCRIPT_URL_WHOLESALE, {
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
    <>
      <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Section */}
      <section className="bg-[#2C5530] py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Wholesale & Partnerships
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Elevate your menu with Pondicherry's finest handcrafted artisan
            cheeses.
          </p>
        </div>
      </section>

      {/* Signature Collection Intro Section */}
      {/* <section className="py-12 md:py-20 bg-pattern relative z-10 w-full">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <MotionHeading
              className="text-3xl md:text-4xl mb-4 block"
              style={{ fontFamily: "var(--font-heading)" }}
              variants={fadeUp}
            >
              Discover Our Signature Collection
            </MotionHeading>
            <MotionText
              className="text-[#6B6B6B] max-w-2xl mx-auto break-words"
              variants={fadeUp}
            >
              Handcrafted cheeses made using traditional French techniques and
              the finest local ingredients
            </MotionText>
          </div>
        </div>
      </section> */}

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2
                className="text-3xl font-bold mb-6 text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                For Restaurants, Hotels & Cafes
              </h2>
              <p className="text-[#6B6B6B] mb-6 leading-relaxed">
                Le Pondicherry Cheese currently partners with over 50 premium
                dining establishments across India. We provide master-crafted
                cheeses that serve as the centerpiece for gourmet cheese boards,
                signature pizzas, and sophisticated desserts.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-[#C9A961] font-bold">✓</span>
                  <span className="text-[#1A1A1A]">
                    Bulk pricing tiers for high-volume partners.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#C9A961] font-bold">✓</span>
                  <span className="text-[#1A1A1A]">
                    Custom maturation profiles for signature menu items.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#C9A961] font-bold">✓</span>
                  <span className="text-[#1A1A1A]">
                    Cold-chain logistics managed by AGOC Food Park.
                  </span>
                </li>
              </ul>
              <Link to="/contact" className="btn btn-primary">
                Request Price List
              </Link>
            </div>
            <div className="bg-white p-8 md:p-10 rounded-sm shadow-xl border border-green relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9A961] to-transparent opacity-50"></div>

              <h3
                className="text-3xl font-bold mb-2 text-[#2C5530]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Wholesale Inquiry
              </h3>
              <p className="text-md py-2 mb-6 text-[#6B6B6B]">
                Fill out the form and our wholesale team will reach out within 24 hours.
              </p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Business Name + Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#1A1A1A]/80 uppercase tracking-wide">
                      Business Name
                    </label>
                    <input
                      name="businessName"
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A961]/50 focus:border-[#C9A961] transition-all"
                      placeholder="Your business name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#1A1A1A]/80 uppercase tracking-wide">
                      Business Type
                    </label>
                    <select
                      name="businessType"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A961]/50 focus:border-[#C9A961] transition-all text-gray-700"
                    >
                      <option>Restaurant / Cafe</option>
                      <option>Hotel / Resort</option>
                      <option>Retail Store</option>
                      <option>Event / Catering</option>
                    </select>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#1A1A1A]/80 uppercase tracking-wide">
                    Contact Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A961]/50 focus:border-[#C9A961] transition-all"
                    placeholder="vp.expansions@hopemarket.in"
                  />
                </div>

                {/* Mobile Number with Country Code */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#1A1A1A]/80 uppercase tracking-wide">
                    Mobile Number
                  </label>
                  <div className="flex gap-2">
                    {/* Country code dropdown */}
                    <div className="relative shrink-0" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => { setDropdownOpen(!dropdownOpen); setSearch(""); }}
                        className="flex items-center gap-1.5 px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-[#C9A961] focus:outline-none focus:ring-2 focus:ring-[#C9A961]/50 transition-all text-sm h-full"
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
                          <div className="p-2 border-b border-gray-100">
                            <input
                              autoFocus
                              type="text"
                              placeholder="Search country or code..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A961]/50"
                            />
                          </div>
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
                                      dialCode === country.dialCode ? "bg-[#C9A961]/10 font-semibold" : ""
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

                    <input
                      name="mobile"
                      type="tel"
                      maxLength={15}
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A961]/50 focus:border-[#C9A961] transition-all"
                      placeholder="9876543210"
                      pattern="[0-9\s\-()]+"
                    />
                  </div>
                </div>

                {/* Volume */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#1A1A1A]/80 uppercase tracking-wide">
                    Expected Monthly Volume
                  </label>
                  <input
                    name="volume"
                    type="text"
                    placeholder="e.g., 10kg – 25kg"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A961]/50 focus:border-[#C9A961] transition-all"
                  />
                </div>


                <button
                  type="submit"
                  className={`btn btn-primary w-full md:w-auto min-w-[200px] py-4 text-base tracking-wide shadow-md hover:shadow-xl transition-all duration-300 ${status === "loading" ? "opacity-80 cursor-wait" : ""}`}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin h-5 w-5" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Submit Inquiry
                      <Send className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center border border-gray-200 p-6 bg-white rounded-lg shadow-sm">
              <img src={coldchain} className="w-32 h-32 my-2 mx-auto" />
              <h4 className="font-bold mb-2 mt-4">Cold-Chain Reliability</h4>
              <p className="text-sm text-[#6B6B6B]">
                Our logistics network ensures every batch arrives at your
                kitchen between 2°C and 4°C.
              </p>
            </div>
            <div className="text-center border border-gray-200 p-6 bg-white rounded-lg shadow-sm">
              <img src={chef} className="w-32 h-32 mx-auto my-2" />
              <h4 className="font-bold mb-2 mt-4">Masterclass Training</h4>
              <p className="text-sm text-[#6B6B6B]">
                We provide staff training on cheese handling, pairing, and
                presentation for all partners.
              </p>
            </div>
            <div className="text-center border border-gray-200 p-6 bg-white rounded-lg shadow-sm">
              <img src={fssai} className="w-32 h-32 mx-auto rounded-[100%]" />
              <h4 className="font-bold mb-2 mt-4">FSSAI Certified</h4>
              <p className="text-sm text-[#6B6B6B]">
                Fully compliant with Indian food safety standards and
                export-ready documentation.
              </p>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* Success Modal */}
      <SubmissionSuccessModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Inquiry Submitted!"
        message="Thank you for your wholesale inquiry. Our team will reach out to you within 24 hours."
        referenceId={referenceId}
      />
    </>
  );
}
