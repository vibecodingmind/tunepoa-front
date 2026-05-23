"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music, Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Something went wrong");
        return;
      }

      setIsSubmitted(true);
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
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          {isSubmitted ? (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-teal-400" />
              </div>
              <h1 className="text-xl font-bold text-white mb-3">
                Check your email
              </h1>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                If an account exists with <span className="text-white/60">{email}</span>, you will receive a password reset link shortly.
              </p>
              <Button
                variant="ghost"
                className="text-teal-400 hover:text-teal-300 hover:bg-white/5 transition-all duration-300"
                asChild
              >
                <Link href="/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to sign in
                </Link>
              </Button>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-5">
                  <Mail className="w-6 h-6 text-teal-400" />
                </div>
                <h1 className="text-xl font-bold text-white mb-2">
                  Forgot your password?
                </h1>
                <p className="text-white/40 text-sm">
                  No worries, we&apos;ll send you reset instructions.
                </p>
              </div>

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

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-semibold h-11 rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-500"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Button
                  variant="ghost"
                  className="text-white/40 hover:text-white/60 hover:bg-white/5 transition-all duration-300 text-sm"
                  asChild
                >
                  <Link href="/login">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to sign in
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
