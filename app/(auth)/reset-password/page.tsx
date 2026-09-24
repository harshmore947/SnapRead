"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/actions/auth-actions";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!token || !email) {
      setError("Invalid or missing password reset token. Please request a new link.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword({
        email: email.trim().toLowerCase(),
        token: token.trim(),
        newPassword,
      });

      if (!res.success) {
        setError(res.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-extrabold text-2xl text-gray-900 tracking-tight">
            Snap<span className="text-rose-600">Read</span>
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Set new password
        </h1>
        <p className="text-sm text-gray-500 mt-1.5">
          Choose a secure password for your account
        </p>
      </div>

      {/* Card */}
      <div className="bg-white/90 backdrop-blur-xl border border-rose-100 rounded-3xl p-8 shadow-xl shadow-rose-950/5">
        {success ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Password reset successful</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Your password has been securely updated. You can now sign in with your new credentials.
              </p>
            </div>

            <div className="pt-4">
              <Link href="/sign-in">
                <Button className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium text-sm shadow-md shadow-rose-500/25">
                  Sign In <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {(!token || !email) && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-xs text-amber-800 border border-amber-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
                <span>
                  Missing reset token. Please click the link sent to your email or{" "}
                  <Link href="/forgot-password" className="underline font-semibold">
                    request a new one
                  </Link>
                  .
                </span>
              </div>
            )}

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-xs text-red-700 border border-red-100 animate-in fade-in-0 duration-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="newPassword"
                  className="text-xs font-semibold text-gray-700 uppercase tracking-wider block"
                >
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-11 rounded-xl border-gray-200 bg-white/50 pr-10 focus:border-rose-500 focus:ring-rose-500/20 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="text-xs font-semibold text-gray-700 uppercase tracking-wider block"
                >
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 rounded-xl border-gray-200 bg-white/50 focus:border-rose-500 focus:ring-rose-500/20 text-sm"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !token || !email}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium text-sm shadow-md shadow-rose-500/25 transition-all mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <Link
                href="/sign-in"
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline transition-colors"
              >
                Return to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-rose-50/50 via-white to-rose-50/30">
      <Suspense fallback={<div className="text-rose-500 font-medium">Loading...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
