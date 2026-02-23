"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "@/lib/api";
import { useUserStore } from "@/store/useUserStore";
import {
  Mail,
  Lock,
  Phone,
  User as UserIcon,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  ChevronDown,
  Check,
  MapPin,
} from "lucide-react";

// Country data for the selector
const countries = [
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { name: "Singapore", code: "+65", flag: "🇸🇬" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "Italy", code: "+39", flag: "🇮🇹" },
].sort((a, b) => a.name.localeCompare(b.name));

// Array of images for the infinite slider
const sliderImages = [
  "/bg-removed/baby-swiss-package.png",
  "/bg-removed/daddy-swiss-package.png",
  "/bg-removed/pondy-orange-package.png",
  "/bg-removed/grana-chery-package.png",
  "/bg-removed/burrata-package.png",
  "/bg-removed/mozzarella-package.png",
  "/bg-removed/bocconcini-package.png",
  "/bg-removed/ricotta-package.png",
  "/bg-removed/halloumi-package.png",
  "/bg-removed/feta-package.png",
  "/bg-removed/pizzaella-package.png",
  "/bg-removed/cottage-cheese-package.png",
];

export default function UserLogin() {
  const navigate = useNavigate();
  const { setUser, fetchWishlist } = useUserStore();
  const [step, setStep] = useState<
    | "email"
    | "otp"
    | "password-setup"
    | "profile"
    | "login"
    | "forgot-password"
    | "reset-password"
  >("login");
  const [otpPurpose, setOtpPurpose] = useState<"signup" | "reset-password">(
    "signup",
  );
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    name: "",
    mobile: "",
    countryCode: "+91",
    address: "",
    city: "",
    state: "",
    pincode: "",
    confirmPassword: "",
  });
  const [isLocating, setIsLocating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [showCountrySelector, setShowCountrySelector] = useState(false);

  // Carousel State
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Validation Logic
  const validateField = (field: string, value: string) => {
    let errorMsg = "";
    switch (field) {
      case "name":
        if (!value) errorMsg = "Full name is required";
        else if (!/^[a-zA-Z\s]+$/.test(value))
          errorMsg = "Name must only contain alphabets";
        break;
      case "mobile":
        if (!value) errorMsg = "Mobile number is required";
        else if (!/^\d+$/.test(value)) errorMsg = "Must be numeric";
        else if (value.length < 7 || value.length > 15)
          errorMsg = "Invalid length (7-15 digits)";
        break;
      case "pincode":
        if (!value) errorMsg = "Pincode is required";
        else if (!/^\d+$/.test(value)) errorMsg = "Must be numeric";
        else if (value.length < 5 || value.length > 10)
          errorMsg = "Invalid pincode length";
        break;
      case "address":
        if (!value) errorMsg = "Address is required";
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const isProfileFormValid = () => {
    return (
      formData.name &&
      /^[a-zA-Z\s]+$/.test(formData.name) &&
      formData.mobile &&
      /^\d+$/.test(formData.mobile) &&
      formData.mobile.length >= 7 &&
      formData.address &&
      formData.city &&
      formData.state &&
      formData.pincode &&
      /^\d+$/.test(formData.pincode) &&
      !Object.values(errors).some((msg) => msg)
    );
  };

  // Handle inputs with immediate validation
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "mobile" || name === "pincode") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      validateField(name, numericValue);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      validateField(name, value);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const geoResp = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );
          const geoData = await geoResp.json();
          setFormData((prev) => ({
            ...prev,
            city: geoData.city || geoData.locality || "Pondicherry",
            state: geoData.principalSubdivision || "Puducherry",
            pincode: geoData.postcode || "605001",
          }));
        } catch {
          setFormData((prev) => ({
            ...prev,
            city: "Pondicherry",
            state: "Puducherry",
            pincode: "605001",
          }));
        }
        setIsLocating(false);
      },
      (error) => {
        console.error("GPS ERROR:", error.message);
        alert("Unable to retrieve your location");
        setIsLocating(false);
      },
    );
  };

  // Pincode Lookup logic
  useEffect(() => {
    if (formData.pincode.length === 6) {
      const pincodeData: Record<string, { city: string; state: string }> = {
        "605001": { city: "Pondicherry", state: "Puducherry" },
        "600119": { city: "Chennai", state: "Tamil Nadu" },
        "110001": { city: "New Delhi", state: "Delhi" },
        "400001": { city: "Mumbai", state: "Maharashtra" },
        "560001": { city: "Bangalore", state: "Karnataka" },
        "700001": { city: "Kolkata", state: "West Bengal" },
        "500001": { city: "Hyderabad", state: "Telangana" },
      };

      const data = pincodeData[formData.pincode];
      if (data) {
        setFormData((prev) => ({
          ...prev,
          city: data.city,
          state: data.state,
        }));
      }
    }
  }, [formData.pincode]);

  // Send OTP using backend API
  const handleSendOtp = async (
    purpose: "signup" | "reset-password" = "signup",
  ) => {
    setLoading(true);
    setError("");
    setOtpPurpose(purpose);

    try {
      const result = await authAPI.sendOTP(formData.email, purpose);

      if (result.success) {
        setStep("otp");
        // In development, OTP is returned for testing
        if (result.data?.otp) {
          console.log("Development OTP:", result.data.otp);
          alert(
            `OTP sent to ${formData.email}. Check console for development OTP.`,
          );
        }
      } else {
        setError(result.message || "Failed to send OTP");
      }
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP using backend API
  const handleVerifyOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await authAPI.verifyOTP(
        formData.email,
        formData.otp,
        otpPurpose,
      );

      if (result.success && result.data?.tempToken) {
        setTempToken(result.data.tempToken);
        if (otpPurpose === "reset-password") {
          setStep("reset-password");
        } else {
          setStep("password-setup");
        }
      } else {
        setError(result.message || "Invalid OTP");
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  // Set password using backend API
  const handlePasswordSetup = async () => {
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await authAPI.setPassword(
        formData.email,
        formData.password,
        tempToken,
      );

      if (result.success && result.data) {
        if (otpPurpose === "reset-password") {
          alert(
            "Password reset successfully! Please login with your new password.",
          );
          setStep("login");
          setFormData({ ...formData, password: "", otp: "" });
          return;
        }

        const { token, user } = result.data;

        setUser({
          uid: user.id,
          email: user.email,
          name: user.name || "",
          role: user.role,
          token: token,
        });

        setStep("profile");
      } else {
        setError(result.message || "Failed to create account");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Complete profile using backend API
  const handleProfileSave = async (skip = false) => {
    if (!skip && !isProfileFormValid()) {
      setError("Please fix the errors in the form.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (!skip) {
        const result = await authAPI.completeProfile({
          name: formData.name,
          mobile: formData.mobile,
          countryCode: formData.countryCode,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        });

        if (result.success) {
          setUser({
            name: formData.name,
            mobile: formData.mobile,
            countryCode: formData.countryCode,
          });
        }
      }

      navigate("/shop");
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  // Login using backend API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await authAPI.login(formData.email, formData.password);

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

        // Fetch wishlist after login
        await fetchWishlist();

        const redirectPath =
          user.role === "admin" ? "/admin/dashboard" : "/shop";
        navigate(redirectPath);
      } else {
        setError(result.message || "Invalid email or password");
      }
    } catch (err: any) {
      setError("Invalid email or password.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh]  flex flex-col lg:flex-row ">
      {/* LEFT SIDE - FORM */}
      <div className="w-full lg:w-2/5 flex flex-col justify-start items-center p-8 lg:p-12 relative z-10 bg-pattern">
        <div className="max-w-md w-full">
          {/* Mobile Header (Only visible on small screens) */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-heading font-bold text-[#2C5530]">
              Le Pondicherry Cheese
            </h1>
            <p className="text-[#C9A961] font-medium tracking-wide">
              ARTISAN CHEESE
            </p>
          </div>

          <div className="bg-pattern p-8 lg:p-10 rounded-2xl shadow-xl lg:shadow-none lg:bg-transparent lg:border-none border border-[#E8D5B8] lg:border-0">
            <div className="mb-8">
              <h2 className="text-3xl font-bold font-heading text-[#2C5530] mb-2">
                {step === "login" ? "Welcome Back" : "Join the Family"}
              </h2>
              <p className="text-gray-600">
                {step === "login"
                  ? "Enter your details to access your account."
                  : "Create an account to start your journey."}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 flex items-center gap-2">
                <span className="block w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                {error}
              </div>
            )}

            {/* Step: Login */}
            {step === "login" && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C9A961] transition-colors"
                      size={20}
                    />
                    <input
                      type="email"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-[#2C5530]/40 rounded-xl focus:ring-2 focus:ring-[#C9A961]/50 focus:border-[#C9A961] outline-none transition-all placeholder:text-gray-400"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative group gap-2 justify-between">
                    <div>
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C9A961] transition-colors"
                        size={20}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-[#2C5530]/40 rounded-xl focus:ring-2 focus:ring-[#C9A961]/50 focus:border-[#C9A961] outline-none transition-all placeholder:text-gray-400"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleShowPassword}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C9A961] transition-colors"
                      >
                        {showPassword ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded text-[#2C5530] focus:ring-[#2C5530] border-gray-300"
                    />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.email) {
                        setStep("forgot-password");
                      } else {
                        setError(
                          "Please enter your email first to reset password.",
                        );
                      }
                    }}
                    className="text-[#2C5530] font-medium hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2C5530] text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-[#2C5530]/20 hover:bg-[#1a3a20] hover:shadow-[#2C5530]/40 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? "Logging in..." : "Sign In"}{" "}
                  <ArrowRight size={20} />
                </button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm font-medium text-gray-500">
                    <span className="px-4 bg-white lg:bg-[#FAF7F2]">
                      New to Le Pondicherry Cheese?
                    </span>
                  </div>
                </div>

                <p className="text-center text-sm text-gray-600 mt-6">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setFormData({ ...formData, email: "" });
                    }}
                    className="text-[#C9A961] font-bold hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              </form>
            )}

            {/* Step: Email (Signup) */}
            {step === "email" && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter your Email
                  </label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C9A961] transition-colors"
                      size={20}
                    />
                    <input
                      type="email"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-[#2C5530]/40 rounded-xl focus:ring-2 focus:ring-[#C9A961]/50 focus:border-[#C9A961] outline-none transition-all placeholder:text-gray-400"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleSendOtp()}
                  disabled={!formData.email || loading}
                  className="w-full bg-[#2C5530] text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:bg-[#1a3a20] transition-all disabled:opacity-50"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
                <div className="">
                  <button
                    onClick={() => setStep("login")}
                    className="text-sm text-gray-500 hover:text-gray-800 font-medium"
                  >
                    <ArrowLeft className="inline-block mr-2" size={20} />
                    Back to Login
                  </button>
                </div>
              </div>
            )}

            {/* Step: OTP */}
            {step === "otp" && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#C9A961]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail size={32} className="text-[#C9A961]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Check your Email
                  </h3>
                  <p className="text-sm text-gray-500">
                    We've sent a 6-digit code to <br />
                    <span className="font-bold text-gray-800">
                      {formData.email}
                    </span>
                  </p>
                </div>

                <div className="flex justify-center">
                  <input
                    type="text"
                    className="w-full max-w-[240px] text-center text-3xl font-mono tracking-[0.5em] py-3 border-b-2 border-gray-300 focus:border-[#C9A961] outline-none bg-transparent transition-colors"
                    placeholder="••••••"
                    maxLength={6}
                    value={formData.otp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        otp: e.target.value.replace(/[^0-9]/g, ""),
                      })
                    }
                  />
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || formData.otp.length !== 6}
                  className="w-full bg-[#2C5530] text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:bg-[#1a3a20] transition-all disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
                <div className="text-center">
                  <button
                    onClick={() => setStep("email")}
                    className="text-sm text-gray-500 hover:text-gray-800 font-medium"
                  >
                    Change Email Address
                  </button>
                </div>
              </div>
            )}

            {/* Step: Password Setup (Signup) */}
            {step === "password-setup" && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold font-heading text-[#2C5530] mb-2">
                    Create Password
                  </h3>
                  <p className="text-sm text-gray-500">
                    Secure your new account with a strong password.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C9A961] transition-colors"
                      size={20}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9A961]/50 focus:border-[#C9A961] outline-none transition-all placeholder:text-gray-400"
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={handleShowPassword}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C9A961] transition-colors"
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C9A961] transition-colors"
                      size={20}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9A961]/50 focus:border-[#C9A961] outline-none transition-all placeholder:text-gray-400"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  {formData.password &&
                    formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-500 mt-2 ml-1">
                        Passwords do not match.
                      </p>
                    )}
                </div>

                <button
                  onClick={handlePasswordSetup}
                  disabled={
                    loading ||
                    !formData.password ||
                    formData.password !== formData.confirmPassword ||
                    formData.password.length < 6
                  }
                  className="w-full bg-[#2C5530] text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:bg-[#1a3a20] transition-all disabled:opacity-50"
                >
                  {loading ? "Creating Account..." : "Set Password"}
                </button>
              </div>
            )}

            {/* Step: Forgot Password Confirmation */}
            {step === "forgot-password" && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#C9A961]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock size={32} className="text-[#C9A961]" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-[#2C5530] mb-2">
                    Forgot Password
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    We will send an OTP to verify your identity for:
                    <br />
                    <span className="font-bold text-gray-800 break-all">
                      {formData.email}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => handleSendOtp("reset-password")}
                  disabled={loading}
                  className="w-full bg-[#2C5530] text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:bg-[#1a3a20] transition-all disabled:opacity-50"
                >
                  {loading ? "Sending OTP..." : "Send Reset OTP"}
                </button>

                <div className="text-center">
                  <button
                    onClick={() => setStep("login")}
                    className="text-sm text-gray-500 hover:text-gray-800 font-medium"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            )}

            {/* Step: Reset Password */}
            {step === "reset-password" && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold font-heading text-[#2C5530] mb-2">
                    Reset Password
                  </h3>
                  <p className="text-sm text-gray-500">
                    Create a secure new password for your account.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative group">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C9A961] transition-colors"
                      size={20}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9A961]/50 focus:border-[#C9A961] outline-none transition-all placeholder:text-gray-400"
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={handleShowPassword}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C9A961] transition-colors"
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative group">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C9A961] transition-colors"
                      size={20}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9A961]/50 focus:border-[#C9A961] outline-none transition-all placeholder:text-gray-400"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  {formData.password &&
                    formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-500 mt-2 ml-1">
                        Passwords do not match.
                      </p>
                    )}
                </div>

                <button
                  onClick={handlePasswordSetup}
                  disabled={
                    loading ||
                    !formData.password ||
                    formData.password !== formData.confirmPassword ||
                    formData.password.length < 6
                  }
                  className="w-full bg-[#2C5530] text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:bg-[#1a3a20] transition-all disabled:opacity-50"
                >
                  {loading ? "Resetting Password..." : "Update Password"}
                </button>
              </div>
            )}

            {/* Step: Profile (Enhanced - Checkout Style) */}
            {step === "profile" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-[#1A1A1A]">
                    Shipping Information
                  </h3>
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={isLocating}
                    className={`text-xs font-bold flex items-center gap-1 transition-all ${
                      isLocating
                        ? "text-gray-400"
                        : "text-[#2C5530] hover:underline"
                    }`}
                  >
                    {isLocating ? (
                      <>
                        <svg
                          className="animate-spin h-3 w-3"
                          viewBox="0 0 24 24"
                        >
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
                        Locating...
                      </>
                    ) : (
                      <>
                        <MapPin size={12} />
                        Auto-fill with GPS
                      </>
                    )}
                  </button>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                      errors.name
                        ? "border-red-300"
                        : "border-gray-300 focus:border-[#C9A961]"
                    }`}
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && (
                    <p className="text-[10px] text-red-500 mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    readOnly
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#6B6B6B] cursor-not-allowed"
                    value={formData.email}
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="w-20">
                      <div className="relative">
                        <select
                          className="w-full pl-2 pr-6 py-3 border border-gray-300 rounded-lg outline-none appearance-none bg-white text-sm"
                          value={formData.countryCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              countryCode: e.target.value,
                            })
                          }
                        >
                          {countries.map((c) => (
                            <option key={c.name} value={c.code}>
                              {c.code}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          size={12}
                        />
                      </div>
                    </div>
                    <input
                      name="mobile"
                      type="tel"
                      required
                      className={`flex-1 px-4 py-3 border rounded-lg outline-none transition-all ${
                        errors.mobile
                          ? "border-red-300"
                          : "border-gray-300 focus:border-[#C9A961]"
                      }`}
                      placeholder="Enter mobile number"
                      value={formData.mobile}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-[10px] text-red-500 mt-1">
                      {errors.mobile}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={2}
                    className={`w-full px-4 py-3 border rounded-lg outline-none transition-all resize-none ${
                      errors.address
                        ? "border-red-300"
                        : "border-gray-300 focus:border-[#C9A961]"
                    }`}
                    placeholder="House no, street, locality..."
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                {/* City, State, Pincode Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                      City *
                    </label>
                    <input
                      name="city"
                      type="text"
                      required
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A961] text-sm"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                      State *
                    </label>
                    <input
                      name="state"
                      type="text"
                      required
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A961] text-sm"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                      Pincode *
                    </label>
                    <input
                      name="pincode"
                      type="text"
                      required
                      maxLength={6}
                      className={`w-full px-3 py-3 border rounded-lg outline-none transition-all text-sm ${
                        errors.pincode
                          ? "border-red-300"
                          : "border-gray-300 focus:border-[#C9A961]"
                      }`}
                      placeholder="6 digits"
                      value={formData.pincode}
                      onChange={handleInputChange}
                    />
                    {formData.pincode.length === 6 && (
                      <span className="absolute right-2 bottom-3 text-[#2C5530] text-[10px] font-bold animate-pulse">
                        ✓ Located
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleProfileSave(false)}
                    disabled={loading || !isProfileFormValid()}
                    className="w-full bg-[#2C5530] text-white py-4 rounded-lg font-bold hover:bg-[#1a3a20] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                  >
                    {loading ? "Saving Profile..." : "Complete Profile"}
                    {!loading && <Check size={18} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - GRADIENT SLIDER */}
      <div className="hidden lg:block w-3/5 relative overflow-hidden rounded-l-3xl">
        {/* Gradient Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(circle,rgba(233, 215, 154, 0.77) 0%, rgba(249, 182, 25, 0.62) 100%)",
            animation: "gradientBG 20s ease infinite",
          }}
        ></div>

        {/* Overlay Details */}
        <div className="absolute inset-0 z-10 bg-black/5 pointer-events-none"></div>

        {/* Branding Title Top */}
        <div className="absolute top-22 left-0 right-0 z-30 text-center">
          <h1 className="text-5xl font-heading font-bold text-[#2C5530] mb-2 drop-shadow-sm">
            Le Pondicherry Cheese
          </h1>
          <div className="inline-block bg-[#2C5530] text-white px-6 py-1 rounded-full text-sm font-bold tracking-[0.2em] shadow-lg">
            PREMIUM ARTISAN CHEESE
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div className="absolute inset-0 flex items-center justify-center z-20 top-20">
          <div className="relative w-full h-[500px] flex  items-center justify-center">
            {sliderImages.map((img, index) => {
              let isActive = index === activeIndex;
              let isPrev =
                index ===
                (activeIndex - 1 + sliderImages.length) % sliderImages.length;
              let isNext = index === (activeIndex + 1) % sliderImages.length;

              if (!isActive && !isPrev && !isNext) return null;

              return (
                <div
                  key={index}
                  className={`absolute transition-all duration-700 ease-in-out flex items-center justify-center ${
                    isActive
                      ? "z-30 w-[350px] h-[350px] opacity-100 scale-110 translate-x-0"
                      : isPrev
                        ? "z-20 w-[250px] h-[250px] opacity-60 scale-90 -translate-x-[300px]"
                        : "z-20 w-[250px] h-[250px] opacity-60 scale-90 translate-x-[300px]"
                  }`}
                >
                  <div className="relative w-[500px] h-[500px]  rounded-full p-6 m-4  flex items-center justify-center">
                    <div className="relative w-[500px] h-[500px]">
                      <img
                        src={img}
                        alt="Cheese Product"
                        className="w-full h-full object-contain drop-shadow-2xl"
                      />
                    </div>
                    <div className="absolute bottom-0 bg-black/10 mx-auto h-[40px] w-75 rounded-[100%] blur "></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
