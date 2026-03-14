import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

interface SubmissionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  referenceId?: string;
}

export default function SubmissionSuccessModal({
  isOpen,
  onClose,
  title = "Message Sent!",
  message = "Thank you for reaching out. We'll get back to you shortly.",
  referenceId,
}: SubmissionSuccessModalProps) {
  // Auto-close after 6 seconds
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto overflow-hidden">

              {/* Gold top bar */}
              <div className="h-1.5 bg-gradient-to-r from-[#2C5530] via-[#C9A961] to-[#2C5530]" />

              {/* Close button */}
              <div className="flex justify-end p-4 pb-0">
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="px-8 pb-8 pt-2 text-center">
                {/* Animated checkmark */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
                  className="flex items-center justify-center mb-5"
                >
                  <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="text-[#2C5530]" size={48} strokeWidth={1.5} />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-[#1A1A1A] mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-[#6B6B6B] text-sm leading-relaxed mb-4"
                >
                  {message}
                </motion.p>

                {referenceId && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="inline-block bg-[#FAF7F2] border border-[#C9A961]/30 rounded-lg px-4 py-2 mb-5"
                  >
                    <p className="text-xs text-[#6B6B6B] mb-0.5">Reference ID</p>
                    <p className="text-sm font-mono font-semibold text-[#2C5530]">{referenceId}</p>
                  </motion.div>
                )}

                {/* Auto-close progress bar */}
                <motion.div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-2 mb-5">
                  <motion.div
                    className="h-full bg-[#C9A961] rounded-full"
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 6, ease: "linear" }}
                  />
                </motion.div>

                <button
                  onClick={onClose}
                  className="btn btn-primary px-8 py-2.5 text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
