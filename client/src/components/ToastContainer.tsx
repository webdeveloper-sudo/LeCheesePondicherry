import { useToastStore, ToastType } from '@/store/useToastStore';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="text-[#2C5530]" size={20} />,
  error: <AlertCircle className="text-red-500" size={20} />,
  info: <Info className="text-[#C9A961]" size={20} />,
  warning: <AlertTriangle className="text-[#FAB519]" size={20} />,
};

const bgMap: Record<ToastType, string> = {
  success: 'bg-[#F2F8F3] border-[#2C5530]/20',
  error: 'bg-red-50 border-red-200',
  info: 'bg-[#FAF7F2] border-[#C9A961]/30',
  warning: 'bg-yellow-50 border-[#FAB519]/30',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.12)] border ${
              bgMap[toast.type]
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">{iconMap[toast.type]}</div>
            <div className="flex-1 pt-0.5">
              <p className="text-[#1A1A1A] text-sm font-medium leading-snug">
                {toast.message}
              </p>
              {toast.action && (
                <Link
                  to={toast.action.href}
                  onClick={() => removeToast(toast.id)}
                  className="inline-block mt-2 text-sm font-semibold hover:underline"
                  style={{ color: toast.type === 'error' ? '#ef4444' : '#2C5530' }}
                >
                  {toast.action.label}
                </Link>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
              aria-label="Close toast"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
