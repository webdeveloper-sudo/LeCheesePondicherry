import React, { useState, useEffect } from "react";
import { X, Star, Upload, Trash2, Loader2, ImagePlus, AlertCircle } from "lucide-react";
import { reviewAPI } from "@/lib/api";
import { useToastStore } from "@/store/useToastStore";

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productImage?: string;
  existingReview?: any;
  onSuccess: (savedReview?: any) => void;
}

const RATING_DESCRIPTIONS = {
  1: "Terrible - Very Dissatisfied",
  2: "Poor - Not as expected",
  3: "Average - Just okay",
  4: "Good - Very satisfied",
  5: "Excellent - Loved it!",
};

export default function WriteReviewModal({
  isOpen,
  onClose,
  productId,
  productName,
  productImage,
  existingReview,
  onSuccess,
}: WriteReviewModalProps) {
  const { addToast } = useToastStore();

  const [rating, setRating] = useState<number>(existingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState<string>(existingReview?.title || "");
  const [comment, setComment] = useState<string>(existingReview?.comment || "");
  const [userArea, setUserArea] = useState<string>(existingReview?.userArea || "");
  const [existingImages, setExistingImages] = useState<string[]>(existingReview?.images || []);
  const [newImages, setNewImages] = useState<Array<{ name: string; mimeType: string; data: string; preview: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 5);
      setTitle(existingReview.title || "");
      setComment(existingReview.comment || "");
      setUserArea(existingReview.userArea || "");
      setExistingImages(existingReview.images || []);
      setNewImages([]);
    } else {
      setRating(5);
      setTitle("");
      setComment("");
      setUserArea("");
      setExistingImages([]);
      setNewImages([]);
    }
    setErrorMessage("");
  }, [existingReview, isOpen]);

  if (!isOpen) return null;

  const totalImagesCount = existingImages.length + newImages.length;

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    if (totalImagesCount + files.length > 5) {
      setErrorMessage("You can upload a maximum of 5 images per review.");
      return;
    }

    setErrorMessage("");
    const loaded = await Promise.all(
      files.map((file) => {
        return new Promise<{ name: string; mimeType: string; data: string; preview: string }>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const resultStr = reader.result as string;
            resolve({
              name: file.name,
              mimeType: file.type || "image/jpeg",
              data: resultStr.includes("base64,") ? resultStr.split("base64,")[1] : resultStr,
              preview: resultStr,
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    setNewImages((prev) => [...prev, ...loaded]);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      setErrorMessage("Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      setErrorMessage("Please write your review comment.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (existingReview) {
        // Update review
        const res = await reviewAPI.updateReview(existingReview._id, {
          rating,
          title,
          comment,
          existingImages,
          imagesBase64: newImages.map(({ name, mimeType, data }) => ({ name, mimeType, data })),
        });

        if (res.success) {
          addToast("Your review was updated successfully!", "success");
          const saved = (res.data as any)?.data || res.data;
          onSuccess(saved);
          onClose();
        } else {
          setErrorMessage(res.message || "Failed to update review.");
        }
      } else {
        // Create review
        const res = await reviewAPI.createReview(productId, {
          rating,
          title,
          comment,
          userArea,
          imagesBase64: newImages.map(({ name, mimeType, data }) => ({ name, mimeType, data })),
        });

        if (res.success) {
          addToast("Thank you! Your review has been posted.", "success");
          const saved = (res.data as any)?.data || res.data;
          onSuccess(saved);
          onClose();
        } else {
          setErrorMessage(res.message || "Failed to post review.");
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeStarRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-300 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-bg-cream-light">
          <div className="flex items-center gap-3">
            {productImage && (
              <img
                src={productImage}
                alt={productName}
                className="w-10 h-10 object-cover rounded-lg border border-gray-200"
              />
            )}
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                {existingReview ? "Edit Your Review" : "Write a Customer Review"}
              </h3>
              <p className="text-xs text-text-secondary truncate max-w-[280px]">
                {productName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 text-xs bg-red-50 text-red-700 rounded-xl border border-red-200">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Overall Star Rating */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Overall Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    size={32}
                    className={`transition-colors ${
                      star <= activeStarRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-amber-600 mt-1.5 h-4">
              {RATING_DESCRIPTIONS[activeStarRating as keyof typeof RATING_DESCRIPTIONS] || ""}
            </p>
          </div>

          {/* 2. Review Headline / Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Add a Headline
            </label>
            <input
              type="text"
              placeholder="What's most important to know? (e.g. Incredibly creamy & authentic!)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-green focus:bg-white transition-all"
              maxLength={120}
            />
          </div>

          {/* 3. Detailed Review Comment */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Written Review <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="What did you like or dislike? How did you serve or pair this cheese? Share your taste experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-green focus:bg-white transition-all resize-y"
              maxLength={2000}
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>Be detailed and honest</span>
              <span>{comment.length}/2000</span>
            </div>
          </div>

          {/* 4. Location / City (Optional) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Your City / Area (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. White Town, Pondicherry or Indiranagar, Bangalore"
              value={userArea}
              onChange={(e) => setUserArea(e.target.value)}
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-green focus:bg-white transition-all"
              maxLength={60}
            />
          </div>

          {/* 5. Photos Upload (Max 5) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Add Photos (Up to 5)
              </label>
              <span className="text-xs text-gray-400 font-medium">
                {totalImagesCount}/5 photos
              </span>
            </div>

            {/* Photos Preview Grid */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              {/* Existing Images */}
              {existingImages.map((imgUrl, i) => (
                <div key={`exist-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                  <img src={imgUrl} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity"
                    title="Remove photo"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}

              {/* New Loaded Images */}
              {newImages.map((img, i) => (
                <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-brand-green/40 group">
                  <img src={img.preview} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity"
                    title="Remove photo"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {/* Upload Trigger Tile */}
              {totalImagesCount < 5 && (
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-brand-green rounded-xl cursor-pointer bg-gray-50 hover:bg-brand-green/5 transition-all group">
                  <ImagePlus size={20} className="text-gray-400 group-hover:text-brand-green mb-1" />
                  <span className="text-[10px] font-semibold text-gray-500 group-hover:text-brand-green text-center px-1">
                    Add Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImagePick}
                  />
                </label>
              )}
            </div>
            <p className="text-[11px] text-gray-400">
              Shoppers love photos of unboxing, plated servings, and pairings.
            </p>
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-green hover:bg-brand-green-dark text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>{existingReview ? "Update Review" : "Submit Review"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
