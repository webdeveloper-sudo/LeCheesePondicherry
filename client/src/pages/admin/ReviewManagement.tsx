import React, { useState, useEffect } from "react";
import {
  Star,
  Trash2,
  Search,
  CheckCircle2,
  RefreshCw,
  MessageSquare,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { reviewAPI } from "@/lib/api";
import { useToastStore } from "@/store/useToastStore";

export default function ReviewManagement() {
  const { addToast } = useToastStore();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewAPI.getAllReviewsAdmin({
        search: search || undefined,
        rating: selectedRating,
      });
      if (res.success && res.data) {
        const payload = (res.data as any)?.data || res.data || [];
        setReviews(Array.isArray(payload) ? payload : (payload.reviews || []));
      }
    } catch (err: any) {
      console.error(err);
      addToast("Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [selectedRating]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReviews();
  };

  const handleDeleteReview = async (id: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete the review by "${userName}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await reviewAPI.deleteReview(id);
      if (res.success) {
        addToast("Review deleted by administrator", "success");
        setReviews((prev) => prev.filter((r) => r._id !== id));
      } else {
        addToast(res.message || "Failed to delete review", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to delete review", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="text-yellow-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Customer Reviews Moderation</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Total Reviews: <strong>{reviews.length}</strong> • Moderate, inspect photos, and delete inappropriate content.
          </p>
        </div>

        {/* Search and Star Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search user, text, title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-yellow-600 focus:bg-white transition-all w-48 sm:w-64"
            />
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </form>

          <select
            value={selectedRating || ""}
            onChange={(e) => setSelectedRating(e.target.value ? Number(e.target.value) : undefined)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-yellow-600"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <button
            onClick={fetchReviews}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
            title="Refresh list"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Reviews Table / Grid */}
      {loading ? (
        <div className="bg-white p-16 rounded-2xl border border-gray-200 text-center text-gray-500 flex flex-col items-center justify-center">
          <RefreshCw size={32} className="animate-spin text-yellow-600 mb-3" />
          <p className="text-sm">Loading reviews database...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Review Content</th>
                  <th className="py-3.5 px-4">Photos</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-gray-50/80 transition-colors">
                    {/* User */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-gray-900">{rev.userName}</div>
                      <div className="text-[11px] text-gray-500">{rev.userEmail}</div>
                      {rev.userArea && (
                        <div className="text-[10px] text-gray-400">{rev.userArea}</div>
                      )}
                      {rev.isVerifiedPurchase && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5">
                          <CheckCircle2 size={10} /> Verified
                        </span>
                      )}
                    </td>

                    {/* Product */}
                    <td className="py-4 px-4 max-w-[160px]">
                      {rev.product ? (
                        <div className="flex items-center gap-2">
                          {rev.product.image && (
                            <img
                              src={rev.product.image}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                            />
                          )}
                          <span className="font-semibold text-gray-800 truncate" title={rev.product.name}>
                            {rev.product.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Product ID: {rev.productIdStr}</span>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-amber-500">
                        <span className="font-bold text-gray-900">{rev.rating}</span>
                        <Star size={14} className="fill-amber-400" />
                      </div>
                    </td>

                    {/* Content */}
                    <td className="py-4 px-4 max-w-xs">
                      {rev.title && (
                        <p className="font-bold text-gray-900 mb-0.5 truncate">{rev.title}</p>
                      )}
                      <p className="text-gray-600 line-clamp-3 leading-relaxed">{rev.comment}</p>
                    </td>

                    {/* Photos */}
                    <td className="py-4 px-4">
                      {rev.images && rev.images.length > 0 ? (
                        <div className="flex gap-1.5 flex-wrap">
                          {rev.images.map((img: string, i: number) => (
                            <a
                              key={i}
                              href={img}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-9 h-9 rounded-lg overflow-hidden border border-gray-200 hover:border-yellow-600 transition-colors flex-shrink-0 relative group block"
                            >
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[11px] italic">No photos</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-gray-500 whitespace-nowrap">
                      {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteReview(rev._id, rev.userName)}
                        disabled={deletingId === rev._id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                        title="Delete review as Admin"
                      >
                        <Trash2 size={13} />
                        <span>{deletingId === rev._id ? "Deleting..." : "Delete"}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-500">
          <p className="text-base font-semibold text-gray-700 mb-1">No reviews found</p>
          <p className="text-xs text-gray-400">Try changing your search query or rating filter.</p>
        </div>
      )}
    </div>
  );
}
