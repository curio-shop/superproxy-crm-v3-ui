import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PricingCard from './PricingCard';
import Dropdown from './Dropdown';

interface AccountProfileProps {
  activeTab: 'profile' | 'preferences' | 'security' | 'billing' | 'workspaces' | 'voice' | 'connectors' | 'contact';
  onTabChange: (tab: 'profile' | 'preferences' | 'security' | 'billing' | 'workspaces' | 'voice' | 'connectors' | 'contact') => void;
  onChatOpen: () => void;
  chatUnreadCount: number;
  onDeleteAccountClick: () => void;
  connectedTools?: Record<string, boolean>;
  onConnectedToolsChange?: (tools: Record<string, boolean>) => void;
  onViewPlans?: () => void;
}

export default function AccountProfile({
  activeTab,
  onTabChange,
  onChatOpen,
  chatUnreadCount,
  onDeleteAccountClick,
  connectedTools = {},
  onConnectedToolsChange,
  onViewPlans
}: AccountProfileProps) {
  const [showDangerZone, setShowDangerZone] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [memoryData, setMemoryData] = useState({ aboutMe: '', communicationStyle: '', customInstructions: '' });
  const [memorySaved, setMemorySaved] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: 'Melwyn',
    lastName: 'Arrubio',
    email: 'arrubiomelwyn@gmail.com',
    phone: '+63 906 463 6955',
    location: 'Bangkok, Thailand',
    timezone: 'Asia/Bangkok',
    bio: 'Product designer and developer focused on creating beautiful, user-friendly experiences.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
  });

  const [sessions] = useState([
    { id: '1', device: 'Chrome on MacOS', location: 'Bangkok, Thailand', lastActive: '2 mins ago', current: true },
    { id: '2', device: 'Safari on iPhone', location: 'Bangkok, Thailand', lastActive: '1 hour ago', current: false },
    { id: '3', device: 'Firefox on Windows', location: 'Chiang Mai, Thailand', lastActive: '2 days ago', current: false },
  ]);

  const [companies] = useState([
    { id: '1', name: 'Fiamma', role: 'Owner', joined: '2024-01-15', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=80&q=80' },
    { id: '2', name: 'Acme Corporation', role: 'Admin', joined: '2024-03-20', logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=80&q=80' },
    { id: '3', name: 'TechStart Inc', role: 'Member', joined: '2024-06-10', logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=80&q=80' },
  ]);

  const [activityData] = useState({
    lastLogin: '2 hours ago',
    accountCreated: 'Jan 15, 2024',
    totalQuotations: 24,
    totalInvoices: 18,
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  const [contactForm, setContactForm] = useState({
    subject: 'General Inquiry',
    message: '',
    priority: 'normal' as 'normal' | 'urgent',
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  const [selectedVoice, setSelectedVoice] = useState('lauren-confident');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isVoiceLocked = true;
  const creditPacks = [
    {
      id: 'starter',
      credits: 40,
      price: 20,
      tagline: 'Great for getting started',
      isPopular: false,
    },
    {
      id: 'popular',
      credits: 100,
      price: 50,
      tagline: 'Most popular for growing teams',
      isPopular: true,
    },
    {
      id: 'pro',
      credits: 180,
      price: 90,
      tagline: 'Best for high-volume calling',
      isPopular: false,
    },
  ];

  // Comprehensive voice library (30 voices across 15 languages)
  const voiceLibrary = [
    // ENGLISH (GLOBAL) - 5 voices
    { id: 'lauren-confident', name: 'Lauren', role: 'Confident', language: 'English (US)', gender: 'Female', age: '30s', traits: ['Friendly', 'Professional', 'Clear'], languageCode: 'english' },
    { id: 'marcus-vibrant', name: 'Marcus', role: 'Vibrant', language: 'English (US)', gender: 'Male', age: '30s', traits: ['Stylish', 'Urban'], languageCode: 'english' },
    { id: 'emma-balanced', name: 'Emma', role: 'Balanced', language: 'English (US)', gender: 'Female', age: '30s', traits: ['Professional', 'Approachable'], languageCode: 'english' },
    { id: 'david-polite', name: 'David', role: 'Polite', language: 'English (UK)', gender: 'Male', age: '30s', traits: ['Calm', 'Respectful'], languageCode: 'english' },
    { id: 'rachel-gentle', name: 'Rachel', role: 'Gentle', language: 'English (UK)', gender: 'Female', age: '20s', traits: ['Understanding', 'Warm'], languageCode: 'english' },
    
    // SPANISH (LATIN AMERICA) - 3 voices
    { id: 'carlos-dynamic', name: 'Carlos', role: 'Dynamic', language: 'Spanish (LatAm)', gender: 'Male', age: '32s', traits: ['Energetic', 'Engaging'], languageCode: 'spanish' },
    { id: 'maria-professional', name: 'María', role: 'Professional', language: 'Spanish (LatAm)', gender: 'Female', age: '35s', traits: ['Polished', 'Credible'], languageCode: 'spanish' },
    { id: 'diego-executive', name: 'Diego', role: 'Executive', language: 'Spanish (LatAm)', gender: 'Male', age: '42s', traits: ['Commanding', 'Warm'], languageCode: 'spanish' },
    
    // PORTUGUESE (BRAZILIAN) - 2 voices
    { id: 'lucas-friendly', name: 'Lucas', role: 'Friendly', language: 'Portuguese (BR)', gender: 'Male', age: '30s', traits: ['Approachable', 'Clear'], languageCode: 'portuguese' },
    { id: 'ana-professional', name: 'Ana', role: 'Professional', language: 'Portuguese (BR)', gender: 'Female', age: '35s', traits: ['Confident', 'Articulate'], languageCode: 'portuguese' },
    
    // ARABIC - 2 voices
    { id: 'ahmed-executive', name: 'Ahmed', role: 'Executive', language: 'Arabic', gender: 'Male', age: '40s', traits: ['Authoritative', 'Respectful'], languageCode: 'arabic' },
    { id: 'layla-professional', name: 'Layla', role: 'Professional', language: 'Arabic', gender: 'Female', age: '32s', traits: ['Polished', 'Clear'], languageCode: 'arabic' },
    
    // FRENCH - 2 voices
    { id: 'pierre-refined', name: 'Pierre', role: 'Refined', language: 'French', gender: 'Male', age: '38s', traits: ['Sophisticated', 'Clear'], languageCode: 'french' },
    { id: 'camille-professional', name: 'Camille', role: 'Professional', language: 'French', gender: 'Female', age: '35s', traits: ['Elegant', 'Confident'], languageCode: 'french' },
    
    // INDONESIAN - 2 voices
    { id: 'budi-friendly', name: 'Budi', role: 'Friendly', language: 'Indonesian', gender: 'Male', age: '32s', traits: ['Warm', 'Professional'], languageCode: 'indonesian' },
    { id: 'sari-clear', name: 'Sari', role: 'Clear', language: 'Indonesian', gender: 'Female', age: '30s', traits: ['Articulate', 'Approachable'], languageCode: 'indonesian' },
    
    // HINDI - 2 voices
    { id: 'raj-executive', name: 'Raj', role: 'Executive', language: 'Hindi', gender: 'Male', age: '38s', traits: ['Commanding', 'Clear'], languageCode: 'hindi' },
    { id: 'priya-professional', name: 'Priya', role: 'Professional', language: 'Hindi', gender: 'Female', age: '32s', traits: ['Confident', 'Warm'], languageCode: 'hindi' },
    
    // VIETNAMESE - 2 voices
    { id: 'minh-direct', name: 'Minh', role: 'Direct', language: 'Vietnamese', gender: 'Male', age: '35s', traits: ['Clear', 'Professional'], languageCode: 'vietnamese' },
    { id: 'linh-friendly', name: 'Linh', role: 'Friendly', language: 'Vietnamese', gender: 'Female', age: '30s', traits: ['Warm', 'Articulate'], languageCode: 'vietnamese' },
    
    // GERMAN - 1 voice
    { id: 'klaus-executive', name: 'Klaus', role: 'Executive', language: 'German', gender: 'Male', age: '42s', traits: ['Authoritative', 'Clear'], languageCode: 'german' },
    
    // THAI - 2 voices
    { id: 'somchai-friendly', name: 'Somchai', role: 'Friendly', language: 'Thai', gender: 'Male', age: '32s', traits: ['Warm', 'Clear'], languageCode: 'thai' },
    { id: 'noi-professional', name: 'Noi', role: 'Professional', language: 'Thai', gender: 'Female', age: '30s', traits: ['Polished', 'Approachable'], languageCode: 'thai' },
    
    // TURKISH - 2 voices
    { id: 'mehmet-executive', name: 'Mehmet', role: 'Executive', language: 'Turkish', gender: 'Male', age: '40s', traits: ['Commanding', 'Clear'], languageCode: 'turkish' },
    { id: 'ayse-professional', name: 'Ayşe', role: 'Professional', language: 'Turkish', gender: 'Female', age: '35s', traits: ['Confident', 'Articulate'], languageCode: 'turkish' },
    
    // POLISH - 1 voice
    { id: 'piotr-direct', name: 'Piotr', role: 'Direct', language: 'Polish', gender: 'Male', age: '38s', traits: ['Clear', 'Professional'], languageCode: 'polish' },
    
    // FILIPINO - 2 voices
    { id: 'angelo-friendly', name: 'Angelo', role: 'Friendly', language: 'Filipino', gender: 'Male', age: '30s', traits: ['Warm', 'Clear'], languageCode: 'filipino' },
    { id: 'maria-professional-filipino', name: 'Maria', role: 'Professional', language: 'Filipino', gender: 'Female', age: '32s', traits: ['Confident', 'Articulate'], languageCode: 'filipino' },
    
    // MALAY - 1 voice
    { id: 'amir-professional', name: 'Amir', role: 'Professional', language: 'Malay', gender: 'Male', age: '35s', traits: ['Polished', 'Clear'], languageCode: 'malay' },
    
    // ITALIAN - 1 voice
    { id: 'alessandro-executive', name: 'Alessandro', role: 'Executive', language: 'Italian', gender: 'Male', age: '40s', traits: ['Sophisticated', 'Confident'], languageCode: 'italian' },
  ];

  // Get unique languages for filter
  const languages = [
    { value: 'all', label: `All Languages (${voiceLibrary.length})` },
    { value: 'english', label: `English (${voiceLibrary.filter(v => v.languageCode === 'english').length})` },
    { value: 'spanish', label: `Spanish (${voiceLibrary.filter(v => v.languageCode === 'spanish').length})` },
    { value: 'portuguese', label: `Portuguese (${voiceLibrary.filter(v => v.languageCode === 'portuguese').length})` },
    { value: 'arabic', label: `Arabic (${voiceLibrary.filter(v => v.languageCode === 'arabic').length})` },
    { value: 'french', label: `French (${voiceLibrary.filter(v => v.languageCode === 'french').length})` },
    { value: 'indonesian', label: `Indonesian (${voiceLibrary.filter(v => v.languageCode === 'indonesian').length})` },
    { value: 'hindi', label: `Hindi (${voiceLibrary.filter(v => v.languageCode === 'hindi').length})` },
    { value: 'vietnamese', label: `Vietnamese (${voiceLibrary.filter(v => v.languageCode === 'vietnamese').length})` },
    { value: 'german', label: `German (${voiceLibrary.filter(v => v.languageCode === 'german').length})` },
    { value: 'thai', label: `Thai (${voiceLibrary.filter(v => v.languageCode === 'thai').length})` },
    { value: 'turkish', label: `Turkish (${voiceLibrary.filter(v => v.languageCode === 'turkish').length})` },
    { value: 'polish', label: `Polish (${voiceLibrary.filter(v => v.languageCode === 'polish').length})` },
    { value: 'filipino', label: `Filipino (${voiceLibrary.filter(v => v.languageCode === 'filipino').length})` },
    { value: 'malay', label: `Malay (${voiceLibrary.filter(v => v.languageCode === 'malay').length})` },
    { value: 'italian', label: `Italian (${voiceLibrary.filter(v => v.languageCode === 'italian').length})` },
  ];

  // Filter voices based on selected language
  const filteredVoices = languageFilter === 'all' 
    ? voiceLibrary 
    : voiceLibrary.filter(voice => voice.languageCode === languageFilter);

  const handleVoicePreview = (voiceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isVoiceLocked) return;
    
    // If already playing this voice, stop it
    if (playingVoiceId === voiceId) {
      if (audioRef.current) {
        clearTimeout(audioRef.current as unknown as number);
      }
      setPlayingVoiceId(null);
      return;
    }
    
    // Stop current playback if any
    if (audioRef.current) {
      clearTimeout(audioRef.current as unknown as number);
    }
    
    // Auto-select this voice when previewing for intuitive UX
    setSelectedVoice(voiceId);
    
    // Simulate playback - set playing state
    setPlayingVoiceId(voiceId);
    
    // Auto-stop after 4 seconds (simulated playback duration)
    const timeoutId = setTimeout(() => {
      setPlayingVoiceId(null);
    }, 4000);
    
    // Store timeout reference for cleanup
    audioRef.current = timeoutId as unknown as HTMLAudioElement;
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Avatar file size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      setUploadingAvatar(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setProfileData({ ...profileData, avatar: reader.result as string });
        setUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    alert('Profile updated successfully!');
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactForm.message.trim()) {
      alert('Please enter a message');
      return;
    }

    if (contactForm.message.length > 500) {
      alert('Message must be 500 characters or less');
      return;
    }

    setIsSubmittingContact(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('You must be logged in to submit a contact form');
        setIsSubmittingContact(false);
        return;
      }

      const { data, error } = await supabase
        .from('contact_submissions')
        .insert({
          user_id: user.id,
          user_email: profileData.email,
          user_name: `${profileData.firstName} ${profileData.lastName}`,
          subject: contactForm.subject,
          message: contactForm.message,
          priority: contactForm.priority,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      const newTicketNumber = `CS-${data.id.slice(0, 8).toUpperCase()}`;
      setTicketNumber(newTicketNumber);
      setShowSuccessModal(true);
      setContactForm({
        subject: 'General Inquiry',
        message: '',
        priority: 'normal',
      });
    } catch (error) {
      alert('Failed to submit contact form. Please try again.');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  useEffect(() => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Stop simulated playback when changing tabs
    if (activeTab !== 'voice' && audioRef.current) {
      clearTimeout(audioRef.current as unknown as number);
      setPlayingVoiceId(null);
    }
  }, [activeTab]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'solar:user-linear' },
    { id: 'preferences', label: 'Preferences', icon: 'solar:settings-minimalistic-linear' },
    { id: 'security', label: 'Security', icon: 'solar:shield-keyhole-linear' },
    { id: 'billing', label: 'Subscription', icon: 'solar:card-linear' },
    { id: 'workspaces', label: 'Workspaces', icon: 'solar:buildings-2-linear' },
    { id: 'voice', label: 'AI Voice', icon: 'solar:microphone-3-linear' },
    { id: 'connectors', label: 'Connectors', icon: 'solar:plug-circle-linear' },
    { id: 'contact', label: 'Contact Us', icon: 'solar:chat-round-call-linear' },
  ] as const;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 px-8 pt-4 pb-3 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="relative group flex-shrink-0">
                <div className="h-14 w-14 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] ring-1 ring-slate-200">
                  {avatarPreview || profileData.avatar ? (
                    <img
                      src={avatarPreview || profileData.avatar}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Icon icon="solar:user-linear" width="24" className="text-slate-400" />
                    </div>
                  )}
                </div>
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900"></div>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-md ring-2 ring-blue-50">
                  <Icon icon="solar:check-circle-bold" width="14" className="text-blue-600" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight truncate">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                </div>
                <p className="text-[13px] text-slate-500 mb-1.5 truncate">{profileData.email}</p>
                <div className="flex items-center gap-3 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Icon icon="solar:map-point-linear" width="13" />
                    {profileData.location}
                  </div>
                  <div className="h-3 w-px bg-slate-200"></div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Icon icon="solar:calendar-linear" width="13" />
                    Member since {activityData.accountCreated}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <div className="text-center px-4">
                <div className="text-lg font-bold text-slate-900">{activityData.totalQuotations}</div>
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Quotations</div>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="text-center px-4">
                <div className="text-lg font-bold text-slate-900">{activityData.totalInvoices}</div>
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Invoices</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-8 py-6">
        <div className="max-w-7xl mx-auto h-full flex gap-8">
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white border border-slate-200 rounded-2xl shadow-sm p-2 sticky top-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                  }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all active:scale-[0.98] ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <Icon icon={tab.icon} width="18" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div ref={contentScrollRef} className="flex-1 min-w-0 overflow-y-auto custom-scrollbar pr-2">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <h2 className="text-[13px] font-semibold text-slate-800 tracking-tight">Profile</h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">Your details, preferences, and how the AI works for you.</p>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" id="avatar-upload" />
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                        {avatarPreview || profileData.avatar ? (
                          <img src={avatarPreview || profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon icon="solar:user-linear" width="20" className="text-slate-400" />
                          </div>
                        )}
                        {uploadingAvatar && (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <label
                          htmlFor="avatar-upload"
                          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-[13px] font-medium hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer active:scale-[0.98]"
                        >
                          <Icon icon="solar:camera-linear" width="15" />
                          Change photo
                        </label>
                        {(avatarPreview || profileData.avatar) && (
                          <button
                            onClick={() => { setAvatarPreview(null); setProfileData({ ...profileData, avatar: '' }); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                            className="text-[13px] text-slate-400 hover:text-red-500 font-medium transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Personal fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">First Name</label>
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 text-[13px] text-slate-800 transition-colors"
                          placeholder="First name"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Last Name</label>
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 text-[13px] text-slate-800 transition-colors"
                          placeholder="Last name"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                        <div className="relative">
                          <input
                            type="email"
                            value={profileData.email}
                            readOnly
                            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50/80 text-[13px] text-slate-500 pr-10 cursor-not-allowed"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Icon icon="solar:check-circle-bold" width="16" className="text-emerald-400" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Phone</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 text-[13px] text-slate-800 transition-colors"
                          placeholder="+66 98 765 4321"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 text-[13px] text-slate-800 transition-colors"
                          placeholder="City, Country"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Timezone</label>
                        <Dropdown
                          value={profileData.timezone}
                          options={[
                            { value: 'Asia/Bangkok', label: 'Bangkok (GMT+7)' },
                            { value: 'America/New_York', label: 'New York (GMT-5)' },
                            { value: 'Europe/London', label: 'London (GMT+0)' },
                            { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)' },
                            { value: 'Australia/Sydney', label: 'Sydney (GMT+11)' },
                            { value: 'Europe/Paris', label: 'Paris (GMT+1)' },
                          ]}
                          onChange={(val) => setProfileData({ ...profileData, timezone: val as string })}
                          icon="solar:global-linear"
                          searchable
                          className="w-full"
                          buttonClassName="w-full"
                          menuClassName="w-full"
                          menuAlign="left"
                        />
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-100" />

                    {/* Personalization */}
                    <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon icon="solar:user-circle-linear" width="14" className="text-slate-400" />
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">About Me</label>
                      </div>
                      <textarea
                        value={memoryData.aboutMe}
                        onChange={(e) => setMemoryData(prev => ({ ...prev, aboutMe: e.target.value }))}
                        placeholder="Your role, company, industry, and what you do day-to-day..."
                        className="w-full min-h-[88px] px-3.5 py-2.5 border border-slate-200 rounded-xl text-[13px] text-slate-800 placeholder-slate-300 outline-none focus:border-slate-400 transition-colors resize-none leading-relaxed bg-white/80"
                        maxLength={2000}
                      />
                      <div className="flex justify-end mt-1">
                        <span className="text-[10px] text-slate-300">{memoryData.aboutMe.length}/2000</span>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon icon="solar:chat-line-linear" width="14" className="text-slate-400" />
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Communication Style</label>
                      </div>
                      <textarea
                        value={memoryData.communicationStyle}
                        onChange={(e) => setMemoryData(prev => ({ ...prev, communicationStyle: e.target.value }))}
                        placeholder="How should Superproxy communicate with you and your clients..."
                        className="w-full min-h-[88px] px-3.5 py-2.5 border border-slate-200 rounded-xl text-[13px] text-slate-800 placeholder-slate-300 outline-none focus:border-slate-400 transition-colors resize-none leading-relaxed bg-white/80"
                        maxLength={2000}
                      />
                      <div className="flex justify-end mt-1">
                        <span className="text-[10px] text-slate-300">{memoryData.communicationStyle.length}/2000</span>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon icon="solar:clipboard-list-linear" width="14" className="text-slate-400" />
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Custom Instructions</label>
                      </div>
                      <textarea
                        value={memoryData.customInstructions}
                        onChange={(e) => setMemoryData(prev => ({ ...prev, customInstructions: e.target.value }))}
                        placeholder="Specific rules Superproxy should always follow..."
                        className="w-full min-h-[88px] px-3.5 py-2.5 border border-slate-200 rounded-xl text-[13px] text-slate-800 placeholder-slate-300 outline-none focus:border-slate-400 transition-colors resize-none leading-relaxed bg-white/80"
                        maxLength={2000}
                      />
                      <div className="flex justify-end mt-1">
                        <span className="text-[10px] text-slate-300">{memoryData.customInstructions.length}/2000</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {memorySaved && (
                        <span className="text-[13px] font-medium text-emerald-500 flex items-center gap-1.5 animate-in fade-in duration-300">
                          <Icon icon="solar:check-circle-bold" width="14" />
                          Saved
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => { handleSaveProfile(); setMemorySaved(true); setTimeout(() => setMemorySaved(false), 3000); }}
                      className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[13px] font-semibold hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98]"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <h2 className="text-[13px] font-semibold text-slate-800 tracking-tight">Appearance</h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">Customize how the app looks and feels</p>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                          <Icon icon={isDarkMode ? "solar:moon-bold" : "solar:sun-bold"} width="24" className="text-slate-700" />
                        </div>
                        <div>
                          <h3 className="text-[13px] font-semibold text-slate-800">Dark Mode</h3>
                          <p className="text-[11px] text-slate-400">Toggle between light and dark theme</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                          isDarkMode ? 'bg-slate-900' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                            isDarkMode ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <h2 className="text-[13px] font-semibold text-slate-800 tracking-tight">Notifications</h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">Manage how you receive updates</p>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Icon icon="solar:letter-linear" width="20" className="text-slate-400" />
                        <div>
                          <h3 className="text-[13px] font-semibold text-slate-800">Email Notifications</h3>
                          <p className="text-[11px] text-slate-400">Receive email updates about your activity</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPreferences({ ...preferences, emailNotifications: !preferences.emailNotifications })}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                          preferences.emailNotifications ? 'bg-slate-900' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                            preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Icon icon="solar:bell-linear" width="20" className="text-slate-400" />
                        <div>
                          <h3 className="text-[13px] font-semibold text-slate-800">Push Notifications</h3>
                          <p className="text-[11px] text-slate-400">Receive push notifications in your browser</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPreferences({ ...preferences, pushNotifications: !preferences.pushNotifications })}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                          preferences.pushNotifications ? 'bg-slate-900' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                            preferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Icon icon="solar:mailbox-linear" width="20" className="text-slate-400" />
                        <div>
                          <h3 className="text-[13px] font-semibold text-slate-800">Marketing Emails</h3>
                          <p className="text-[11px] text-slate-400">Receive news and product updates</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPreferences({ ...preferences, marketingEmails: !preferences.marketingEmails })}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                          preferences.marketingEmails ? 'bg-slate-900' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                            preferences.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <h2 className="text-[13px] font-semibold text-slate-800 tracking-tight">Security Settings</h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">Manage your account security and authentication</p>
                  </div>

                  <div className="p-6 space-y-3">
                    <button className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group border border-slate-200">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                          <Icon icon="solar:lock-password-linear" width="22" className="text-blue-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-[13px] font-semibold text-slate-800 mb-0.5">Change Password</h3>
                          <p className="text-[11px] text-slate-400">Update your account password</p>
                        </div>
                      </div>
                      <Icon icon="solar:alt-arrow-right-linear" width="20" className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </button>

                    <button className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group border border-slate-200">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                          <Icon icon="solar:shield-check-linear" width="22" className="text-emerald-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-[13px] font-semibold text-slate-800 mb-0.5">Two-Factor Authentication</h3>
                          <p className="text-[11px] text-slate-400">Add an extra layer of security</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold">Disabled</span>
                        <Icon icon="solar:alt-arrow-right-linear" width="20" className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">Active Sessions</h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">Manage where you're logged in</p>
                      </div>
                      <button className="text-[13px] font-semibold text-rose-600 hover:text-rose-700 transition-colors">
                        Log out all sessions
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    {sessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                            <Icon icon="solar:monitor-smartphone-linear" width="20" className="text-slate-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-[13px] font-semibold text-slate-800">{session.device}</h3>
                              {session.current && (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">Current</span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">{session.location} • {session.lastActive}</p>
                          </div>
                        </div>
                        {!session.current && (
                          <button className="text-[13px] font-semibold text-slate-500 hover:text-rose-500 transition-colors">
                            Log out
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => alert('Logging out...')}
                      className="inline-flex items-center gap-2 px-10 py-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl transition-all text-white text-[13px] font-semibold shadow-sm"
                    >
                      <Icon icon="solar:logout-linear" width="18" />
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <PricingCard
                  onUpgradeClick={() => window.open('https://billing.stripe.com', '_blank')}
                  onViewPlans={onViewPlans}
                />

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                          <Icon icon="solar:wallet-linear" width="18" className="text-slate-600" />
                        </div>
                        <div>
                          <h2 className="text-[13px] font-semibold text-slate-800 tracking-tight">AI Credits</h2>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Credits power every AI feature, including AI calls and Ask AI.
                          </p>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-600">
                        <Icon icon="solar:timer-linear" width="14" className="text-slate-500" />
                        1 credit = 1 minute of calling
                      </div>
                    </div>


                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {creditPacks.map((pack) => (
                        <div
                          key={pack.id}
                          className={`relative rounded-2xl border p-5 transition-all ${
                            pack.isPopular
                              ? 'border-blue-500 bg-blue-50/60 shadow-md shadow-blue-500/10'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          {pack.isPopular && (
                            <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-blue-600 text-white">
                              <Icon icon="solar:star-linear" width="12" />
                              Most popular
                            </span>
                          )}

                          <div className="text-[13px] font-semibold text-slate-600">Credits</div>
                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900">{pack.credits}</span>
                            <span className="text-[11px] text-slate-400">credits</span>
                          </div>
                          <div className="mt-3 text-2xl font-bold text-slate-900">${pack.price}</div>
                          <p className="text-[11px] text-slate-400 mt-2">{pack.tagline}</p>

                          <button
                            className={`mt-5 w-full rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                              pack.isPopular
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            Buy credits
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <h2 className="text-[13px] font-semibold text-slate-800 tracking-tight">Billing History</h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">View and download your invoices</p>
                  </div>

                  <div className="p-6">
                    <div className="text-center py-12">
                      <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <Icon icon="solar:bill-list-linear" width="28" className="text-slate-400" />
                      </div>
                      <h3 className="text-[13px] font-semibold text-slate-800 mb-1">No billing history yet</h3>
                      <p className="text-[11px] text-slate-400">Your invoices and receipts will appear here</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <h2 className="text-[13px] font-semibold text-slate-800 tracking-tight">Payment Method</h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">Manage your payment information</p>
                  </div>

                  <div className="p-6">
                    <button className="w-full flex items-center justify-center gap-2 p-5 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-all">
                      <Icon icon="solar:card-linear" width="20" />
                      <span className="text-[13px] font-semibold">Add Payment Method</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'workspaces' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <h2 className="text-[13px] font-semibold text-slate-800 tracking-tight">Your Workspaces</h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">Organizations you've joined or created</p>
                  </div>

                  <div className="p-6 grid grid-cols-1 gap-4">
                    {companies.map((company) => (
                      <div key={company.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all border border-slate-200 group">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                            <img src={company.logo} alt={company.name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <h3 className="text-[13px] font-semibold text-slate-800">{company.name}</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Joined {new Date(company.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                            company.role === 'Owner'
                              ? 'bg-slate-900 text-white'
                              : company.role === 'Admin'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {company.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowDangerZone(!showDangerZone)}
                  className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <Icon icon="solar:danger-triangle-linear" width="20" className="text-slate-400" />
                    <span className="text-[13px] font-medium text-slate-800">Advanced Settings</span>
                  </div>
                  <Icon
                    icon="solar:alt-arrow-down-linear"
                    width="18"
                    className={`text-slate-400 transition-transform ${showDangerZone ? 'rotate-180' : ''}`}
                  />
                </button>

                {showDangerZone && (
                  <div className="bg-gradient-to-br from-rose-50 to-red-50/30 border-2 border-rose-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-rose-200">
                      <div className="flex items-center gap-3">
                        <Icon icon="solar:danger-triangle-bold" width="24" className="text-rose-600" />
                        <div>
                          <h2 className="text-lg font-bold text-rose-900">Danger Zone</h2>
                          <p className="text-[12px] text-rose-600 mt-0.5">Irreversible and destructive actions</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="bg-white border-2 border-rose-300 rounded-xl p-5">
                        <h3 className="text-[13px] font-semibold text-slate-800 mb-2">Delete Account</h3>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                          Once you delete your account, there is no going back. All your data, workspaces, and documents will be permanently erased. This action cannot be undone.
                        </p>
                        <button
                          onClick={onDeleteAccountClick}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[13px] font-semibold transition-all shadow-sm"
                        >
                          <Icon icon="solar:trash-bin-minimalistic-bold" width="16" />
                          Delete My Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'voice' && (
              <div className="space-y-6">
                {/* Voice Settings */}
                <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100/50 bg-white/40">
                    <h2 className="text-[13px] font-semibold text-slate-800 tracking-tight">How Superproxy Speaks for You</h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">Choose the voice that represents your business in every sales conversation. You can change this anytime.</p>
                  </div>

                  <div className="p-8 space-y-6">
                    {isVoiceLocked && (
                      <div className="flex items-start justify-between gap-4 p-4 border border-slate-200 rounded-2xl bg-slate-50/80">
                        <div className="flex items-start gap-3">
                          <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                            <Icon icon="solar:lock-keyhole-linear" width="18" className="text-slate-600" />
                          </div>
                          <div>
                            <div className="text-[13px] font-semibold text-slate-800">AI credits required</div>
                            <p className="text-xs text-slate-600 mt-0.5">
                              Purchase AI credits to unlock voice selection and previews.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => onTabChange('billing')}
                          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full bg-slate-900 text-white shadow-sm hover:bg-slate-800 transition-all flex-shrink-0"
                        >
                          <Icon icon="solar:wallet-linear" width="16" />
                          Buy AI Credits
                        </button>
                      </div>
                    )}

                    {/* Language Filter */}
                    <div className="max-w-xs">
                      <Dropdown
                        value={languageFilter}
                        options={languages.map(lang => ({ value: lang.value, label: lang.label }))}
                        onChange={(val) => setLanguageFilter(val as string)}
                        icon="solar:global-linear"
                        placeholder="Select language"
                        className="w-full"
                        buttonClassName="w-full"
                        menuClassName="w-full"
                        menuAlign="left"
                      />
                    </div>

                    {/* Voice List */}
                    <div className="space-y-2 max-w-3xl">
                      {filteredVoices.map((voice) => (
                        <div
                          key={voice.id}
                          onClick={isVoiceLocked ? undefined : () => setSelectedVoice(voice.id)}
                          className={`p-4 rounded-2xl border transition-all duration-200 ${
                            isVoiceLocked
                              ? selectedVoice === voice.id
                                ? 'border-slate-300 bg-slate-50 cursor-not-allowed opacity-75'
                                : 'border-slate-200 bg-white cursor-not-allowed opacity-70'
                              : selectedVoice === voice.id
                              ? 'border-purple-400 bg-purple-50/30 cursor-pointer'
                              : 'border-slate-200 bg-white hover:border-slate-300 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            {/* Left: Radio + Voice Info */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {/* Radio Button - Inverted */}
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                                  isVoiceLocked
                                    ? selectedVoice === voice.id
                                      ? 'border-slate-400 bg-white'
                                      : 'border-slate-300 bg-white'
                                    : selectedVoice === voice.id
                                    ? 'border-purple-400 bg-white'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {selectedVoice === voice.id && (
                                  <div className={`w-3 h-3 rounded-full ${isVoiceLocked ? 'bg-slate-400' : 'bg-purple-600'}`}></div>
                                )}
                              </div>
                              
                              {/* Voice Details */}
                              <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-semibold text-slate-800">
                                  {voice.name} - {voice.role}
                                </div>
                                <div className="text-xs text-slate-600 mt-0.5">
                                  {voice.language} • {voice.gender} • {voice.age}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-1">
                                  {voice.traits.join(', ')}
                                </div>
                              </div>
                            </div>
                            
                            {/* Right: Preview Button */}
                            <button
                              onClick={(e) => handleVoicePreview(voice.id, e)}
                              disabled={isVoiceLocked}
                              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full transition-all flex-shrink-0 ml-4 ${
                                isVoiceLocked
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                  : playingVoiceId === voice.id
                                  ? 'bg-purple-600 text-white shadow-sm hover:bg-purple-700'
                                  : selectedVoice === voice.id
                                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-700'
                              }`}
                            >
                              <Icon 
                                icon={isVoiceLocked ? "solar:lock-linear" : playingVoiceId === voice.id ? "solar:pause-circle-bold" : "solar:play-circle-linear"} 
                                width="16" 
                              />
                              {isVoiceLocked ? 'Locked' : playingVoiceId === voice.id ? 'Playing...' : 'Preview'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Info Note */}
                    <div className="flex items-start gap-3 p-4 bg-purple-50/50 border border-purple-100 rounded-xl max-w-3xl">
                      <Icon icon="solar:microphone-linear" width="20" className="text-purple-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isVoiceLocked
                          ? 'Buying credits unlocks voice previews and gives you access to AI calls and Ask AI.'
                          : 'Your selected voice will be used across all call types (cold calls, follow-ups, and payment reminders)'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'connectors' && (
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Connected Tools</h2>
                  <p className="text-[11px] text-slate-400 mt-1">Manage your integrations and connected services.</p>
                </div>

                {/* Active connectors */}
                <div className="space-y-2">
                  {[
                    { id: 'gcal',   icon: 'logos:google-calendar', label: 'Google Calendar', description: 'Sync meetings and schedule calls' },
                    { id: 'gdrive', icon: 'logos:google-drive',    label: 'Google Drive',    description: 'Access and share documents' },
                    { id: 'slack',  icon: 'logos:slack-icon',       label: 'Slack',           description: 'Send messages and get notifications' },
                    { id: 'gmail',  icon: 'logos:google-gmail',     label: 'Gmail',           description: 'Send and track emails' },
                    { id: 'sheets', icon: 'flat-color-icons:google', label: 'Google Sheets',  description: 'Sync data and generate reports' },
                  ].map((tool) => {
                    const isConnected = connectedTools[tool.id] || false;
                    return (
                      <div
                        key={tool.id}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                          <Icon icon={tool.icon} width="22" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-medium text-slate-800">{tool.label}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{tool.description}</div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {isConnected && (
                            <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Connected
                            </span>
                          )}
                          <button
                            onClick={() => {
                              onConnectedToolsChange?.({ ...connectedTools, [tool.id]: !isConnected });
                            }}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                              isConnected
                                ? 'border border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50'
                                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                            }`}
                          >
                            {isConnected ? 'Disconnect' : 'Connect'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Coming soon */}
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Coming Soon</span>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>
                  <div className="space-y-2">
                    {[
                      { icon: 'logos:zapier-icon', label: 'Zapier', description: 'Automate workflows across apps' },
                      { icon: 'logos:notion-icon', label: 'Notion', description: 'Sync notes and databases' },
                      { icon: 'logos:hubspot', label: 'HubSpot', description: 'Sync contacts and deals' },
                    ].map((tool) => (
                      <div
                        key={tool.label}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-slate-200 opacity-50"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                          <Icon icon={tool.icon} width="22" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-medium text-slate-800">{tool.label}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{tool.description}</div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Soon</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-50 border border-blue-100 mb-4">
                      <Icon icon="solar:chat-round-call-bold" width="32" className="text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">We're Here to Help</h2>
                    <p className="text-slate-600 max-w-xl mx-auto leading-relaxed">
                      Our support team is ready to assist you with any questions or concerns you may have
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <h2 className="text-[13px] font-semibold text-slate-800 tracking-tight">Send Us a Message</h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">Fill out the form below and we'll get back to you shortly</p>
                  </div>

                  <form onSubmit={handleContactSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[13px] font-semibold text-slate-800 mb-2">Your Name</label>
                        <input
                          type="text"
                          value={`${profileData.firstName} ${profileData.lastName}`}
                          readOnly
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-[13px] cursor-not-allowed text-slate-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[13px] font-semibold text-slate-800 mb-2">Your Email</label>
                        <input
                          type="email"
                          value={profileData.email}
                          readOnly
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-[13px] cursor-not-allowed text-slate-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-semibold text-slate-800 mb-2">Subject</label>
                      <Dropdown
                        value={contactForm.subject}
                        options={[
                          { value: 'General Inquiry', label: 'General Inquiry' },
                          { value: 'Technical Support', label: 'Technical Support' },
                          { value: 'Billing Question', label: 'Billing Question' },
                          { value: 'Feature Request', label: 'Feature Request' },
                          { value: 'Bug Report', label: 'Bug Report' },
                          { value: 'Other', label: 'Other' },
                        ]}
                        onChange={(val) => setContactForm({ ...contactForm, subject: val as string })}
                        icon="solar:tag-linear"
                        disabled={isSubmittingContact}
                        className="w-full"
                        buttonClassName="w-full"
                        menuClassName="w-full"
                        menuAlign="left"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-semibold text-slate-800 mb-2">Message</label>
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        disabled={isSubmittingContact}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-[13px] resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                        rows={6}
                        maxLength={500}
                        placeholder="Describe your question or issue in detail..."
                        required
                      />
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-[11px] text-slate-400">Please be as detailed as possible</p>
                        <p className={`text-xs font-medium ${contactForm.message.length > 450 ? 'text-amber-600' : 'text-slate-500'}`}>
                          {contactForm.message.length}/500
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-semibold text-slate-800 mb-3">Priority</label>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setContactForm({ ...contactForm, priority: 'normal' })}
                          disabled={isSubmittingContact}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-[13px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            contactForm.priority === 'normal'
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <Icon icon="solar:chat-round-line-linear" width="18" />
                          Normal
                        </button>
                        <button
                          type="button"
                          onClick={() => setContactForm({ ...contactForm, priority: 'urgent' })}
                          disabled={isSubmittingContact}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-[13px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            contactForm.priority === 'urgent'
                              ? 'border-amber-500 bg-amber-500 text-white'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <Icon icon="solar:danger-triangle-linear" width="18" />
                          Urgent
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingContact || !contactForm.message.trim()}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-xl text-[13px] font-semibold hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingContact ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Icon icon="solar:letter-bold" width="18" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <h2 className="text-[13px] font-semibold text-slate-800 tracking-tight">Other Ways to Reach Us</h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">Alternative contact methods for your convenience</p>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="h-11 w-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Icon icon="solar:letter-linear" width="20" className="text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[13px] font-semibold text-slate-800 mb-1">Email Support</h3>
                        <p className="text-[11px] text-slate-400 mb-2">Send us an email directly</p>
                        <a
                          href="mailto:support@superproxy.ai"
                          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          support@superproxy.ai
                          <Icon icon="solar:arrow-right-up-linear" width="14" />
                        </a>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('support@superproxy.ai');
                          alert('Email address copied to clipboard!');
                        }}
                        className="flex-shrink-0 p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all"
                        title="Copy email address"
                      >
                        <Icon icon="solar:copy-linear" width="18" />
                      </button>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-emerald-50/30 rounded-xl border border-blue-100">
                      <div className="h-11 w-11 rounded-xl bg-white border border-blue-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Icon icon="solar:chat-round-dots-bold" width="20" className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[13px] font-semibold text-slate-800 mb-1">Live Chat Support</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Get instant responses from our support team through the live chat feature. Available right here in your account profile for faster assistance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          style={{ animation: 'acct-backdrop 120ms cubic-bezier(0.32, 0.72, 0, 1)' }}
        >
          <div className="fixed inset-0" onClick={() => setShowSuccessModal(false)} />

          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/50 overflow-hidden" style={{ animation: 'acct-modal 180ms cubic-bezier(0.32, 0.72, 0, 1)' }}>
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-5 ring-8 ring-emerald-50">
                <Icon icon="solar:check-circle-bold" width="32" className="text-emerald-600" />
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2">
                Message Sent Successfully
              </h3>

              <p className="text-[13px] text-slate-500 mb-4">
                Thank you for contacting us. We've received your message and will respond to <span className="font-semibold text-slate-900">{profileData.email}</span> within 24 hours.
              </p>

              <div className="w-full bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-600">Your Ticket Number</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(ticketNumber);
                      alert('Ticket number copied to clipboard!');
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-lg font-mono font-bold text-slate-900">{ticketNumber}</p>
              </div>

              <div className="w-full bg-slate-50 rounded-xl p-4 mb-6 text-left">
                <p className="text-xs text-slate-600 leading-relaxed">
                  For faster support, use the live chat feature available in your account profile. Our team can provide instant assistance with your inquiry.
                </p>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-5 py-3 rounded-xl font-semibold text-[13px] text-white bg-slate-900 hover:bg-slate-800 transition-all duration-200 active:scale-95"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes acct-backdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes acct-modal {
          from { opacity: 0; transform: scale(0.96) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
