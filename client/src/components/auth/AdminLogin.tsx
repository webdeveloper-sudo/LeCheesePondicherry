"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import { adminAPI } from "@/lib/api";
import { Mail, Lock, ShieldAlert } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
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

    try {
      const result = await adminAPI.login(formData.email, formData.password);

      if (result.success && result.data) {
        const { token, user } = result.data;

        // Set Store with 7-day session logic
        setUser({
          uid: user.id,
          email: user.email,
          role: "admin",
          token: token,
          name: "Admin",
          loginAt: Date.now(), // Store current timestamp for session tracking
        });

        navigate("/admin/dashboard");
      } else {
        setError(result.message || "Invalid Admin Credentials");
      }
    } catch (err: any) {
      console.error(err);
      setError("Server Error. Please try again later.");
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
