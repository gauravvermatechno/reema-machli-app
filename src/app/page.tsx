"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Target,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const auth = localStorage.getItem("reema-auth");
    if (auth === "authenticated") {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter your username.");
      return;
    }

    if (username.trim().toLowerCase() !== "reema") {
      setError("Access denied. This tracker is for Reema only.");
      return;
    }

    setIsLoading(true);

    // Brief delay for polish
    await new Promise((resolve) => setTimeout(resolve, 800));

    localStorage.setItem("reema-auth", "authenticated");
    localStorage.setItem("reema-user", "Reema");
    router.push("/dashboard");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      {/* Gradient background */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            "linear-gradient(135deg, #0d4b4a 0%, #1a6b5a 20%, #2d8f6f 40%, #6aaa7e 55%, #c4a95a 72%, #d4a843 85%, #c98b3a 100%)",
        }}
      />

      {/* Animated ambient orbs */}
      <motion.div
        className="absolute -z-10 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(212,168,67,0.6) 0%, transparent 70%)",
          top: "-10%",
          right: "-5%",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -z-10 h-[600px] w-[600px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(13,75,74,0.7) 0%, transparent 70%)",
          bottom: "-15%",
          left: "-10%",
        }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Fine grain texture overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div
          className="relative overflow-hidden rounded-3xl border border-white/20 p-8 shadow-2xl sm:p-10"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(24px) saturate(1.4)",
            WebkitBackdropFilter: "blur(24px) saturate(1.4)",
          }}
        >
          {/* Subtle top highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {/* Brand header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 text-center"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg">
              <Target className="h-8 w-8 text-amber-300" strokeWidth={1.8} />
            </div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
              Reema&apos;s Action Tracker
            </h1>
            <p className="text-sm font-medium tracking-wide text-white/60">
              Conquer your tasks, one step at a time
            </p>
          </motion.div>

          {/* Login form */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            onSubmit={handleLogin}
            className="space-y-5"
          >
            {/* Username field */}
            <div className="group relative">
              <label
                htmlFor="username"
                className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/50"
              >
                Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <User
                    className="h-4.5 w-4.5 text-white/30 transition-colors group-focus-within:text-amber-400"
                    strokeWidth={1.8}
                  />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your name"
                  autoComplete="username"
                  autoFocus
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-3.5 pl-11 pr-4 text-white placeholder-white/25 outline-none transition-all duration-200 focus:border-amber-400/50 focus:bg-white/8 focus:ring-2 focus:ring-amber-400/20"
                  aria-describedby={error ? "login-error" : undefined}
                  aria-invalid={error ? "true" : "false"}
                />
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  id="login-error"
                  role="alert"
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-start gap-2.5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3"
                >
                  <AlertCircle
                    className="mt-0.5 h-4 w-4 shrink-0 text-red-300"
                    strokeWidth={2}
                  />
                  <p className="text-sm leading-snug text-red-200">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="group relative flex w-full items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold text-emerald-950 shadow-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background: isLoading
                  ? "linear-gradient(135deg, #d4a843 0%, #c4a95a 100%)"
                  : "linear-gradient(135deg, #f5d76e 0%, #d4a843 50%, #c98b3a 100%)",
              }}
            >
              {isLoading ? (
                <>
                  <motion.div
                    className="h-4.5 w-4.5 rounded-full border-2 border-emerald-900/30 border-t-emerald-900"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4.5 w-4.5" strokeWidth={2} />
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <Sparkles className="h-3.5 w-3.5 text-amber-400/40" />
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Inspirational quote */}
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center"
          >
            <p className="text-sm italic leading-relaxed text-white/45">
              &ldquo;The most effective way to do it, is to do it.&rdquo;
            </p>
            <footer className="mt-2 text-xs font-medium tracking-wide text-white/30">
              &mdash; Amelia Earhart
            </footer>
          </motion.blockquote>
        </div>

        {/* Branding footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 text-center text-xs tracking-wide text-white/25"
        >
          Built with care for getting things done
        </motion.p>
      </motion.div>
    </div>
  );
}
