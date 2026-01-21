"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useUserStore } from "@/store/useUserStore";
import {
  Mail,
  Lock,
  Phone,
  MapPin,
  User as UserIcon,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  ArrowLeftCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";

// Array of images for the infinite slider
// Using the copied images in bg-removed-products
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
  const router = useRouter();
  const { setUser } = useUserStore();
  const [step, setStep] = useState<
    "email" | "otp" | "password-setup" | "profile" | "login"
  >("login");
  const [loading, setLoading] = useState(false);
  const [showPassword,setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    name: "",
    mobile: "",
    address: "",
    pincode: "",
  });
  const [error, setError] = useState("");

  // Carousel State
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sliderImages.length);
    }, 3000); // Change every 3 seconds
    return () => clearInterval(timer);
  }, []);

  // --- Mock OTP Logic ---
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);

  const handleSendOtp = async () => {
    setLoading(true);
    setError("");

    // Simulate sending OTP
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockOtp);
    console.log("--- MOCK OTP SENT ---");
    console.log("Email:", formData.email);
    console.log("OTP:", mockOtp);
    console.log("---------------------");

    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      alert(`MOCK OTP sent to ${formData.email}: ${mockOtp}`);
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (formData.otp === generatedOtp || formData.otp === "123456") {
      setStep("password-setup");
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  const handlePasswordSetup = async () => {
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
        role: "user",
      });

      setUser({
        uid: user.uid,
        email: user.email || "",
        role: "user",
        token: await user.getIdToken(),
      });

      setStep("profile");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleProfileSave = async (skip = false) => {
    setLoading(true);
    const { uid } = useUserStore.getState();
    if (!uid) return;

    try {
      const updates = {
        name: formData.name,
        mobile: formData.mobile,
        address: formData.address,
        pincode: formData.pincode,
      };

      if (!skip) {
        await setDoc(doc(db, "users", uid), updates, { merge: true });
        setUser(updates);
      }

      if (formData.name && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: formData.name });
      }

      router.push("/shop");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      setUser({
        uid: user.uid,
        email: user.email || "",
        role: userData.role || "user",
        token: await user.getIdToken(),
        name: userData.name || user.displayName || "",
        mobile: userData.mobile || "",
      });

      const redirectPath =
        userData.role === "admin" ? "/admin/dashboard" : "/shop";
      router.push(redirectPath);
    } catch (err: any) {
      setError("Invalid email or password.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          role: "user",
          createdAt: new Date(),
        });
      }

      const finalData = userDoc.exists()
        ? userDoc.data()
        : { name: user.displayName, role: "user" };

      setUser({
        uid: user.uid,
        email: user.email || "",
        role: finalData?.role || "user",
        token: await user.getIdToken(),
        name: finalData?.name || user.displayName || "",
        photoURL: user.photoURL || "",
      });

      const redirectPath =
        finalData?.role === "admin" ? "/admin/dashboard" : "/shop";
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col lg:flex-row bg-[#FAF7F2]">
      {/* LEFT SIDE - FORM */}
      <div className="w-full lg:w-2/5 flex flex-col justify-start items-center p-8 lg:p-12 relative z-10 bg-white lg:bg-[#FAF7F2]">
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

          <div className="bg-white p-8 lg:p-10 rounded-2xl shadow-xl lg:shadow-none lg:bg-transparent lg:border-none border border-[#E8D5B8] lg:border-0">
            <div className="mb-8">
              {/* {
                step === "email" && (
                  <button
                    onClick={() => {
                      setStep("login");
                      setFormData({ ...formData, email: "" });
                    }}
                    className=" hover:bg-gray-50 mb-3 hover:border-gray-300 transition-all"
                  >
                    
                  </button>
                )
              } */}
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
                      type={ showPassword ? "text" : "password"}
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
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
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
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </button>

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
                  onClick={handleSendOtp}
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
                  className="w-full bg-[#2C5530] text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:bg-[#1a3a20] transition-all"
                >
                  Verify Code
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

            {/* Step: Password Setup */}
            {step === "password-setup" && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Create a Password
                  </label>
                  <div className="relative group">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C9A961] transition-colors"
                      size={20}
                    />
                    <input
                      type="password"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9A961]/50 focus:border-[#C9A961] outline-none transition-all placeholder:text-gray-400"
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 ml-1">
                    Must be at least 6 characters with letters & numbers.
                  </p>
                </div>
                <button
                  onClick={handlePasswordSetup}
                  disabled={loading}
                  className="w-full bg-[#2C5530] text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:bg-[#1a3a20] transition-all"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            )}

            {/* Step: Profile */}
            {step === "profile" && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative group">
                    <UserIcon
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C9A961] transition-colors"
                      size={20}
                    />
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9A961]/50 focus:border-[#C9A961] outline-none transition-all placeholder:text-gray-400"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative group">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C9A961] transition-colors"
                      size={20}
                    />
                    <input
                      type="tel"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9A961]/50 focus:border-[#C9A961] outline-none transition-all placeholder:text-gray-400"
                      placeholder="+91 9876543210"
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData({ ...formData, mobile: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleProfileSave(true)}
                    className="w-full bg-white border border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    Skip
                  </button>
                  <button
                    onClick={() => handleProfileSave(false)}
                    disabled={loading}
                    className="w-full bg-[#2C5530] text-white py-3 rounded-xl font-bold hover:bg-[#1a3a20] transition-all"
                  >
                    {loading ? "Saving..." : "Done"}
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
            background: "radial-gradient(circle,rgba(233, 215, 154, 0.77) 0%, rgba(249, 182, 25, 0.62) 100%)",
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
              // Calculate position relative to active index
              const position =
                (index - activeIndex + sliderImages.length) %
                sliderImages.length;

              // We need to handle the wrapping correctly for the visual "left/center/right" logic
              // Let's simplify: determine if this index is the "active", "previous", or "next"

              let isActive = index === activeIndex;
              let isPrev =
                index ===
                (activeIndex - 1 + sliderImages.length) % sliderImages.length;
              let isNext = index === (activeIndex + 1) % sliderImages.length;

              // If it's none of these, hide it (or position it far away)
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
                      <Image
                        src={img}
                        alt="Cheese Product"
                        fill
                        className="object-contain drop-shadow-2xl"
                      />
                    </div>
                    <div className="absolute bottom-0 bg-black/10 mx-auto h-[40px] w-75 rounded-[100%] blur ">
                    </div>
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
