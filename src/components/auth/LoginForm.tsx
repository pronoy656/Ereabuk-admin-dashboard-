"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_ADMIN_EMAIL || "");
  const [password, setPassword] = useState(process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      
      // Based on server response: { success: true, data: { accessToken: "...", refreshToken: "..." } }
      const token = response.data?.data?.accessToken || response.data?.accessToken || response.data?.token || response.data?.data?.token;
      const user = response.data?.data?.user || response.data?.user || { email }; // Fallback to email if user object missing

      if (token) {
        login(token, user);
      } else {
        setError("Invalid response from server. Token missing.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Welcome Back</h1>
        <p className="text-slate-500">Login to your account</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500/20"
          />
        </div>
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500/20 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded border border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
              {/* Custom Checkbox */}
            </div>
            <span className="text-sm text-slate-500">Remember Password</span>
          </div>
          <Link href="/reset" className="text-sm text-slate-900 underline hover:text-blue-600 transition-colors">
            Forgot Password
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base font-bold bg-[#FF6B00] hover:bg-[#e56000] text-white shadow-lg shadow-[#FF6B00]/20 transition-all focus:ring-4 focus:ring-[#FF6B00]/30 active:scale-[0.98]"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
