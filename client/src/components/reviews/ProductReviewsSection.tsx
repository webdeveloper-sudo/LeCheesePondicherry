import React, { useState, useEffect, useMemo } from "react";
import {
  Star,
  Camera,
  CheckCircle2,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  MessageSquarePlus,
  Sparkles,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { reviewAPI } from "@/lib/api";
import { useUserStore } from "@/store/useUserStore";
import { useToastStore } from "@/store/useToastStore";
import WriteReviewModal from "./WriteReviewModal";
import ReviewCard from "./ReviewCard";
import ReviewImageModal from "./ReviewImageModal";
import { useNavigate, useLocation } from "react-router-dom";

interface ProductReviewsSectionProps {
  product: {
    id: string;
    _id?: string;
    slug?: string;
    name: string;
    image?: string;
    rating?: number;
    reviewCount?: number;
  };
}

export default function ProductReviewsSection({ product }: ProductReviewsSectionProps) {
  const navigate = useNavigate();
  const { uid, token, isAuthenticated } = useUserStore();
  const { addToast } = useToastStore();

  const productId = product.slug || product.id || product._id || "";

  // Data states
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<{
    averageRating: number;
    totalReviews: number;
    starCounts: Record<number, number>;
    starPercentages: Record<number, number>;
    totalWithImages: number;
  }>({
    averageRating: product.rating || 5,
    totalReviews: product.reviewCount || 0,
    starCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    starPercentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    totalWithImages: 0,
  });
  const [allImages, setAllImages] = useState<any[]>([]);
  const [userReview, setUserReview] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Filter & Sort states
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [withImagesOnly, setWithImagesOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Modal states
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch reviews function
  const fetchReviews = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const res = await reviewAPI.getProductReviews(productId, {
        star: selectedStar || undefined,
        withImages: withImagesOnly || undefined,
        verified: verifiedOnly || undefined,
        sort: sortBy,
      });

      if (res.success && res.data) {
        const payload = (res.data as any)?.data || res.data;
        if (payload) {
          setReviews(payload.reviews || []);
          if (payload.stats) {
            setStats(payload.stats);
          }
          if (payload.allImages) {
            setAllImages(payload.allImages);
          }
          setUserReview(payload.userReview || null);
        }
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, selectedStar, withImagesOnly, verifiedOnly, sortBy]);

  const location = useLocation();

  const handleWriteClick = () => {
    const isLoggedIn = isAuthenticated?.() || Boolean(token || uid);
    if (!isLoggedIn) {
      addToast("Please sign in to write a review", "info");
      const currentUrl = encodeURIComponent(location.pathname + location.search);
      navigate(`/user/login?redirect=${currentUrl}`);
      return;
    }
    setIsWriteModalOpen(true);
  };

  const handleOpenLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const handleCardImageClick = (imageUrl: string) => {
    const idx = allImages.findIndex((img) => img.url === imageUrl);
    if (idx !== -1) {
      setSelectedImageIndex(idx);
    } else {
      setSelectedImageIndex(0);
    }
    setIsLightboxOpen(true);
  };

  const hasActiveFilters = selectedStar !== null || withImagesOnly || verifiedOnly;

  const clearAllFilters = () => {
    setSelectedStar(null);
    setWithImagesOnly(false);
    setVerifiedOnly(false);
  };

  return (
    <section className="py-12 bg-bg-cream-light/60 border-t border-gray-200/60" id="customer-reviews">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="mb-10">
          <h2
            className="text-2xl md:text-3xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Customer Ratings & Reviews
          </h2>
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            Authentic feedback from cheese enthusiasts across India
          </p>
        </div>

        {/* Amazon / Flipkart Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ========================================================
              LEFT COLUMN: RATING SUMMARY & WRITE REVIEW CTA (lg:col-span-4)
              ======================================================== */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-6 lg:sticky lg:top-28">
            {/* Big Score Header */}
            <div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-extrabold text-gray-900">
                  {stats.averageRating ? stats.averageRating.toFixed(1) : "5.0"}
                </span>
                <span className="text-sm text-gray-400 font-medium">out of 5</span>
              </div>

              {/* Star graphics */}
              <div className="flex items-center gap-1 text-amber-400 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i < Math.floor(stats.averageRating || 5)
                        ? "fill-amber-400 text-amber-400"
                        : i < (stats.averageRating || 5)
                        ? "fill-amber-400/50 text-amber-400"
                        : "text-gray-200 fill-gray-200"
                    }
                  />
                ))}
              </div>
              <p className="text-xs text-text-secondary">
                Based on{" "}
                <strong className="text-gray-900">{stats.totalReviews}</strong> customer rating
                {stats.totalReviews !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Star Distribution Breakdown Bars (Amazon style) */}
            <div className="space-y-2 pt-4 border-t border-gray-100">
              {[5, 4, 3, 2, 1].map((starNum) => {
                const count = stats.starCounts?.[starNum] || 0;
                const pct = stats.starPercentages?.[starNum] || 0;
                const isSelected = selectedStar === starNum;

                return (
                  <button
                    key={starNum}
                    onClick={() => setSelectedStar(isSelected ? null : starNum)}
                    className={`w-full flex items-center gap-2.5 text-xs py-1 px-1.5 rounded-lg transition-colors group text-left ${
                      isSelected ? "bg-amber-50 font-bold" : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="w-12 text-gray-700 font-medium flex items-center gap-1">
                      <span>{starNum}</span>
                      <Star size={12} className="fill-amber-400 text-amber-400 inline" />
                    </span>

                    {/* Progress Track */}
                    <div className="flex-1 h-3.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200/60 relative">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500 group-hover:bg-amber-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <span className="w-10 text-right text-gray-500 group-hover:text-gray-900 text-[11px]">
                      {pct}%
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Write a Review Action Card */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="font-bold text-sm text-gray-900 mb-1">
                {userReview ? "Your Review on this Cheese" : "Review this product"}
              </h4>
              <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                {userReview
                  ? "You shared your experience on " +
                    new Date(userReview.createdAt).toLocaleDateString() +
                    ". You can update or edit your review anytime."
                  : "Share your thoughts with other artisanal cheese lovers and help them pick the best pairings."}
              </p>

              <button
                onClick={handleWriteClick}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  userReview
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
                    : "bg-brand-green hover:bg-brand-green-dark text-white hover:scale-[1.02]"
                }`}
              >
                <MessageSquarePlus size={16} />
                <span>{userReview ? "Edit Your Review" : "Write a Customer Review"}</span>
              </button>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: CUSTOMER PHOTOS GALLERY & REVIEW FEED (lg:col-span-8)
              ======================================================== */}
          <div className="lg:col-span-8 space-y-6">
            {/* Customer Photos Gallery Strip (Amazon style) */}
            {allImages && allImages.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Camera size={16} className="text-brand-green" />
                    <h4 className="font-bold text-sm text-gray-900">
                      Customer Photos
                    </h4>
                    <span className="text-xs text-text-secondary">
                      ({allImages.length})
                    </span>
                  </div>

                  <button
                    onClick={() => setWithImagesOnly(!withImagesOnly)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                      withImagesOnly
                        ? "bg-brand-green text-white"
                        : "text-brand-green hover:underline"
                    }`}
                  >
                    {withImagesOnly ? "Showing Photos Only" : "Filter with photos"}
                  </button>
                </div>

                {/* Thumbnail Strip */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {allImages.slice(0, 10).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => handleOpenLightbox(i)}
                      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 hover:border-brand-green hover:shadow-md transition-all group focus:outline-none"
                    >
                      <img
                        src={img.url}
                        alt={`Customer photo ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                    </button>
                  ))}
                  {allImages.length > 10 && (
                    <button
                      onClick={() => handleOpenLightbox(0)}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-100 hover:bg-gray-200 flex flex-col items-center justify-center text-xs font-bold text-gray-700 flex-shrink-0 transition-colors"
                    >
                      <span>+{allImages.length - 10}</span>
                      <span className="text-[10px] text-gray-500">View all</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Filter Chips & Sorting Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-text-secondary font-semibold mr-1">
                  Filter:
                </span>

                <button
                  onClick={clearAllFilters}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    !hasActiveFilters
                      ? "bg-brand-green text-white shadow-2xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All ({stats.totalReviews})
                </button>

                {[5, 4, 3, 2, 1].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStar(selectedStar === s ? null : s)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedStar === s
                        ? "bg-amber-500 text-white shadow-2xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span>{s}★</span>
                  </button>
                ))}

                <button
                  onClick={() => setWithImagesOnly(!withImagesOnly)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    withImagesOnly
                      ? "bg-brand-green text-white shadow-2xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Camera size={12} />
                  <span>With Photos</span>
                </button>

                <button
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    verifiedOnly
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <CheckCircle2 size={12} />
                  <span>Verified</span>
                </button>

                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-red-600 hover:text-red-700 font-bold ml-1"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="relative self-end sm:self-auto">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:border-brand-green transition-colors"
                >
                  <ArrowUpDown size={13} className="text-brand-green" />
                  <span>
                    {sortBy === "newest" && "Most Recent"}
                    {sortBy === "helpful" && "Most Helpful"}
                    {sortBy === "highest" && "Highest Rating"}
                    {sortBy === "lowest" && "Lowest Rating"}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-40 animate-in fade-in slide-in-from-top-2">
                    {[
                      { value: "newest", label: "Most Recent" },
                      { value: "helpful", label: "Most Helpful" },
                      { value: "highest", label: "Highest Rating" },
                      { value: "lowest", label: "Lowest Rating" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs hover:bg-bg-cream-light transition-colors ${
                          sortBy === opt.value
                            ? "text-brand-green font-bold bg-bg-cream-light"
                            : "text-gray-700"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-200/80 text-center flex flex-col items-center justify-center">
                <Loader2 size={32} className="animate-spin text-brand-green mb-3" />
                <p className="text-xs text-text-secondary">Loading customer reviews...</p>
              </div>
            ) : reviews.length > 0 ? (
              /* Reviews List Feed */
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <ReviewCard
                    key={rev._id}
                    review={rev}
                    onEdit={() => setIsWriteModalOpen(true)}
                    onDeleteSuccess={() => {
                      setReviews((prev) => prev.filter((r) => r._id !== rev._id));
                      if (userReview?._id === rev._id) {
                        setUserReview(null);
                      }
                      fetchReviews();
                    }}
                    onImageClick={handleCardImageClick}
                  />
                ))}
              </div>
            ) : (
              /* Empty Reviews State */
              <div className="bg-white p-12 rounded-2xl border border-gray-200/80 text-center">
                <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star size={26} />
                </div>
                <h4 className="font-bold text-base text-gray-900 mb-1">
                  {hasActiveFilters
                    ? "No reviews match your selected filter"
                    : "No reviews yet for this cheese"}
                </h4>
                <p className="text-xs text-text-secondary max-w-sm mx-auto mb-5">
                  {hasActiveFilters
                    ? "Try clearing your filters or changing star ratings."
                    : "Be the first verified customer to share your thoughts and pairing tips!"}
                </p>
                {hasActiveFilters ? (
                  <button
                    onClick={clearAllFilters}
                    className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Clear Filter
                  </button>
                ) : (
                  <button
                    onClick={handleWriteClick}
                    className="px-6 py-2.5 bg-brand-green hover:bg-brand-green-dark text-white rounded-xl text-xs font-bold shadow transition-all"
                  >
                    Write the First Review
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Write/Edit Review Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        productId={productId}
        productName={product.name}
        productImage={product.image}
        existingReview={userReview}
        onSuccess={(savedReview) => {
          if (savedReview) {
            setUserReview(savedReview);
            setReviews((prev) => {
              const existingIdx = prev.findIndex((r) => r._id === savedReview._id);
              if (existingIdx >= 0) {
                const updated = [...prev];
                updated[existingIdx] = savedReview;
                return updated;
              }
              return [savedReview, ...prev];
            });
          }
          fetchReviews();
        }}
      />

      {/* Lightbox Modal for Review Photos */}
      <ReviewImageModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={allImages}
        initialIndex={selectedImageIndex}
      />
    </section>
  );
}
