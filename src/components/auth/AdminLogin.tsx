"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useUserStore } from "@/store/useUserStore";
import { Mail, Lock, ShieldAlert } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Hardcoded check for initial security, or strictly rely on Firestore role
    // Ideally, we authenticate against Firebase first.

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const user = userCredential.user;

      // 2. Verify Role in Firestore (or Claims if set)
      // For this quick implementation, we check if email matches admin@achariya.org OR if firestore says admin.
      let isAdmin = false;

      if (user.email === "admin@achariya.org") {
        isAdmin = true;
      } else {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          isAdmin = true;
        }
      }

      if (!isAdmin) {
        setError("Access Denied: Not an Administrator");
        await auth.signOut();
        setLoading(false);
        return;
      }

      // 3. Set Store
      setUser({
        uid: user.uid,
        email: user.email || "",
        role: "admin",
        token: await user.getIdToken(),
        name: user.displayName || "Admin",
      });

      router.push("/admin/dashboard"); // Or home if dashboard doesn't exist yet
    } catch (err: any) {
      console.error(err);
      setError("Invalid Admin Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <div className="bg-white max-w-sm w-full rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
        <div className="bg-red-800 p-6 text-center">
          <ShieldAlert className="mx-auto text-white mb-2" size={32} />
          <h2 className="text-xl font-bold text-white uppercase tracking-widest">
            Admin Access
          </h2>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4 text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:border-red-800 focus:ring-1 focus:ring-red-800 outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:border-red-800 focus:ring-1 focus:ring-red-800 outline-none"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded font-bold hover:bg-black transition-colors"
            >
              {loading ? "Verifying..." : "Login to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
