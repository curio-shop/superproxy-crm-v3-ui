import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Tier = 'free' | 'growth' | 'pro' | 'scale';

export type Feature =
  | 'analytics'
  | 'leaderboard'
  | 'teamActivity'
  | 'multiCurrency'
  | 'currencyConverter'
  | 'videoWalkthroughs'
  | 'aiCredits'
  | 'voiceSelection'
  | 'noWatermark'
  | 'quoteComments'
  | 'callRecording'
  | 'multiLanguageCalls'
  | 'advancedInsights'
  | 'approvalWorkflows'
  | 'multiTeam'
  | 'advancedRBAC'
  | 'priorityAI';

const TIER_ORDER: Record<Tier, number> = {
  free: 0,
  growth: 1,
  pro: 2,
  scale: 3,
};

const FEATURE_MIN_TIER: Record<Feature, Tier> = {
  teamActivity: 'growth',
  multiCurrency: 'growth',
  videoWalkthroughs: 'growth',
  aiCredits: 'growth',
  voiceSelection: 'growth',
  noWatermark: 'growth',
  quoteComments: 'growth',
  analytics: 'growth',
  leaderboard: 'pro',
  callRecording: 'pro',
  multiLanguageCalls: 'pro',
  advancedInsights: 'pro',
  currencyConverter: 'scale',
  approvalWorkflows: 'scale',
  multiTeam: 'scale',
  advancedRBAC: 'scale',
  priorityAI: 'scale',
};

const TIER_NAMES: Record<Tier, string> = {
  free: 'Free',
  growth: 'Growth',
  pro: 'Pro',
  scale: 'Scale',
};

export function hasFeature(currentTier: Tier, feature: Feature): boolean {
  return TIER_ORDER[currentTier] >= TIER_ORDER[FEATURE_MIN_TIER[feature]];
}

export function getRequiredTier(feature: Feature): Tier {
  return FEATURE_MIN_TIER[feature];
}

export function getUpgradeTierName(feature: Feature): string {
  return TIER_NAMES[FEATURE_MIN_TIER[feature]];
}

interface TierContextType {
  tier: Tier;
  setTier: (tier: Tier) => void;
  can: (feature: Feature) => boolean;
  upgradeLabel: (feature: Feature) => string;
  onUpgrade: (originPage: string) => void;
}

const TierContext = createContext<TierContextType | null>(null);

interface TierProviderProps {
  children: ReactNode;
  defaultTier?: Tier;
  onUpgrade?: (originPage: string) => void;
}

export function TierProvider({ children, defaultTier = 'growth', onUpgrade: onUpgradeProp }: TierProviderProps) {
  const [tier, setTier] = useState<Tier>(defaultTier);

  const can = useCallback((feature: Feature) => hasFeature(tier, feature), [tier]);

  const upgradeLabel = useCallback(
    (feature: Feature) => `Upgrade to ${getUpgradeTierName(feature)}`,
    []
  );

  const onUpgrade = useCallback(
    (originPage: string) => onUpgradeProp?.(originPage),
    [onUpgradeProp]
  );

  return (
    <TierContext.Provider value={{ tier, setTier, can, upgradeLabel, onUpgrade }}>
      {children}
    </TierContext.Provider>
  );
}

export function useTier(): TierContextType {
  const context = useContext(TierContext);
  if (!context) {
    throw new Error('useTier must be used within a TierProvider');
  }
  return context;
}
