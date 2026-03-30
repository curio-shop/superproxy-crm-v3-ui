import { useState } from 'react';
import { Icon } from '@iconify/react';

interface SignInProps {
  onSignIn: () => void;
  onGoToSignUp: () => void;
  onForgotPassword?: () => void;
}

export default function SignIn({ onSignIn, onGoToSignUp, onForgotPassword }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignIn();
    }, 800);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — dark brand */}
      <div className="hidden lg:flex lg:w-[45%] bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        {/* Subtle gradient mesh */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/6 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10">
          <img src="/superproxy-logo.png" alt="Superproxy" className="h-7 object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.8 }} />
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight tracking-tight" style={{ fontFamily: "'DM Serif Text', serif" }}>
            Close deals faster<br />with AI on your side.
          </h1>
          <p className="text-slate-400 text-[15px] leading-relaxed max-w-md">
            Superproxy gives your sales team AI-powered calls, smart quotes, and real-time insights — all in one workspace.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-slate-500 text-xs">superproxy.com</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 flex justify-center">
            <img src="/superproxy-logo.png" alt="Superproxy" className="h-6 object-contain" />
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Welcome back</h2>
            <p className="text-[14px] text-slate-400">Sign in to your account to continue</p>
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
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-semibold text-slate-700">Password</label>
                <button type="button" onClick={onForgotPassword} className="text-[12px] font-medium text-slate-400 hover:text-slate-600 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
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
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full py-3 rounded-xl bg-slate-900 text-white text-[14px] font-semibold hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon icon="svg-spinners:270-ring-with-bg" width="18" />
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-[13px] text-slate-400 mt-8">
            Don't have an account?{' '}
            <button onClick={onGoToSignUp} className="font-semibold text-slate-700 hover:text-slate-900 transition-colors">
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
