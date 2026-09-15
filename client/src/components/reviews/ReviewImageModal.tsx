import React from "react";
import { X, Star, ChevronLeft, ChevronRight, User } from "lucide-react";

interface ReviewImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{
    url: string;
    reviewId?: string;
    userName?: string;
    rating?: number;
    createdAt?: string;
    comment?: string;
  }>;
  initialIndex?: number;
}

export default function ReviewImageModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
}: ReviewImageModalProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  React.useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  if (!isOpen || !images || images.length === 0) return null;

  const current = images[currentIndex] || images[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-neutral-900 border border-neutral-800 text-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors border border-white/10"
          aria-label="Close image preview"
        >
          <X size={20} />
        </button>

        {/* Main Image View Area */}
        <div className="relative md:w-7/12 bg-black flex items-center justify-center min-h-[300px] md:min-h-[480px]">
          <img
            src={current.url}
            alt={`Customer photo ${currentIndex + 1}`}
            className="max-h-[70vh] md:max-h-[85vh] w-auto max-w-full object-contain select-none"
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-900 shadow-lg transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-900 shadow-lg transition-all"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Image index counter */}
          <div className="absolute bottom-3 left-4 bg-black/60 backdrop-blur-xs text-xs px-2.5 py-1 rounded-full text-white/80">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Right Info Sidebar */}
        <div className="md:w-5/12 p-6 flex flex-col justify-between overflow-y-auto bg-neutral-900">
          <div>
            {/* Reviewer Header */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-800">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center">
                {current.userName ? current.userName.charAt(0).toUpperCase() : <User size={18} />}
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">
                  {current.userName || "Verified Customer"}
                </h4>
                {current.createdAt && (
                  <p className="text-[11px] text-neutral-400">
                    Reviewed on {new Date(current.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Rating Stars */}
            {current.rating && (
              <div className="flex items-center gap-1 mb-3 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.round(current.rating || 5)
                        ? "fill-amber-400 text-amber-400"
                        : "text-neutral-600"
                    }
                  />
                ))}
              </div>
            )}

            {/* Comment */}
            {current.comment && (
              <p className="text-sm text-neutral-300 leading-relaxed italic line-clamp-6">
                "{current.comment}"
              </p>
            )}
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="pt-4 mt-6 border-t border-neutral-800">
              <p className="text-[11px] text-neutral-400 uppercase font-semibold tracking-wider mb-2">
                All Customer Photos ({images.length})
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      i === currentIndex
                        ? "border-amber-400 scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img.url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
