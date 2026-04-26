"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function SuperAdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/superadmin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Login failed");
      }

      const token = data.data?.token;
      const user = data.data?.user;

      if (!token) throw new Error("No token received");

      localStorage.setItem("token", token);
      sessionStorage.setItem("token", token);

      const authData = JSON.stringify({
        token,
        user: {
          id: user?.id,
          first_name: user?.first_name || "Super",
          last_name: user?.last_name || "Admin",
          email: user?.email || email,
          role: "superadmin",
        },
      });
      localStorage.setItem("studsphere_auth", authData);
      sessionStorage.setItem("studsphere_auth_session", authData);

      router.push("/superadmin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[400px] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-8">
        <div className="text-center mb-8">
          <Image
            src="/studsphere.png"
            alt="StudSphere"
            width={160}
            height={40}
            className="h-10 w-auto mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-gray-900">Super Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">Enter your credentials to access the admin panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="superadmin@studsphere.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
