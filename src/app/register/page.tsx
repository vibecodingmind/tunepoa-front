"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Music, Loader2, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  organizationName: z.string().optional(),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms of service",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      terms: false as unknown as true,
    },
  });

  const termsChecked = watch("terms");

  const onSubmit = async (data: RegisterFormData) => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          password: data.password,
          organizationName: data.organizationName || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Something went wrong");
        return;
      }

      // Auto-login after successful registration
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        // If auto-login fails, redirect to login
        router.push("/login");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      {/* Background */}
      <div className="absolute inset-0 bg-[#050c18]" />
      <div className="absolute inset-0 bg-gradient-to-br from-teal-950/70 via-[#081525] to-cyan-950/50" />
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-[8%] left-[8%] w-[600px] h-[600px] bg-teal-500/[0.06] rounded-full blur-[120px]" />
      <div className="absolute bottom-[5%] right-[3%] w-[500px] h-[500px] bg-cyan-500/[0.05] rounded-full blur-[100px]" />
      <div className="absolute top-[15%] right-[10%] w-72 h-72 border border-teal-500/[0.04] rounded-full animate-spin-slow" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-5">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-shadow duration-500">
              <Music className="w-5 h-5 text-white" />
            </div>
            <img src="/logo.png" alt="TunePoa" className="h-8 w-auto object-contain" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-6 tracking-tight">
            Create your account
          </h1>
          <p className="text-white/40 mt-2 text-sm">
            Start your 14-day free trial today
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-white/60 text-sm font-medium">
                Full name <span className="text-red-400">*</span>
              </label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register("name")}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-teal-500/50 focus:ring-teal-500/20 h-11 rounded-xl"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-white/60 text-sm font-medium">
                Email address <span className="text-red-400">*</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                {...register("email")}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-teal-500/50 focus:ring-teal-500/20 h-11 rounded-xl"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-white/60 text-sm font-medium">
                Phone number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+255 7XX XXX XXX"
                {...register("phone")}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-teal-500/50 focus:ring-teal-500/20 h-11 rounded-xl"
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Organization Name */}
            <div className="space-y-1.5">
              <label htmlFor="organizationName" className="text-white/60 text-sm font-medium">
                Organization name <span className="text-white/25 text-xs">(optional)</span>
              </label>
              <Input
                id="organizationName"
                placeholder="Your company name"
                {...register("organizationName")}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-teal-500/50 focus:ring-teal-500/20 h-11 rounded-xl"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-white/60 text-sm font-medium">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  {...register("password")}
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
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-white/60 text-sm font-medium">
                Confirm password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  {...register("confirmPassword")}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-teal-500/50 focus:ring-teal-500/20 h-11 rounded-xl pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors duration-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">
              <Checkbox
                id="terms"
                checked={termsChecked as boolean}
                onCheckedChange={(checked) => {
                  setValue("terms", checked as boolean ? (true as const) : (false as unknown as true));
                }}
                className="border-white/20 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500 mt-0.5"
              />
              <label htmlFor="terms" className="text-white/40 text-xs leading-relaxed cursor-pointer">
                I agree to the{" "}
                <Link href="/terms" className="text-teal-400 hover:text-teal-300 transition-colors duration-300 underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-teal-400 hover:text-teal-300 transition-colors duration-300 underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-400 text-xs">{errors.terms.message}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-semibold h-11 rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-500 group mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </Button>
          </form>

          {/* Benefits */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="space-y-2.5">
              {[
                "14-day free trial, no credit card required",
                "Access to 500+ professional ringback tones",
                "Seamless telecom network integration",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="text-white/35 text-xs">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Login Link */}
        <p className="text-center mt-6 text-sm text-white/35">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-teal-400 hover:text-teal-300 font-semibold transition-colors duration-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
