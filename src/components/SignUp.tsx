import { useState } from 'react';
import { Icon } from '@iconify/react';

interface SignUpProps {
  onSignUp: (email: string) => void;
  onGoToSignIn: () => void;
}

export default function SignUp({ onSignUp, onGoToSignIn }: SignUpProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignUp(email);
    }, 800);
  };

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-400'];

  return (
    <div className="min-h-screen flex">
      {/* Left panel — dark brand */}
      <div className="hidden lg:flex lg:w-[45%] bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/6 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10">
          <img src="/superproxy-logo.png" alt="Superproxy" className="h-7 object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.8 }} />
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight tracking-tight" style={{ fontFamily: "'DM Serif Text', serif" }}>
            Your AI sales team<br />starts here.
          </h1>
          <p className="text-slate-400 text-[15px] leading-relaxed max-w-md">
            Join thousands of teams using Superproxy to send smarter quotes, make AI calls, and close more deals.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-slate-500 text-xs">superproxy.com</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden mb-10 flex justify-center">
            <img src="/superproxy-logo.png" alt="Superproxy" className="h-6 object-contain" />
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Create your account</h2>
            <p className="text-[14px] text-slate-400">Get started for free. No credit card required.</p>
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
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[14px] text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-11 border border-slate-200 rounded-xl text-[14px] text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Icon icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} width="18" />
                </button>
              </div>
              {password.length > 0 && (
                <div className="flex items-center gap-2 mt-2.5">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength ? strengthColor[passwordStrength] : 'bg-slate-100'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-[11px] font-medium ${
                    passwordStrength === 1 ? 'text-rose-500' : passwordStrength === 2 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {strengthLabel[passwordStrength]}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || password.length < 6}
              className="w-full py-3 rounded-xl bg-slate-900 text-white text-[14px] font-semibold hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon icon="svg-spinners:270-ring-with-bg" width="18" />
                  Creating account...
                </span>
              ) : 'Create account'}
            </button>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <p className="text-center text-[13px] text-slate-400 mt-8">
            Already have an account?{' '}
            <button onClick={onGoToSignIn} className="font-semibold text-slate-700 hover:text-slate-900 transition-colors">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
