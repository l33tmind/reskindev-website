"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { loginWithGoogle, loginWithEmail } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      await loginWithEmail(email, password);
      router.push("/");
    } catch (err) {
      setError("Invalid email or password.");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push("/");
    } catch (err) {
      setError("Google sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative">
      <div className="p-6">
        <Link href="/" className="inline-flex hover:bg-gray-200 dark:bg-gray-700 p-2 rounded-full transition-colors">
          <X size={24} className="text-gray-900 dark:text-white" />
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4 pb-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Sign in to manage your orders and profile</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address" 
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00C6A2] focus:border-transparent font-medium"
              />
            </div>
            
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
                className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00C6A2] focus:border-transparent font-medium"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm font-semibold text-center">{error}</p>}

            <div className="text-right">
              <button type="button" className="text-[#00C6A2] text-sm font-bold hover:underline">Forgot Password?</button>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#00C6A2] hover:bg-[#00B08F] text-white py-4 rounded-xl font-bold transition-colors disabled:opacity-50 mt-4"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-xs font-bold text-gray-400 uppercase">OR</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-transparent border border-gray-200 hover:bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center mt-8 text-sm font-medium text-gray-500 dark:text-gray-400">
            New here? <Link href="/signup" className="text-[#00C6A2] font-bold hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
