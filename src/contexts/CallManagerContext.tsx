import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

export type CallType = 'coldCall' | 'paymentReminder' | 'quoteFollowUp';

export interface Contact {
  id: string;
  name: string;
  title?: string;
  company_name?: string;
}

export interface Invoice {
  id: string;
  number: string;
  title: string;
  client: {
    name: string;
    initials: string;
    color: string;
  };
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  amount: number;
  issueDate: string;
  dueDate: string;
  items: number;
}

export interface Quotation {
  id: string;
  number: string;
  title: string;
  client: {
    name: string;
    initials: string;
    color: string;
  };
  status: 'draft' | 'published' | 'sent';
  amount: number;
  date: string;
  validUntil: string;
  items: number;
}

export interface ActiveCall {
  id: string;
  contact: Contact;
  selectedVoice: string;
  selectedProducts: string[];
  additionalInstructions: string;
  isMinimized: boolean;
  duration: number;
  startTime: number;
  color: string;
  callType: CallType;
  invoiceData?: Invoice;
  quotationData?: Quotation;
}

interface CallManagerContextType {
  activeCalls: ActiveCall[];
  focusedCallId: string | null;
  startCall: (contact: Contact, voice: string, products: string[], instructions: string, callType?: CallType, invoiceData?: Invoice, quotationData?: Quotation) => void | { error: string };
  endCall: (callId: string) => void;
  minimizeCall: (callId: string) => void;
  restoreCall: (callId: string) => void;
  updateCallDuration: (callId: string, duration: number) => void;
  getFocusedCall: () => ActiveCall | null;
  hasActiveCall: boolean;
}

const CallManagerContext = createContext<CallManagerContextType | undefined>(undefined);

const CALL_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
const MAX_CALLS = 5;

interface CallManagerProviderProps {
  children: ReactNode;
  onError?: (message: string) => void;
}

export function CallManagerProvider({ children, onError }: CallManagerProviderProps) {
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([]);
  const [focusedCallId, setFocusedCallId] = useState<string | null>(null);
  const timerIntervals = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    activeCalls.forEach((call) => {
      if (!timerIntervals.current.has(call.id)) {
        const interval = setInterval(() => {
          setActiveCalls((prev) =>
            prev.map((c) =>
              c.id === call.id
                ? { ...c, duration: Math.floor((Date.now() - c.startTime) / 1000) }
                : c
            )
          );
        }, 1000);
        timerIntervals.current.set(call.id, interval);
      }
    });

    const currentTimerIds = new Set(activeCalls.map((c) => c.id));
    timerIntervals.current.forEach((interval, callId) => {
      if (!currentTimerIds.has(callId)) {
        clearInterval(interval);
        timerIntervals.current.delete(callId);
      }
    });

    return () => {
      timerIntervals.current.forEach((interval) => clearInterval(interval));
      timerIntervals.current.clear();
    };
  }, [activeCalls]);

  const startCall = (
    contact: Contact,
    voice: string,
    products: string[],
    instructions: string,
    callType: CallType = 'coldCall',
    invoiceData?: Invoice,
    quotationData?: Quotation
  ) => {
    if (activeCalls.length >= MAX_CALLS) {
      onError?.(`Maximum of ${MAX_CALLS} simultaneous calls reached. Please end a call before starting a new one.`);
      return;
    }

    const existingCall = activeCalls.find((call) => call.contact.id === contact.id);
    if (existingCall) {
      onError?.(`You already have an active call with ${contact.name}. Please end or complete that call first.`);
      return;
    }

    const newCallId = `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const colorIndex = activeCalls.length % CALL_COLORS.length;

    if (focusedCallId) {
      setActiveCalls((prev) =>
        prev.map((call) =>
          call.id === focusedCallId ? { ...call, isMinimized: true } : call
        )
      );
    }

    const newCall: ActiveCall = {
      id: newCallId,
      contact,
      selectedVoice: voice,
      selectedProducts: products,
      additionalInstructions: instructions,
      isMinimized: false,
      duration: 0,
      startTime: Date.now(),
      color: CALL_COLORS[colorIndex],
      callType,
      invoiceData,
      quotationData,
    };

    setActiveCalls((prev) => [...prev, newCall]);
    setFocusedCallId(newCallId);
  };

  const endCall = (callId: string) => {
    const interval = timerIntervals.current.get(callId);
    if (interval) {
      clearInterval(interval);
      timerIntervals.current.delete(callId);
    }

    setActiveCalls((prev) => prev.filter((call) => call.id !== callId));

    if (focusedCallId === callId) {
      setFocusedCallId(null);
    }
  };

  const minimizeCall = (callId: string) => {
    setActiveCalls((prev) =>
      prev.map((call) => (call.id === callId ? { ...call, isMinimized: true } : call))
    );
    setFocusedCallId(null);
  };

  const restoreCall = (callId: string) => {
    if (focusedCallId && focusedCallId !== callId) {
      setActiveCalls((prev) =>
        prev.map((call) =>
          call.id === focusedCallId ? { ...call, isMinimized: true } : call
        )
      );
    }

    setActiveCalls((prev) =>
      prev.map((call) => (call.id === callId ? { ...call, isMinimized: false } : call))
    );
    setFocusedCallId(callId);
  };

  const updateCallDuration = (callId: string, duration: number) => {
    setActiveCalls((prev) =>
      prev.map((call) => (call.id === callId ? { ...call, duration } : call))
    );
  };

  const getFocusedCall = () => {
    if (!focusedCallId) return null;
    return activeCalls.find((call) => call.id === focusedCallId) || null;
  };

  const hasActiveCall = activeCalls.length > 0;

  return (
    <CallManagerContext.Provider
      value={{
        activeCalls,
        focusedCallId,
        startCall,
        endCall,
        minimizeCall,
        restoreCall,
        updateCallDuration,
        getFocusedCall,
        hasActiveCall,
      }}
    >
      {children}
    </CallManagerContext.Provider>
  );
}

export function useCallManager() {
  const context = useContext(CallManagerContext);
  if (context === undefined) {
    throw new Error('useCallManager must be used within a CallManagerProvider');
  }
  return context;
}
