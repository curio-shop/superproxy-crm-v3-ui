import { useState } from 'react';
import { Icon } from '@iconify/react';

interface OnboardingProps {
  onComplete: () => void;
}

type WorkspaceChoice = 'create' | 'join' | null;

const DISCOVERY_OPTIONS = [
  { id: 'google', label: 'Google', icon: 'flat-color-icons:google', color: '' },
  { id: 'facebook', label: 'Facebook', icon: 'mdi:facebook', color: 'text-[#1877F2]' },
  { id: 'instagram', label: 'Instagram', icon: 'mdi:instagram', color: 'text-[#E4405F]' },
  { id: 'tiktok', label: 'TikTok', icon: 'ic:baseline-tiktok', color: 'text-[#000000]' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'mdi:linkedin', color: 'text-[#0A66C2]' },
  { id: 'x', label: 'X (Twitter)', icon: 'ri:twitter-x-fill', color: 'text-[#000000]' },
  { id: 'youtube', label: 'YouTube', icon: 'mdi:youtube', color: 'text-[#FF0000]' },
  { id: 'threads', label: 'Threads', icon: 'ri:threads-fill', color: 'text-[#000000]' },
  { id: 'referral', label: 'Friend / Referral', icon: 'solar:users-group-rounded-linear', color: 'text-slate-700' },
  { id: 'other', label: 'Other', icon: 'solar:widget-linear', color: 'text-slate-700' },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [workspaceChoice, setWorkspaceChoice] = useState<WorkspaceChoice>(null);
  const [workspaceName, setWorkspaceName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSource = (id: string) => {
    setSelectedSources(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const canProceedStep1 =
    (workspaceChoice === 'create' && workspaceName.trim().length > 0) ||
    (workspaceChoice === 'join' && inviteCode.trim().length > 0);

  const handleFinish = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onComplete();
    }, 600);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — dark brand */}
      <div className="hidden lg:flex lg:w-[45%] bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/6 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10">
          <img src="/superproxy-logo.png" alt="Superproxy" className="h-7 object-contain opacity-90" />
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight tracking-tight" style={{ fontFamily: "'DM Serif Text', serif" }}>
            {step === 1 ? (
              <>Set up your<br />workspace.</>
            ) : (
              <>Almost there.<br />One quick thing.</>
            )}
          </h1>
          <p className="text-slate-400 text-[15px] leading-relaxed max-w-md">
            {step === 1
              ? 'Your workspace is where your team collaborates — quotes, invoices, AI calls, and everything in between.'
              : 'This helps us understand our community better and serve you more effectively.'
            }
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className={`h-1 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-white' : 'bg-slate-700'}`} />
          <div className={`h-1 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-white' : 'bg-slate-700'}`} />
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[440px]">
          {/* Mobile logo + step */}
          <div className="lg:hidden mb-10 flex items-center justify-between">
            <img src="/superproxy-logo.png" alt="Superproxy" className="h-6 object-contain" />
            <span className="text-[12px] text-slate-400 font-medium">Step {step} of 2</span>
          </div>

          {step === 1 ? (
            /* Step 1 — Workspace */
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">How would you like to start?</h2>
                <p className="text-[14px] text-slate-400">You can always change this later.</p>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setWorkspaceChoice('create')}
                  className={`w-full flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left active:scale-[0.99] ${
                    workspaceChoice === 'create'
                      ? 'border-slate-800 bg-slate-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon icon="solar:buildings-2-linear" width="20" className="text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[14px] font-semibold text-slate-800">Create a new workspace</h3>
                    <p className="text-[12px] text-slate-400 mt-0.5">Start fresh with your own team workspace</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${
                    workspaceChoice === 'create' ? 'border-slate-800' : 'border-slate-300'
                  }`}>
                    {workspaceChoice === 'create' && <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />}
                  </div>
                </button>

                <button
                  onClick={() => setWorkspaceChoice('join')}
                  className={`w-full flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left active:scale-[0.99] ${
                    workspaceChoice === 'join'
                      ? 'border-slate-800 bg-slate-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon icon="solar:link-round-linear" width="20" className="text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[14px] font-semibold text-slate-800">Join an existing workspace</h3>
                    <p className="text-[12px] text-slate-400 mt-0.5">Use an invite link or code from your team</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${
                    workspaceChoice === 'join' ? 'border-slate-800' : 'border-slate-300'
                  }`}>
                    {workspaceChoice === 'join' && <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />}
                  </div>
                </button>
              </div>

              {/* Conditional input */}
              {workspaceChoice === 'create' && (
                <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <label className="block text-[13px] font-semibold text-slate-700 mb-2">Workspace name</label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="e.g. Acme Inc."
                    autoFocus
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[14px] text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
                  />
                </div>
              )}

              {workspaceChoice === 'join' && (
                <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <label className="block text-[13px] font-semibold text-slate-700 mb-2">Invite code or link</label>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Paste invite link or enter code"
                    autoFocus
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[14px] text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
                  />
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="w-full py-3 rounded-xl bg-slate-900 text-white text-[14px] font-semibold hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Continue
              </button>
            </div>
          ) : (
            /* Step 2 — Discovery */
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">How did you find Superproxy?</h2>
                <p className="text-[14px] text-slate-400">Select all that apply. This helps us improve.</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-8">
                {DISCOVERY_OPTIONS.map((option) => {
                  const isSelected = selectedSources.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleSource(option.id)}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border transition-all text-left active:scale-[0.98] ${
                        isSelected
                          ? 'border-slate-800 bg-slate-50/80'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <Icon icon={option.icon} width="16" className={isSelected ? option.color : 'text-slate-400'} />
                      <span className={`text-[13px] font-medium ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl text-[14px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all border border-slate-200 active:scale-[0.98]"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={isLoading || selectedSources.length === 0}
                  className="flex-1 py-3 rounded-xl bg-slate-900 text-white text-[14px] font-semibold hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Icon icon="svg-spinners:270-ring-with-bg" width="18" />
                      Setting up...
                    </span>
                  ) : 'Get Started'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
