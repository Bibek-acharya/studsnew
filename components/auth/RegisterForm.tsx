"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/services/AuthContext";
import { apiService } from "@/services/api";
import { Eye, EyeOff, Mail, ArrowLeft, Info } from "lucide-react";
import {
  persistReferralInvite,
  resolveReferralInvite,
  clearReferralInvite,
  type ReferralInvite,
} from "@/lib/referralInvite";

/**
 * The server's view of the invite, and the browser's.
 *
 * They differ, and the difference is the whole reason this is
 * `useSyncExternalStore` and not a `useState` initialiser: the prerendered HTML
 * was produced without a `window`, so `getServerSnapshot` must return the
 * no-invite answer. Returning anything else would be a hydration mismatch, and a
 * mismatch on the signup form is a console error and a flash.
 */
const NO_INVITE: ReferralInvite = { code: null, source: "none" };

/** The `ref` parameter, or null. Never throws: a URL is not user input here. */
function readRefParam(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return new URLSearchParams(window.location.search).get("ref");
  } catch {
    return null;
  }
}

/**
 * Cached so the snapshot is referentially stable.
 *
 * `useSyncExternalStore` compares snapshots by identity and re-renders whenever
 * they differ, so a function returning a fresh object every call would loop
 * forever. Caching on the raw parameter means the decision runs once per
 * distinct URL rather than once per render — and it also means
 * `resolveReferralInvite` is called during render, which is only sound because
 * it is pure.
 */
let cachedRef: string | null = null;
let cachedInvite: ReferralInvite = NO_INVITE;
let cachedResolved = false;

function inviteSnapshot(): ReferralInvite {
  const ref = readRefParam();
  if (!cachedResolved || ref !== cachedRef) {
    cachedRef = ref;
    cachedInvite = resolveReferralInvite(ref);
    cachedResolved = true;
  }
  return cachedInvite;
}

