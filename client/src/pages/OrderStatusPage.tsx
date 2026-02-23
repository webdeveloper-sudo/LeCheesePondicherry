import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { orderAPI } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useUserStore } from "@/store/useUserStore";

export default function OrderStatusPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { isAuthenticated } = useUserStore();

  const [status, setStatus] = useState<
    "loading" | "success" | "failed" | "pending"
  >("loading");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 10;

  useEffect(() => {
    const cfOrderId = searchParams.get("order_id");
    if (!cfOrderId) {
      setError("No order ID found in the URL.");
      setStatus("failed");
      return;
    }
    setOrderId(cfOrderId);

    // If not authenticated, we can't verify easily if verification requires token
    // But verifyPayment route has 'protect' middleware
    if (!isAuthenticated()) {
      setError("You need to be logged in to verify your order.");
      setStatus("failed");
      return;
    }

    let currentRetries = 0;
    let isSubscribed = true;

    const verify = async () => {
      if (!isSubscribed) return;

      try {
        const savedOrder = localStorage.getItem("lepondy_pending_order");
        if (!savedOrder) {
          setError(
            "Order metadata lost. If payment was successful, check your profile in a few minutes.",
          );
          setStatus("failed");
          return;
        }

        const orderData = JSON.parse(savedOrder);
        const res = await orderAPI.verifyPayment(cfOrderId, orderData);

        if (!isSubscribed) return;

        if (
          res.success &&
          (res.data?.success || res.data?.paymentStatus === "completed")
        ) {
          setStatus("success");
          setOrderDetails(res.data.data || res.data);
          clearCart();
          localStorage.removeItem("lepondy_pending_order");
        } else if (res.data?.canRetry && currentRetries < maxRetries) {
          currentRetries++;
          setRetryCount(currentRetries);
          setStatus("loading");
          // Gradually increase delay if needed, or keep it constant
          setTimeout(verify, 2000);
        } else {
          setStatus("failed");
          setError(
            res.data?.message ||
              res.message ||
              "Payment verification timed out or failed.",
          );
        }
      } catch (err: any) {
        console.error("Verification Error:", err);
        if (isSubscribed) {
          setStatus("failed");
          setError("An unexpected error occurred during verification.");
        }
      }
    };

    verify();
    return () => {
      isSubscribed = false;
    };
  }, [searchParams, isAuthenticated]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-20 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
        {status === "loading" && (
          <div className="space-y-6">
            <div className="w-20 h-20 border-4 border-[#C9A961] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">
              Verifying Payment...
            </h2>
            <p className="text-gray-500">
              Please do not refresh the page while we confirm your transaction
              with the bank.
            </p>
            {retryCount > 0 && (
              <p className="text-sm text-[#2C5530] font-medium animate-pulse">
                Verification in progress (Attempt {retryCount}/{maxRetries})...
              </p>
            )}
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-[#1A1A1A]">
              Payment Successful!
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Your order <strong>#{orderId}</strong> is confirmed. You'll
              receive an email with the details shortly.
            </p>
            <div className="bg-[#FAF7F2] p-4 rounded-2xl text-left text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Amount Paid:</span>
                <span className="font-bold text-[#2C5530]">
                  ₹{orderDetails?.finalAmount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-medium text-[#1A1A1A]">
                  {orderDetails?.transactionId || "N/A"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <Link
                to="/user"
                className="btn btn-primary w-full py-4 text-center"
              >
                View My Orders
              </Link>
              <Link
                to="/shop"
                className="btn btn-secondary w-full py-4 text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-[#1A1A1A]">
              Payment Failed
            </h2>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <p className="text-red-700 text-sm font-medium">
                {error || "The transaction was unsuccessful."}
              </p>
            </div>
            <p className="text-gray-600 text-sm">
              If any amount was deducted from your account, it will be refunded
              automatically within 5-7 working days.
            </p>
            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={() => navigate("/checkout")}
                className="btn btn-primary w-full py-4"
              >
                Try Again
              </button>
              <Link to="/shop" className="btn btn-secondary w-full py-4">
                Back to Shop
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
