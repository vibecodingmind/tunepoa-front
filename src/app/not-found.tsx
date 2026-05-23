"use client";

import { Button } from "@/components/ui/button";
import { Home, Mail } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050c18] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-950/70 via-[#081525] to-cyan-950/50" />
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-teal-500/[0.06] rounded-full blur-[120px]" />
      <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-cyan-500/[0.05] rounded-full blur-[100px]" />

      <div className="relative z-10 text-center max-w-lg mx-auto px-6">
        <div className="glass-card rounded-3xl p-10 sm:p-14">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-8">
            <span className="text-5xl font-extrabold bg-gradient-to-r from-teal-300 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">404</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Page Not Found
          </h1>

          <p className="text-white/40 text-base sm:text-lg leading-relaxed mb-10">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Let us help you find your way back.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-semibold px-8 rounded-full shadow-lg shadow-teal-500/25 group transition-all duration-500 hover:scale-105">
              <a href="/">
                <Home className="w-4 h-4 mr-2 inline" />
                Back to Home
              </a>
            </Button>
            <Button asChild variant="ghost" className="text-white/50 hover:text-white hover:bg-white/5 font-medium px-8 rounded-full border border-white/10 hover:border-white/20 transition-all duration-300">
              <a href="/#contact">
                <Mail className="w-4 h-4 mr-2 inline" />
                Contact Support
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
