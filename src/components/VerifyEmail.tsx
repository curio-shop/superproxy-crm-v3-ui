import { useState } from 'react';
import { Icon } from '@iconify/react';

interface VerifyEmailProps {
  email: string;
  onBackToSignIn: () => void;
}

export default function VerifyEmail({ email, onBackToSignIn }: VerifyEmailProps) {
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img src="/superproxy-logo.png" alt="Superproxy" className="h-6 object-contain" />
        </div>

        <div className="text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 mb-5">
            <Icon icon="solar:mailbox-linear" width="24" className="text-slate-500" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Verify your email</h2>
          <p className="text-[14px] text-slate-400 leading-relaxed mb-2">
            We've sent a verification link to
          </p>
          <p className="text-[14px] font-semibold text-slate-700 mb-8">{email}</p>

          {/* Instructions */}
          <div className="bg-slate-50 rounded-2xl p-5 mb-8 text-left">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-md bg-slate-200 text-[10px] font-bold text-slate-600 flex-shrink-0 mt-0.5">1</span>
                <p className="text-[13px] text-slate-600">Open your email inbox</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-md bg-slate-200 text-[10px] font-bold text-slate-600 flex-shrink-0 mt-0.5">2</span>
                <p className="text-[13px] text-slate-600">Click the verification link in the email from Superproxy</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-md bg-slate-200 text-[10px] font-bold text-slate-600 flex-shrink-0 mt-0.5">3</span>
                <p className="text-[13px] text-slate-600">Come back here and sign in to get started</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onBackToSignIn}
            className="w-full py-3 rounded-xl bg-slate-900 text-white text-[14px] font-semibold hover:bg-slate-800 transition-all active:scale-[0.98] shadow-sm mb-4"
          >
            Go to sign in
          </button>

          {/* Resend */}
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-[13px] font-medium text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
          >
            {isResending ? (
              <span className="flex items-center justify-center gap-1.5">
                <Icon icon="svg-spinners:270-ring-with-bg" width="14" />
                Resending...
              </span>
            ) : resent ? (
              <span className="text-emerald-500 flex items-center justify-center gap-1.5">
                <Icon icon="solar:check-circle-bold" width="14" />
                Email resent
              </span>
            ) : (
              "Didn't receive it? Resend email"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