/** Back/forward within a signup flow should re-read the URL, not a stale copy. */
function subscribeToUrl(onChange: () => void): () => void {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

function useReferralInvite(): ReferralInvite {
  return useSyncExternalStore(subscribeToUrl, inviteSnapshot, () => NO_INVITE);
}

type Step = "email" | "details" | "verify";

export default function RegisterForm() {
  const router = useRouter();
  const { verifyOTP } = useAuth();
  
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(120);
  const [otpResendDisabled, setOtpResendDisabled] = useState(false);

  /**
   * The invite code this registration will carry, if any.
   *
   * Read from the URL through `useSyncExternalStore` rather than
   * `useSearchParams`, and that is a two-part decision.
   *
   * `useSearchParams` in a client component opts the whole route into a
   * client-render bailout, and `/register` is currently STATIC in the build — a
   * public signup page, which this feature has no business making per-request.
   * `app/study-resources/can-unlock` is the repo's precedent for treating that
   * trade as not worth making.
   *
   * `useState` + an effect that reads `window.location.search` is the other
   * tempting answer and it is worse twice over: it renders one frame without the
   * notice, and it trips `react-hooks/set-state-in-effect` for a real reason —
   * the URL is not component state, it is an external store the browser owns,
   * and `useSyncExternalStore` is the API for exactly that. It also gets
   * back/forward right for free, which an effect with `[]` never would.
   */
  const invite = useReferralInvite();

  /**
   * Remember the code for a later visit to a bare `/register`.
   *
   * A separate effect from the read because `resolveReferralInvite` is pure and
   * this is the write. It calls no `setState`, so it is not a cascading render,
   * and it re-runs only when the code itself changes.
   */
  useEffect(() => {
    if (invite.code) persistReferralInvite(invite.code);
  }, [invite.code]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === "verify") {
      const interval = setInterval(() => {
        setOtpTimer(t => {
          if (t <= 1) {
            clearInterval(interval);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isStep1Valid = isValidEmail(email) && agreeTerms;

  const passwordChecks = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const isPasswordStrong = Object.values(passwordChecks).every(Boolean);
  const isStep2Valid = firstName.trim() !== "" && lastName.trim() !== "" && isPasswordStrong && confirmPassword === password;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep1Valid) return;
    setStep("details");
  };

  const handleDetailsSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!isPasswordStrong) {
      setError("Password must include uppercase, lowercase, a number, and a special character.");
      return;
    }

    setLoading(true);
    setError("");
    
    let accountCreated = false;
    
    try {
      await apiService.register({
        email: email.trim(),
        password: password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        // The code is a plain string the server normalises and looks up; it
        // carries no amount and can change nothing about what the account is
        // worth. Omitted entirely when there is no invite, rather than sent as
        // an empty string, so the field is absent rather than blank.
        ...(invite.code ? { referral_code: invite.code } : {}),
      });
      accountCreated = true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create account. Please try again.";
      setError(message);
      setLoading(false);
      return;
    }
    
    if (!accountCreated) {
      setError("Failed to create account. Please try again.");
      setLoading(false);
      return;
    }

    // The referral is attributed at user creation, so the code has done its job
    // and is single-use per account. Leaving it behind would mean a second
    // account created from this browser carried a code that cannot be used.
    clearReferralInvite();
    
    try {
      await apiService.sendOTP(email.trim(), "verification");
    } catch {
      // OTP API returns error but email IS sent (per backend logs)
    }
    
    setStep("verify");
    setOtpTimer(120);
    setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    setLoading(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6).replace(/\D/g, "");
    const newOtp = Array(6).fill("").map((_, i) => paste[i] || "");
    setOtp(newOtp);
    if (paste[5]) otpInputRefs.current[5]?.focus();
    else if (paste.length) otpInputRefs.current[paste.length]?.focus();
  };

  const handleVerifySubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the full 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await verifyOTP(email.trim(), otpCode);
      router.replace("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpResendDisabled(true);
    setError("");
    try {
      await apiService.sendOTP(email.trim(), "verification");
      setOtpTimer(120);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend code.");
    } finally {
      setOtpResendDisabled(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setError("");
  };

  const handleBackToDetails = () => {
    setStep("details");
    setError("");
  };

  /**
   * The only thing this form says about an invite that went wrong.
   *
   * A student who followed a friend's link and arrived here is one step from an
   * account, the friend is not present to explain, and the code is not what they
   * came for. So the notice states the failure in a sentence and then stops: no
   * error styling, no red, nothing that reads as a rejected registration, and no
   * suggestion to go back and try a link again. There is nothing to retry — the
   * link is what it is, and the account is worth having either way.
   *
   * It renders only for `invalid-link`, which is a code that was present and
   * cannot be one. A code that is well-formed but unknown is NOT reported, and
   * the reason is in `03-api-contract.md` §2.5: there is deliberately no way to
   * ask whether a code exists, so this form cannot honestly claim one does not.
   * The server stages an unknown code, attributes nothing, and says nothing.
   */
  const inviteNotice =
    invite.source === "invalid-link" ? (
      <p className="flex items-start gap-2 rounded-md border border-gray-200 bg-gray-50 p-3 text-xs leading-5 text-gray-600">
        <Info size={13} className="mt-0.5 shrink-0 text-gray-400" aria-hidden="true" />
        <span>
          That invite link did not work. You can still create an account.
        </span>
      </p>
    ) : null;

  if (step === "email") {
    return (
      <form onSubmit={handleEmailSubmit} className="space-y-5">
        {inviteNotice}
        <button
          type="button"
          onClick={() => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google?prompt=select_account`;
          }}
          className="w-full bg-white border border-gray-200 rounded-md py-3 px-4 flex items-center justify-center gap-3 font-semibold text-gray-800 transition-colors hover:bg-gray-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center w-full">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">OR CONTINUE</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Email address</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 transition-colors ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-brand-blue"}`}
            />
          </div>
          {error && (
            <p className="text-[11px] text-red-500 mt-1">{error}</p>
          )}
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-gray-300 text-brand-blue focus:ring-brand-blue focus:ring-offset-0 cursor-pointer accent-brand-blue"
          />
          <label htmlFor="terms" className="text-sm text-gray-800 cursor-pointer select-none font-medium leading-relaxed">
            I have read and agree to the{" "}
            <a href="#" className="text-gray-900 underline underline-offset-2 font-semibold decoration-gray-300 hover:decoration-brand-blue transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-gray-900 underline underline-offset-2 font-semibold decoration-gray-300 hover:decoration-brand-blue transition-colors">
              Privacy Policy
            </a>.
          </label>
        </div>

        <button
          type="submit"
          disabled={!isStep1Valid || loading}
          className={`w-full py-3.5 rounded-md font-bold text-white text-[15px] transition-colors ${isStep1Valid ? "bg-brand-blue hover:bg-blue-700 cursor-pointer" : "bg-gray-400 cursor-not-allowed"}`}
        >
          {loading ? "Sending..." : "Continue"}
        </button>

        <div className="flex flex-col items-center gap-6 mt-2">
          <p className="text-sm font-medium text-gray-900">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-blue font-semibold underline underline-offset-2 ml-1">
              Log in
            </Link>
          </p>
        </div>
      </form>
    );
  }

  if (step === "details") {
    return (
      <form onSubmit={handleDetailsSubmit} className="space-y-5">
        {inviteNotice}
        

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-900 mb-2">First Name</label>
            <input
              type="text"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-200 rounded-md py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-brand-blue transition-colors"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-900 mb-2">Last Name</label>
            <input
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-200 rounded-md py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-brand-blue transition-colors"
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-900 mb-2">Create Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-md py-3 px-4 pr-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-brand-blue transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9.5 text-gray-400 hover:text-gray-700 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {password && (
          <div className="space-y-1.5 -mt-2">
            {[
              { check: passwordChecks.minLength, label: "At least 8 characters" },
              { check: passwordChecks.uppercase, label: "One uppercase letter" },
              { check: passwordChecks.lowercase, label: "One lowercase letter" },
              { check: passwordChecks.number, label: "One number" },
              { check: passwordChecks.special, label: "One special character" },
            ].map(({ check, label }) => (
              <p key={label} className={`text-[12px] font-medium flex items-center gap-1.5 ${check ? "text-emerald-600" : "text-gray-400"}`}>
                <span className={check ? "text-emerald-500" : "text-gray-300"}>{check ? "✓" : "○"}</span>
                {label}
              </p>
            ))}
          </div>
        )}

        <div className="relative">
          <label className="block text-sm font-medium text-gray-900 mb-2">Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-md py-3 px-4 pr-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-brand-blue transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9.5 text-gray-400 hover:text-gray-700 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {error && (
          <p className="text-[13px] text-red-500 font-medium text-center">{error}</p>
        )}

        <button
          type="button"
          onClick={handleDetailsSubmit}
          disabled={!isStep2Valid || loading}
          className={`w-full py-3.5 rounded-md font-bold text-white text-[15px] transition-colors ${isStep2Valid ? "bg-brand-blue hover:bg-blue-700 cursor-pointer" : "bg-gray-800 cursor-not-allowed"}`}
        >
          {loading ? "Please wait..." : "Verify Account"}
        </button>

        <div className="flex flex-col items-center gap-6 mt-2">
          <p className="text-sm font-medium text-gray-900">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-blue font-semibold underline underline-offset-2 ml-1">
              Log in
            </Link>
          </p>
          <button
          type="button"
          onClick={handleBackToEmail}
          className="text-gray-500 hover:text-gray-800 flex items-center text-sm font-medium transition-colors focus:outline-none mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Email
        </button>
        </div>
        
      </form>
    );
  }

  if (step === "verify") {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={handleBackToDetails}
          className="text-gray-500 hover:text-gray-800 flex items-center text-sm font-medium transition-colors focus:outline-none mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to sign up
        </button>

        <p className="text-gray-600 text-[15px] text-center leading-relaxed">
          We&apos;ve sent a code to <br />
          <span className="font-bold text-gray-900">{email}</span>
        </p>

        <div className="flex gap-4 justify-center" onPaste={handleOtpPaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { otpInputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => { handleOtpChange(idx, e.target.value); setError(""); }}
              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
              className={`w-14 h-16 text-center text-2xl font-bold text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:ring-0 transition-colors bg-white ${error ? "border-red-500 focus:border-red-500" : "focus:border-brand-blue"}`}
            />
          ))}
        </div>
        {error && (
          <p className="text-[11px] text-red-500 mt-1 text-center">{error}</p>
        )}

        <button
          type="button"
          onClick={handleVerifySubmit}
          disabled={otp.join("").length !== 6 || loading}
          className={`w-full py-3.5 rounded-md font-bold text-white text-[15px] transition-colors ${otp.join("").length === 6 ? "bg-brand-blue hover:bg-blue-700 cursor-pointer" : "bg-gray-800 cursor-not-allowed"}`}
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>

        <div className="flex justify-between items-center w-full px-1">
          <span className="text-sm font-medium text-gray-500">
            Code expires in <span className="text-gray-900 font-bold ml-1">{formatTimer(otpTimer)}</span>
          </span>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={otpTimer > 0 || otpResendDisabled}
            className={`text-sm font-bold text-brand-blue hover:underline underline-offset-2 ${otpTimer > 0 || otpResendDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {otpResendDisabled ? "Sending..." : "Resend Code"}
          </button>
          
        </div>
        
      </div>
    );
  }

  return null;
}
