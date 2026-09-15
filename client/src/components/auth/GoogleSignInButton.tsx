import React, { useEffect, useRef, useState } from "react";
import { authAPI } from "@/lib/api";
import { useUserStore } from "@/store/useUserStore";
import { useToastStore } from "@/store/useToastStore";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: (momentListener?: (notification: any) => void) => void;
          cancel: () => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  mode?: "signin" | "signup";
  className?: string;
  onSuccess?: () => void;
}

export default function GoogleSignInButton({
  mode = "signin",
  className = "",
  onSuccess,
}: GoogleSignInButtonProps) {
  const navigate = useNavigate();
  const { setUser, fetchWishlist, wishlistIds } = useUserStore();
  const { items, syncWithBackend } = useCart();
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    "855738841830-anvbvghgd6cvrb3tpqd5sostuoro5dc1.apps.googleusercontent.com";

  // Handle Google Credential Response
  const handleCredentialResponse = async (response: {
    credential?: string;
  }) => {
    if (!response.credential) {
      addToast("Failed to receive Google credential", "error");
      return;
    }

    setLoading(true);
    try {
      const result = await authAPI.googleAuth(
        response.credential,
        items,
        wishlistIds,
      );

      if (result.success && result.data) {
        const { token, user } = result.data;

        setUser({
          uid: user.id,
          email: user.email,
          name: user.name || "",
          mobile: user.mobile || "",
          photoURL: user.profilePhoto || "",
          role: user.role,
          token: token,
          cartItemCount: user.cartItemCount || 0,
          wishlistCount: user.wishlistCount || 0,
          preferences: user.preferences || [],
        });

        await syncWithBackend();
        await fetchWishlist();

        addToast(
          `Welcome, ${user.name || user.email.split("@")[0]}!`,
          "success",
        );

        if (onSuccess) {
          onSuccess();
        } else {
          const redirectParam = new URLSearchParams(window.location.search).get("redirect");
          let redirectPath = user.role === "admin" ? "/admin/dashboard" : "/shop";
          if (redirectParam) {
            const decoded = decodeURIComponent(redirectParam);
            redirectPath = decoded.startsWith("/") ? decoded : `/${decoded}`;
          }
          navigate(redirectPath);
        }
      } else {
        addToast(result.message || "Google authentication failed", "error");
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      addToast(err.message || "Google authentication failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // Load Google Identity Services SDK
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.google?.accounts?.id) {
      setScriptLoaded(true);
      return;
    }

    const existingScript = document.getElementById("google-gsi-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-gsi-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setScriptLoaded(true);
      };
      script.onerror = () => {
        console.error("Failed to load Google Identity Services SDK");
      };
      document.body.appendChild(script);
    } else {
      existingScript.addEventListener("load", () => setScriptLoaded(true));
    }
  }, []);

  // Initialize and render Google button
  useEffect(() => {
    if (!scriptLoaded || !window.google?.accounts?.id || !buttonRef.current) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render standard Google button in the ref container
      buttonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: mode === "signup" ? "signup_with" : "signin_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: 360,
      });
    } catch (e) {
      console.error("Google button initialization error:", e);
    }
  }, [scriptLoaded, mode, clientId]);

  return (
    <div className={`w-full flex flex-col items-center justify-center ${className}`}>
      {loading ? (
        <div className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center gap-3 text-gray-700 font-medium text-sm shadow-sm animate-pulse">
          <svg className="animate-spin h-5 w-5 text-brand-green" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Connecting to Google...</span>
        </div>
      ) : (
        <div
          ref={buttonRef}
          className="w-full flex justify-center min-h-[44px] overflow-hidden rounded-xl"
        />
      )}
    </div>
  );
}
