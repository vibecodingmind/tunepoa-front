"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Music, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error === "CredentialsSignin" 
          ? "Invalid email or password" 
          : result.error);
      } else if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#050c18]" />
      <div className="absolute inset-0 bg-gradient-to-br from-teal-950/70 via-[#081525] to-cyan-950/50" />
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-[8%] right-[8%] w-[600px] h-[600px] bg-teal-500/[0.06] rounded-full blur-[120px]" />
      <div className="absolute bottom-[5%] left-[3%] w-[500px] h-[500px] bg-cyan-500/[0.05] rounded-full blur-[100px]" />
      <div className="absolute top-[15%] left-[10%] w-72 h-72 border border-teal-500/[0.04] rounded-full animate-spin-slow" />
      <div className="absolute bottom-[20%] right-[15%] w-96 h-96 border border-cyan-500/[0.03] rounded-full animate-spin-slow" style={{ animationDirection: "reverse" }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-5 py-12">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-shadow duration-500">
              <Music className="w-5 h-5 text-white" />
            </div>
            <img src="/logo.png" alt="TunePoa" className="h-8 w-auto object-contain" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-6 tracking-tight">
            Welcome back
          </h1>
          <p className="text-white/40 mt-2 text-sm">
            Sign in to your TunePoa account
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/60 text-sm font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-teal-500/50 focus:ring-teal-500/20 h-11 rounded-xl"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white/60 text-sm font-medium">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-teal-400 hover:text-teal-300 transition-colors duration-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-teal-500/50 focus:ring-teal-500/20 h-11 rounded-xl pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-white/20 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
              />
              <Label htmlFor="remember" className="text-white/40 text-sm cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-semibold h-11 rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-500 group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0a1628] px-4 text-white/25">or continue with</span>
            </div>
          </div>

          {/* Google Button (placeholder) */}
          <Button
            variant="ghost"
            className="w-full border border-white/10 hover:bg-white/5 hover:border-white/20 text-white/60 hover:text-white h-11 rounded-xl transition-all duration-300"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </Button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-sm text-white/35">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-teal-400 hover:text-teal-300 font-semibold transition-colors duration-300"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
