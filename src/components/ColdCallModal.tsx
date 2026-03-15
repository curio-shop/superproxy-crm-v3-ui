import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useCallManager, Contact } from '../contexts/CallManagerContext';
import PostCallModal from './PostCallModal';

interface ColdCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  onNavigateToHistory?: () => void;
}

export default function ColdCallModal({ isOpen, onClose, contact, onNavigateToHistory }: ColdCallModalProps) {
  const { activeCalls, focusedCallId, startCall, endCall, minimizeCall, getFocusedCall } = useCallManager();

  const [selectedVoice, setSelectedVoice] = useState('Sarah (Sales)');
  const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [voiceDropdownDirection, setVoiceDropdownDirection] = useState<'up' | 'down'>('down');
  const [productDropdownDirection, setProductDropdownDirection] = useState<'up' | 'down'>('down');
  const [showEndCallWarning, setShowEndCallWarning] = useState(false);
  const [showPostCallModal, setShowPostCallModal] = useState(false);
  const [completedCallData, setCompletedCallData] = useState<{ contact: Contact; duration: number } | null>(null);

  const voiceDropdownRef = useRef<HTMLDivElement>(null);
  const productDropdownRef = useRef<HTMLDivElement>(null);
  const voiceButtonRef = useRef<HTMLButtonElement>(null);
  const productButtonRef = useRef<HTMLButtonElement>(null);

  const focusedCall = getFocusedCall();
  const isCallActive = focusedCall !== null;
  const activeContact = isCallActive ? focusedCall.contact : contact;
  const callDuration = isCallActive ? focusedCall.duration : 0;
  const activeCallId = focusedCall?.id;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (voiceDropdownRef.current && !voiceDropdownRef.current.contains(event.target as Node)) {
        setShowVoiceDropdown(false);
      }
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target as Node)) {
        setShowProductDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showVoiceDropdown && voiceButtonRef.current) {
      const buttonRect = voiceButtonRef.current.getBoundingClientRect();
      const dropdownHeight = 250;
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      setVoiceDropdownDirection(spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? 'up' : 'down');
    }
  }, [showVoiceDropdown]);

  useEffect(() => {
    if (showProductDropdown && productButtonRef.current) {
      const buttonRect = productButtonRef.current.getBoundingClientRect();
      const dropdownHeight = 380;
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      setProductDropdownDirection(spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? 'up' : 'down');
    }
  }, [showProductDropdown]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedVoice('Sarah (Sales)');
      setSelectedProducts([]);
      setAdditionalInstructions('');
      setShowEndCallWarning(false);
      setShowPostCallModal(false);
      setCompletedCallData(null);
    }
  }, [isOpen]);

  if (!isOpen || !activeContact) return null;

  const voices = [
    { name: 'Sarah (Sales)', isSystem: true },
    { name: 'Michael (Support)', isSystem: true },
    { name: 'Emma (US-New York)', isSystem: false },
    { name: 'Yuki (Japanese)', isSystem: false },
    { name: 'Pierre (French)', isSystem: false },
    { name: 'Amir (Arabic)', isSystem: false },
  ];

  const products = [
    { name: 'Installation Fee', description: 'Professional installation service' },
    { name: 'PREFAB CONTAINER', description: 'Standard prefab container unit' },
    { name: 'Smart Prefab Container Office', description: 'Premium smart office container with modern amenities' },
  ];

  const allProductNames = products.map(p => p.name);
  const isAllProductsSelected = allProductNames.every(name => selectedProducts.includes(name));
  const mockCreditsRemaining = 47;

  const toggleProduct = (productName: string) => {
    setSelectedProducts(prev =>
      prev.includes(productName)
        ? prev.filter(p => p !== productName)
        : [...prev, productName]
    );
  };

  const toggleAllProducts = () => {
    if (isAllProductsSelected) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(allProductNames);
    }
  };

  const removeProduct = (productName: string) => {
    setSelectedProducts(prev => prev.filter(p => p !== productName));
  };

  const handleStartCall = () => {
    if (contact) {
      startCall(contact, selectedVoice, selectedProducts, additionalInstructions, 'coldCall');
    }
  };

  const handleEndCall = () => {
    setShowEndCallWarning(true);
  };

  const confirmEndCall = () => {
    if (activeCallId && focusedCall) {
      setCompletedCallData({
        contact: focusedCall.contact,
        duration: focusedCall.duration,
      });
      endCall(activeCallId);
      setShowEndCallWarning(false);
      setShowPostCallModal(true);
    }
  };

  const cancelEndCall = () => {
    setShowEndCallWarning(false);
  };

  const handleViewTranscript = () => {
    setShowPostCallModal(false);
    setCompletedCallData(null);
    onClose();
  };

  const handleClosePostCallModal = () => {
    setShowPostCallModal(false);
    setCompletedCallData(null);
    onClose();
  };

  const handleMinimize = () => {
    if (activeCallId) {
      minimizeCall(activeCallId);
      onClose();
    }
  };

  const handleClose = () => {
    if (isCallActive) {
      handleMinimize();
    } else {
      onClose();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const otherActiveCalls = activeCalls.filter(call => call.id !== activeCallId);

  if (isCallActive) {
    return (
      <>
      {!showPostCallModal && (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative">
          <div className="w-full bg-slate-50 p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="bg-gradient-to-br from-blue-50/50 via-white to-blue-50/50 opacity-100 w-full h-full absolute top-0 left-0"></div>

            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              {otherActiveCalls.length > 0 && (
                <div className="px-2.5 py-1 bg-white rounded-full shadow-md border border-slate-200 flex items-center gap-1.5">
                  <div className="flex -space-x-1">
                    {otherActiveCalls.slice(0, 3).map((call) => (
                      <div
                        key={call.id}
                        className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white"
                        style={{ backgroundColor: call.color }}
                      >
                        {call.contact.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    +{otherActiveCalls.length}
                  </span>
                </div>
              )}
              <button
                onClick={handleMinimize}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-white/80 rounded-lg transition-all shadow-md bg-white/60 backdrop-blur-sm"
                title="Minimize call"
              >
                <Icon icon="solar:minus-square-linear" className="w-4 h-4" />
              </button>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-6 w-full max-w-md">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 rounded-full border border-emerald-200">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-emerald-700">
                  {focusedCall?.callType === 'paymentReminder' ? 'AI Reminder Call' : focusedCall?.callType === 'quoteFollowUp' ? 'AI Follow-Up Call' : 'AI Cold Call'} In Progress
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {activeContact.name}
                </h2>
                {(activeContact.title || activeContact.company_name) && (
                  <div className="flex gap-2 text-xs text-slate-500 items-center justify-center">
                    <Icon icon="solar:case-minimalistic-linear" className="w-3.5 h-3.5 text-slate-400" />
                    {activeContact.title && <span>{activeContact.title}</span>}
                    {activeContact.title && activeContact.company_name && <span className="text-slate-300">at</span>}
                    {activeContact.company_name && <span className="font-medium text-slate-700">{activeContact.company_name}</span>}
                  </div>
                )}
              </div>

              <div className="flex w-44 h-44 relative items-center justify-center">
                <style>{`
                  @keyframes wave-stretch {
                    0%, 100% { height: 8px; opacity: 0.6; }
                    50% { height: 24px; opacity: 1; }
                  }
                  @keyframes ripple-expand {
                    0% { transform: scale(0.9); opacity: 0.5; border-width: 1.5px; }
                    100% { transform: scale(1.6); opacity: 0; border-width: 0px; }
                  }
                `}</style>

                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute w-28 h-28 rounded-full border border-blue-500/40 animate-[ripple-expand_2s_ease-out_infinite]" style={{ animationDelay: '0s' }}></div>
                  <div className="absolute w-28 h-28 rounded-full border border-blue-500/30 animate-[ripple-expand_2s_ease-out_infinite]" style={{ animationDelay: '0.6s' }}></div>
                  <div className="absolute w-28 h-28 rounded-full border border-blue-500/20 animate-[ripple-expand_2s_ease-out_infinite]" style={{ animationDelay: '1.2s' }}></div>
                </div>

                <div className="relative w-32 h-32 rounded-full bg-slate-900 shadow-2xl ring-1 ring-white/10 overflow-hidden flex items-center justify-center z-10">
                  <div className="absolute inset-0 opacity-90">
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500 rounded-full mix-blend-screen blur-xl animate-[spin_6s_linear_infinite]"></div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500 rounded-full mix-blend-screen blur-xl animate-[spin_5s_linear_infinite_reverse]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-500 rounded-full mix-blend-screen blur-2xl animate-pulse"></div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent"></div>
                  <div className="ring-inset rounded-full ring-white/10 ring-1 absolute top-0 right-0 bottom-0 left-0"></div>

                  <div className="relative z-20 flex items-center justify-center gap-1.5 h-8">
                    <div className="w-1.5 bg-white rounded-full shadow-sm animate-[wave-stretch_1s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 bg-white rounded-full shadow-sm animate-[wave-stretch_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 bg-white rounded-full shadow-sm animate-[wave-stretch_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.0s' }}></div>
                    <div className="w-1.5 bg-white rounded-full shadow-sm animate-[wave-stretch_0.9s_ease-in-out_infinite]" style={{ animationDelay: '0.3s' }}></div>
                    <div className="w-1.5 bg-white rounded-full shadow-sm animate-[wave-stretch_1.1s_ease-in-out_infinite]" style={{ animationDelay: '0.15s' }}></div>
                  </div>
                </div>

                <div className="absolute -bottom-2 z-20 bg-white shadow-lg ring-1 ring-slate-100 p-2 rounded-full text-emerald-600 flex items-center justify-center">
                  <Icon icon="solar:microphone-linear" className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <span className="text-xs font-medium text-slate-500">Duration</span>
                <span className="text-xl font-bold text-slate-900 tabular-nums">{formatDuration(callDuration)}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 w-full">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Icon icon="solar:smart-speaker-minimalistic-linear" className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500">Speaking with</span>
                  <span className="font-semibold text-slate-900">{focusedCall?.selectedVoice || selectedVoice}</span>
                </div>
              </div>

              <div className="w-full space-y-3">
                {!showEndCallWarning ? (
                  <button
                    onClick={handleEndCall}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-1.5 mx-auto"
                  >
                    <Icon icon="solar:phone-calling-rounded-broken" className="w-3.5 h-3.5" />
                    End Call
                  </button>
                ) : (
                  <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <div className="flex flex-col items-center text-center gap-2.5">
                        <div className="flex items-center justify-center gap-2">
                          <Icon icon="solar:danger-triangle-linear" className="w-5 h-5 text-amber-600" />
                          <h4 className="text-sm font-bold text-amber-900">End this call?</h4>
                        </div>
                        <p className="text-xs text-amber-700 leading-relaxed">
                          Ending the call now may interrupt important conversation flow. The recording and transcript will still be saved automatically.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={cancelEndCall}
                        className="flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-200"
                      >
                        Continue Call
                      </button>
                      <button
                        onClick={confirmEndCall}
                        className="flex-1 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-600/30 hover:bg-red-700 transition-all"
                      >
                        End Call
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {completedCallData && (
        <PostCallModal
          isOpen={showPostCallModal}
          contact={completedCallData.contact}
          duration={completedCallData.duration}
          onViewTranscript={handleViewTranscript}
          onClose={handleClosePostCallModal}
          onNavigateToHistory={onNavigateToHistory}
        />
      )}
      </>
    );
  }

  return (
    <>
    {!showPostCallModal && (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-white/50 flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative">
        <div className="w-full md:w-5/12 bg-slate-50 border-r border-slate-100 p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="bg-gradient-to-br from-blue-50/50 via-white to-blue-50/50 opacity-100 w-full h-full absolute top-0 left-0"></div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            {otherActiveCalls.length > 0 && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {otherActiveCalls.slice(0, 2).map((call) => (
                    <div
                      key={call.id}
                      className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white"
                      style={{ backgroundColor: call.color }}
                    >
                      {call.contact.name.charAt(0)}
                    </div>
                  ))}
                </div>
                <span className="text-xs font-semibold text-blue-900">
                  {otherActiveCalls.length} active call{otherActiveCalls.length > 1 ? 's' : ''}
                </span>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-base font-medium text-slate-400">Outgoing Call</p>
              <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
                {activeContact.name}
              </h2>
              {(activeContact.title || activeContact.company_name) && (
                <div className="flex gap-2 text-sm text-slate-500 items-center justify-center">
                  <Icon icon="solar:case-minimalistic-linear" className="w-3.5 h-3.5 text-slate-400" />
                  {activeContact.title && <span>{activeContact.title}</span>}
                  {activeContact.title && activeContact.company_name && <span className="text-slate-300">at</span>}
                  {activeContact.company_name && <span className="font-medium text-slate-700">{activeContact.company_name}</span>}
                </div>
              )}
            </div>

            <div className="flex w-48 h-48 relative items-center justify-center">
              <style>{`
                @keyframes wave-stretch {
                  0%, 100% { height: 8px; opacity: 0.6; }
                  50% { height: 24px; opacity: 1; }
                }
                @keyframes ripple-expand {
                  0% { transform: scale(0.9); opacity: 0.5; border-width: 1.5px; }
                  100% { transform: scale(1.6); opacity: 0; border-width: 0px; }
                }
              `}</style>

              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-28 h-28 rounded-full border border-blue-500/40 animate-[ripple-expand_2s_ease-out_infinite]" style={{ animationDelay: '0s' }}></div>
                <div className="absolute w-28 h-28 rounded-full border border-blue-500/30 animate-[ripple-expand_2s_ease-out_infinite]" style={{ animationDelay: '0.6s' }}></div>
                <div className="absolute w-28 h-28 rounded-full border border-blue-500/20 animate-[ripple-expand_2s_ease-out_infinite]" style={{ animationDelay: '1.2s' }}></div>
              </div>

              <div className="relative w-32 h-32 rounded-full bg-slate-900 shadow-2xl ring-1 ring-white/10 overflow-hidden flex items-center justify-center z-10 transition-transform duration-500 hover:scale-105">
                <div className="absolute inset-0 opacity-90">
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500 rounded-full mix-blend-screen blur-xl animate-[spin_6s_linear_infinite]"></div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500 rounded-full mix-blend-screen blur-xl animate-[spin_5s_linear_infinite_reverse]"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-500 rounded-full mix-blend-screen blur-2xl animate-pulse"></div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent"></div>
                <div className="ring-inset rounded-full ring-white/10 ring-1 absolute top-0 right-0 bottom-0 left-0"></div>

                <div className="relative z-20 flex items-center justify-center gap-1.5">
                  <div className="w-1.5 h-3 bg-white/80 rounded-full shadow-sm"></div>
                  <div className="w-1.5 h-5 bg-white/90 rounded-full shadow-sm"></div>
                  <div className="w-1.5 h-8 bg-white rounded-full shadow-sm"></div>
                  <div className="w-1.5 h-6 bg-white/90 rounded-full shadow-sm"></div>
                  <div className="w-1.5 h-4 bg-white/85 rounded-full shadow-sm"></div>
                  <div className="w-1.5 h-7 bg-white/95 rounded-full shadow-sm"></div>
                  <div className="w-1.5 h-5 bg-white/90 rounded-full shadow-sm"></div>
                  <div className="w-1.5 h-3 bg-white/80 rounded-full shadow-sm"></div>
                </div>
              </div>

              <div className="absolute -bottom-3 z-20 bg-white shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)] ring-1 ring-slate-100 p-2.5 rounded-full text-blue-600 flex items-center justify-center">
                <Icon icon="solar:microphone-linear" className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="relative inline-block text-left group z-50" ref={voiceDropdownRef}>
              <button
                ref={voiceButtonRef}
                type="button"
                onClick={() => setShowVoiceDropdown(!showVoiceDropdown)}
                className="flex hover:border-blue-400 hover:ring-4 hover:ring-blue-500/10 transition-all duration-200 outline-none cursor-pointer bg-white border-slate-200 border rounded-full pt-1.5 pr-2.5 pb-1.5 pl-3 shadow-sm gap-2 items-center"
              >
                <span className="text-sm font-medium text-slate-500">Speaking Voice:</span>
                <span className="text-sm font-medium text-slate-900">{selectedVoice}</span>
                <Icon icon="solar:alt-arrow-down-linear" className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${showVoiceDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showVoiceDropdown && (
                <div 
                  className={`absolute z-[250] w-72 ${
                    voiceDropdownDirection === 'up'
                      ? 'bottom-full mb-2'
                      : 'top-full mt-2'
                  }`}
                  style={{
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div 
                    className="rounded-xl border border-slate-200/80 bg-white shadow-xl"
                    style={{
                      animation: 'fadeIn 200ms ease-out'
                    }}
                  >
                    <div className="py-1.5 max-h-[160px] overflow-y-auto custom-scrollbar">
                      {voices.map((voice) => {
                        const isSelected = selectedVoice === voice.name;
                        return (
                          <button
                            key={voice.name}
                            onClick={() => {
                              setSelectedVoice(voice.name);
                              setShowVoiceDropdown(false);
                            }}
                            className={`flex w-full items-center justify-between px-3 py-2 text-left transition-all duration-150 ${
                              isSelected
                                ? 'bg-blue-50/80 text-blue-700'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className={`text-sm font-medium ${isSelected ? 'font-semibold' : ''}`}>
                                {voice.name}
                              </span>
                              {voice.isSystem && (
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                                  System
                                </span>
                              )}
                            </div>
                            {isSelected && (
                              <Icon icon="solar:check-circle-bold" width="16" className="text-blue-600 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <div className="px-3 py-2.5 border-t border-slate-100 bg-slate-50/50">
                      <p className="text-xs text-slate-500 text-center">
                        <span className="font-medium text-slate-700">Settings → Voices</span> to add custom voices
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:w-7/12 flex flex-col bg-white w-full justify-between">
          <div className="p-8 space-y-7 flex-1">
            <div className="flex items-start justify-between pb-5 border-b border-slate-100">
              <div className="space-y-1.5">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">AI Cold Call</h3>
                <p className="text-sm text-slate-500">
                  Configure your call settings and instructions below
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full p-1.5 transition-all"
              >
                <Icon icon="solar:close-circle-linear" className="w-5 h-5" />
              </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/30 border border-blue-100/60 shadow-sm">
              <div className="flex items-start gap-4 p-5">
                <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
                  <Icon icon="solar:magic-stick-linear" className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">Smart Call Assistant</h4>
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    Workspace data is intelligently referenced during calls. Full audio recording and transcript saved automatically upon completion.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-900">Product to Offer</label>

                {selectedProducts.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedProducts.map((productName) => (
                      <div
                        key={productName}
                        className="inline-flex items-center gap-2 pl-3.5 pr-2 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-sm"
                      >
                        <span>{productName}</span>
                        <button
                          onClick={() => removeProduct(productName)}
                          className="hover:bg-white/20 rounded-md p-0.5 transition-colors"
                        >
                          <Icon icon="solar:close-circle-linear" className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="relative" ref={productDropdownRef}>
                  <button
                    ref={productButtonRef}
                    onClick={() => setShowProductDropdown(!showProductDropdown)}
                    className="group flex hover:border-slate-300 hover:shadow-md transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-left bg-white w-full border-slate-200 border rounded-xl pt-3 pr-4 pb-3 pl-4 shadow-sm items-center justify-between"
                  >
                    <span className={`text-sm font-medium ${selectedProducts.length > 0 ? 'text-slate-900' : 'text-slate-500'}`}>
                      {selectedProducts.length > 0
                        ? `${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''} selected`
                        : 'Select one or multiple products..'}
                    </span>
                    <Icon icon="solar:alt-arrow-down-linear" className={`w-4 h-4 text-slate-400 transition-all duration-200 ${showProductDropdown ? 'rotate-180 text-slate-700' : 'group-hover:text-slate-600'}`} />
                  </button>

                  {showProductDropdown && (
                    <div className={`absolute left-0 z-50 w-full rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl shadow-slate-900/10 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200 ${
                      productDropdownDirection === 'up'
                        ? 'bottom-full mb-2 origin-bottom'
                        : 'top-full mt-2 origin-top'
                    }`}>
                      <div className="flex flex-col gap-0.5 max-h-72 overflow-y-auto custom-scrollbar">
                        <button
                          onClick={toggleAllProducts}
                          className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-left transition-all hover:bg-slate-50 group/item border-b border-slate-100 mb-1 pb-2.5"
                        >
                          <div className={`flex items-center justify-center w-4 h-4 rounded border-2 transition-all shrink-0 ${
                            isAllProductsSelected
                              ? 'bg-slate-900 border-slate-900'
                              : 'border-slate-300 group-hover/item:border-slate-400'
                          }`}>
                            {isAllProductsSelected && (
                              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M20 6 9 17l-5-5"></path>
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-slate-900">
                              All Products
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              Select all available products
                            </div>
                          </div>
                        </button>

                        {products.map((product) => {
                          const isSelected = selectedProducts.includes(product.name);
                          return (
                            <button
                              key={product.name}
                              onClick={() => toggleProduct(product.name)}
                              className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-left transition-all hover:bg-slate-50 group/item"
                            >
                              <div className={`flex items-center justify-center w-4 h-4 rounded border-2 transition-all shrink-0 ${
                                isSelected
                                  ? 'bg-slate-900 border-slate-900'
                                  : 'border-slate-300 group-hover/item:border-slate-400'
                              }`}>
                                {isSelected && (
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <path d="M20 6 9 17l-5-5"></path>
                                  </svg>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm text-slate-900">
                                  {product.name}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">
                                  {product.description}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-900">
                  Additional Instructions
                  <span className="text-slate-400 font-normal text-xs ml-2">
                    (Optional)
                  </span>
                </label>
                <div className="relative group">
                  <textarea
                    rows={4}
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                    className="placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 resize-none transition-all text-sm text-slate-900 bg-white w-full border-slate-200 border rounded-xl pt-3.5 pr-10 pb-3.5 pl-3.5 shadow-sm hover:border-slate-300 hover:shadow-md leading-relaxed"
                    placeholder="e.g. Introduce our company, understand their current needs, and schedule a follow-up meeting if there's interest..."
                  />
                  <div className="absolute bottom-3.5 right-3.5 text-slate-300 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                    <Icon icon="solar:pen-linear" className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 bg-slate-50/80 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon icon="solar:wallet-linear" className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-600">1 credit per minute</span>
                {otherActiveCalls.length > 0 && (
                  <span className="text-xs font-semibold text-blue-600">
                    × {otherActiveCalls.length + 1} calls
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Available:</span>
                <span className="text-sm font-bold text-slate-900">{mockCreditsRemaining.toLocaleString()}</span>
                <span className="text-xs text-slate-500">credits</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-white hover:text-slate-900 transition-all border border-transparent hover:border-slate-200 hover:shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleStartCall}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/30 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
              >
                <Icon icon="solar:phone-calling-linear" className="w-4 h-4" />
                Start Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    )}

    {completedCallData && (
      <PostCallModal
        isOpen={showPostCallModal}
        contact={completedCallData.contact}
        duration={completedCallData.duration}
        onViewTranscript={handleViewTranscript}
        onClose={handleClosePostCallModal}
        onNavigateToHistory={onNavigateToHistory}
      />
    )}
    </>
  );
}
