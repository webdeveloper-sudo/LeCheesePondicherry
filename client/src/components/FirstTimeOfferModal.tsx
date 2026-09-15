import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, Copy } from "lucide-react";
import popupBgImage from "@/assets/images/bg-elements/hom-popup.webp";
import logo from "@/assets/images/logo.webp";
import { enquiryAPI } from "@/lib/api";
import { useToastStore } from "@/store/useToastStore";

interface FirstTimeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponCode?: string;
  discountPercent?: number;
}

export const FirstTimeOfferModal: React.FC<FirstTimeOfferModalProps> = ({
  isOpen,
  onClose,
  couponCode = "CHEESE15",
  discountPercent = 15,
}) => {
  const { addToast } = useToastStore();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      addToast("Please enter a valid email address", "error");
      return;
    }

    setLoading(true);
    try {
      await enquiryAPI.submitOfferLead(email, couponCode);
      sessionStorage.setItem("firstTimeOfferClaimed", "true");
      sessionStorage.setItem("firstTimeOfferDismissed", "true");
      localStorage.setItem("provisionalCoupon", couponCode);
      setClaimed(true);
      addToast(`Offer unlocked! Code ${couponCode} is ready for your first order.`, "success");
    } catch (err: any) {
      // Even if lead capture API fails or is offline, let guest enjoy the offer
      sessionStorage.setItem("firstTimeOfferClaimed", "true");
      sessionStorage.setItem("firstTimeOfferDismissed", "true");
      localStorage.setItem("provisionalCoupon", couponCode);
      setClaimed(true);
      addToast(`Offer unlocked! Use code ${couponCode} at checkout.`, "success");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    addToast(`Coupon code ${couponCode} copied to clipboard!`, "success");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDismiss = () => {
    sessionStorage.setItem("firstTimeOfferDismissed", "true");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-2xl shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-12 border border-[#E8DFC8]/60"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              aria-label="Close modal"
              className="absolute top-3 right-3 md:top-4 md:right-4 z-20 p-2 rounded-full bg-black/5 hover:bg-black/10 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Left Column: Artisan Cheese Product Image */}
            <div className="md:col-span-5 relative bg-[#EFE9DF] min-h-[220px] md:min-h-[460px] overflow-hidden flex items-center justify-center">
              <img
                src={popupBgImage}
                alt="Artisanal Le Pondichéry Cheese Selection"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:hidden" />
            </div>

            {/* Right Column: Offer Pitch & Lead Form */}
            <div className="md:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between text-center">
              {/* Brand Logo & Supertitle */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 mb-2 flex items-center justify-center">
                  <img
                    src={logo}
                    alt="Le Pondichéry Cheese"
                    className="max-h-full max-w-full object-contain drop-shadow-sm"
                  />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#A67C38] mb-1">
                  <Sparkles size={13} className="text-[#C99846]" />
                  <span>Unlock</span>
                  <Sparkles size={13} className="text-[#C99846]" />
                </div>

                {/* Main Headline */}
                <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-black tracking-tight text-[#2B1B17] font-serif uppercase leading-tight mt-1 mb-2">
                  {discountPercent}% OFF
                  <span className="block text-lg sm:text-xl font-medium tracking-normal text-[#5C4D3C] font-sans mt-0.5">
                    YOUR FIRST ORDER
                  </span>
                </h2>

                <p className="text-xs sm:text-sm text-[#6E6259] max-w-xs mx-auto leading-relaxed mb-6">
                  Sign up with your email to unlock exclusive savings on fresh artisanal cheeses crafted in Pondicherry.
                </p>
              </div>

              {!claimed ? (
                /* Form State */
                <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto space-y-3">
                  <div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 bg-white border border-[#D5C7B5] rounded-xl text-sm text-[#2B1B17] placeholder-[#A09383] focus:outline-none focus:ring-2 focus:ring-[#A67C38] focus:border-transparent transition-all shadow-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 bg-[#2B1B17] hover:bg-[#422D26] text-[#F7EFE3] font-bold text-xs uppercase tracking-[0.18em] rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Continue & Claim {discountPercent}% Off</span>
                    )}
                  </button>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleDismiss}
                      className="text-xs text-[#8C7D6F] hover:text-[#2B1B17] hover:underline transition-colors cursor-pointer"
                    >
                      No, thanks
                    </button>
                  </div>

                  <p className="text-[10px] text-[#A69B8F] leading-tight pt-1">
                    *Offer valid on your first order. By signing up, you agree to receive promotional updates from Le Pondichéry Cheese.
                  </p>
                </form>
              ) : (
                /* Claimed Success State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-sm mx-auto bg-white p-5 rounded-xl border border-emerald-200 shadow-sm text-center space-y-3"
                >
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Your Coupon is Ready!</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Apply this code at checkout to enjoy {discountPercent}% off:
                    </p>
                  </div>

                  <div className="flex items-center justify-between bg-[#FAF7F2] border border-[#E8DFC8] rounded-lg p-2.5 px-4">
                    <span className="font-mono font-extrabold text-base tracking-widest text-[#2B1B17]">
                      {couponCode}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="flex items-center gap-1 text-xs font-bold text-[#A67C38] hover:text-[#805E28] transition-colors"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 bg-[#2B1B17] text-[#F7EFE3] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#422D26] transition-colors"
                  >
                    Start Shopping
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FirstTimeOfferModal;
