import { useState } from 'react';
import { Icon } from '@iconify/react';

interface ForgotPasswordProps {
  onBackToSignIn: () => void;
}

export default function ForgotPassword({ onBackToSignIn }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      {/* Back link — top left */}
      <div className="fixed top-6 left-6">
        <button
          onClick={onBackToSignIn}
          className="flex items-center gap-1.5 text-[13px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Icon icon="solar:arrow-left-linear" width="14" />
          Back to sign in
        </button>
      </div>

      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img src="/superproxy-logo.png" alt="Superproxy" className="h-6 object-contain" />
        </div>

        {!isSent ? (
          /* Request form */
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 mb-5">
                <Icon icon="solar:lock-keyhole-linear" width="24" className="text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Reset your password</h2>
              <p className="text-[14px] text-slate-400 leading-relaxed">
                Enter the email address associated with your account and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  autoFocus
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[14px] text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-3 rounded-xl bg-slate-900 text-white text-[14px] font-semibold hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Icon icon="svg-spinners:270-ring-with-bg" width="18" />
                    Sending...
                  </span>
                ) : 'Send reset link'}
              </button>
            </form>
          </>
        ) : (
          /* Confirmation state */
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 mb-5">
              <Icon icon="solar:letter-bold" width="24" className="text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Check your email</h2>
            <p className="text-[14px] text-slate-400 leading-relaxed mb-8">
              We've sent a password reset link to<br />
              <span className="font-semibold text-slate-700">{email}</span>
            </p>

            <button
              onClick={onBackToSignIn}
              className="w-full py-3 rounded-xl bg-slate-900 text-white text-[14px] font-semibold hover:bg-slate-800 transition-all active:scale-[0.98] shadow-sm"
            >
              Back to sign in
            </button>

            <button
              onClick={() => setIsSent(false)}
              className="w-full text-center text-[13px] text-slate-400 hover:text-slate-600 transition-colors mt-4 font-medium"
            >
              Didn't receive it? Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
