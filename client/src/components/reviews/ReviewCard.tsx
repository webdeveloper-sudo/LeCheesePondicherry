import React, { useState } from "react";
import { Star, CheckCircle2, ThumbsUp, Trash2, Edit3, MoreVertical, ShieldAlert } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useToastStore } from "@/store/useToastStore";
import { reviewAPI } from "@/lib/api";

interface ReviewCardProps {
  review: {
    _id: string;
    user: string | { _id: string; name?: string; email?: string; profilePhoto?: string };
    userName: string;
    userEmail: string;
    userPhoto?: string;
    userArea?: string;
    rating: number;
    title?: string;
    comment: string;
    images?: string[];
    isVerifiedPurchase?: boolean;
    helpfulCount?: number;
    helpfulUsers?: string[];
    createdAt: string;
  };
  onEdit?: (review: any) => void;
  onDeleteSuccess?: () => void;
  onImageClick?: (imageUrl: string, index: number) => void;
}

export default function ReviewCard({
  review,
  onEdit,
  onDeleteSuccess,
  onImageClick,
}: ReviewCardProps) {
  const { uid, role, token, isAuthenticated } = useUserStore();
  const { addToast } = useToastStore();

  const isLoggedIn = isAuthenticated?.() || Boolean(token || uid);

  const [helpfulCount, setHelpfulCount] = useState<number>(review.helpfulCount || 0);
  const [hasVotedHelpful, setHasVotedHelpful] = useState<boolean>(
    uid && Array.isArray(review.helpfulUsers)
      ? review.helpfulUsers.includes(uid)
      : false
  );
  const [isVoting, setIsVoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Determine permissions
  const reviewUserId = typeof review.user === "object" ? review.user?._id : review.user;
  const isOwner = Boolean(uid && reviewUserId === uid);
  const isAdmin = role === "admin";

  const handleHelpfulToggle = async () => {
    if (!isLoggedIn) {
      addToast("Please sign in to vote this review as helpful", "info");
      return;
    }
    if (isVoting) return;

    setIsVoting(true);
    try {
      const res = await reviewAPI.voteHelpful(review._id);
      if (res.success && res.data) {
        setHasVotedHelpful(res.data.voted);
        setHelpfulCount(res.data.helpfulCount);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsVoting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await reviewAPI.deleteReview(review._id);
      if (res.success) {
        addToast(res.message || "Review deleted successfully", "success");
        if (onDeleteSuccess) onDeleteSuccess();
      } else {
        addToast(res.message || "Failed to delete review", "error");
      }
    } catch (e: any) {
      console.error(e);
      addToast("An error occurred while deleting the review", "error");
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100/90 shadow-2xs hover:shadow-xs transition-shadow">
      {/* Header: User Profile & Actions */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {review.userPhoto ? (
            <img
              src={review.userPhoto}
              alt={review.userName}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green font-bold text-sm flex items-center justify-center border border-brand-green/20">
              {review.userName ? review.userName.charAt(0).toUpperCase() : "U"}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-gray-900">
                {review.userName || "Verified Customer"}
              </span>
              {review.isVerifiedPurchase && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  <CheckCircle2 size={12} />
                  <span>Verified Purchase</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-text-secondary">
              {review.userArea ? `${review.userArea} • ` : ""}
              Reviewed on {new Date(review.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Action Controls (Edit/Delete) */}
        {(isOwner || isAdmin) && (
          <div className="flex items-center gap-1">
            {isOwner && onEdit && (
              <button
                onClick={() => onEdit(review)}
                className="p-1.5 text-gray-400 hover:text-brand-green hover:bg-gray-50 rounded-lg transition-colors"
                title="Edit review"
              >
                <Edit3 size={15} />
              </button>
            )}

            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title={isAdmin && !isOwner ? "Delete review as Admin" : "Delete review"}
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Star Rating & Headline */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={15}
              className={
                i < review.rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-200 fill-gray-200"
              }
            />
          ))}
        </div>
        {review.title && (
          <h4 className="font-bold text-sm text-gray-900 truncate">
            {review.title}
          </h4>
        )}
      </div>

      {/* Review Comment Text */}
      <p className="text-sm text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
        {review.comment}
      </p>

      {/* Customer Review Photos Gallery */}
      {review.images && review.images.length > 0 && (
        <div className="flex flex-wrap gap-2.5 mb-4">
          {review.images.map((imgUrl, i) => (
            <button
              key={i}
              onClick={() => onImageClick && onImageClick(imgUrl, i)}
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-gray-200 hover:border-brand-green transition-all group focus:outline-none focus:ring-2 focus:ring-brand-green/50"
            >
              <img
                src={imgUrl}
                alt={`Customer review photo ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
          ))}
        </div>
      )}

      {/* Footer: Helpful Button */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handleHelpfulToggle}
            disabled={isVoting}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              hasVotedHelpful
                ? "bg-brand-green text-white shadow-2xs"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
            }`}
          >
            <ThumbsUp size={13} className={hasVotedHelpful ? "fill-white" : ""} />
            <span>Helpful</span>
            {helpfulCount > 0 && <span>({helpfulCount})</span>}
          </button>
          <span className="text-[11px] text-gray-400">
            {helpfulCount === 1 ? "1 person found this helpful" : helpfulCount > 1 ? `${helpfulCount} people found this helpful` : "Was this review helpful?"}
          </span>
        </div>

        {isAdmin && !isOwner && (
          <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <ShieldAlert size={11} />
            <span>Admin View</span>
          </span>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <h4 className="text-base font-bold text-gray-900 mb-2">Delete Review?</h4>
            <p className="text-xs text-gray-600 mb-5 leading-relaxed">
              {isAdmin && !isOwner
                ? "As an administrator, you are about to remove this customer review permanently."
                : "Are you sure you want to delete your review? This action cannot be undone."}
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setShowConfirmDelete(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
