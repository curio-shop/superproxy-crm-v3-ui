import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SimpleHeader from './components/SimpleHeader';
import DashboardHeader from './components/DashboardHeader';
import StatsCard from './components/StatsCard';
import ChartCard from './components/ChartCard';
import TeamActivity from './components/TeamActivity';
import Contacts, { ContactDetail } from './components/Contacts';
import Companies, { Company } from './components/Companies';
import Products, { Product } from './components/Products';
import Quotations from './components/Quotations';
import Invoices from './components/Invoices';
import Presentations from './components/Presentations';
import Workspace, { Workspace as WorkspaceType } from './components/Workspace';
import AccountProfile from './components/AccountProfile';
import CallHistory, { CallHistoryRecord } from './components/CallHistory';
import PricingPage from './components/PricingPage';
import CallDetailsDrawer from './components/CallDetailsDrawer';
import AddContactDrawer from './components/AddContactDrawer';
import AddCompanyDrawer from './components/AddCompanyDrawer';
import AddProductDrawer from './components/AddProductDrawer';
import ViewContactDrawer from './components/ViewContactDrawer';
import ViewCompanyDrawer from './components/ViewCompanyDrawer';
import ViewProductDrawer from './components/ViewProductDrawer';
import CreateQuote from './components/CreateQuote';
import CreateInvoice from './components/CreateInvoice';
import QuoteView from './components/QuoteView';
import ErrorBoundary from './components/ErrorBoundary';
import NewEmail from './components/NewEmail';
import EmailHistoryDrawer from './components/EmailHistoryDrawer';
import Celebration from './components/Celebration';
import Dropdown from './components/Dropdown';
import TreasureBurst from './components/TreasureBurst';
import PaperFly from './components/PaperFly';
import ColdCallModal from './components/ColdCallModal';
import PaymentReminderModal from './components/PaymentReminderModal';
import QuoteFollowUpModal from './components/QuoteFollowUpModal';
import MinimizedCallsBar from './components/MinimizedCallsBar';
import TemplateBuilder from './components/TemplateBuilder';
import AIProxyPage from './components/AIProxyPage';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import DeleteAccountModal from './components/DeleteAccountModal';
import ConnectToolsModal from './components/ConnectToolsModal';
import FloatingChatButton from './components/FloatingChatButton';
import FloatingAIWidget from './components/FloatingAIWidget';
import SupportChatDialog from './components/SupportChatDialog';
import Notifications from './components/Notifications';
import CurrencyPage from './components/CurrencyPage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import VerifyEmail from './components/VerifyEmail';
import Onboarding from './components/Onboarding';
import { CallManagerProvider, Contact, Invoice, Quotation, useCallManager } from './contexts/CallManagerContext';
import { ToastProvider, useToast } from './components/ToastContainer';
import { supabase } from './lib/supabase';

function AppContent({ onSignOut }: { onSignOut?: () => void }) {
  const { focusedCallId, getFocusedCall } = useCallManager();
  const { showToast } = useToast();
  // Read URL params for new-tab navigation from chat
  const urlParams = new URLSearchParams(window.location.search);
  const initialView = urlParams.get('view');

  const [activePage, setActivePage] = useState(initialView === 'invoices' ? 'invoices' : 'ai-proxy');
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);
  const [isCompanyDrawerOpen, setIsCompanyDrawerOpen] = useState(false);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [isInvoiceDrawerOpen, setIsInvoiceDrawerOpen] = useState(false);
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [isViewingQuote, setIsViewingQuote] = useState(initialView === 'quote');
  const [isColdCallModalOpen, setIsColdCallModalOpen] = useState(false);
  const [isPaymentReminderModalOpen, setIsPaymentReminderModalOpen] = useState(false);
  const [isQuoteFollowUpModalOpen, setIsQuoteFollowUpModalOpen] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [selectedEmailContact, setSelectedEmailContact] = useState<{ name: string; email?: string } | null>(null);
  const [selectedCall, setSelectedCall] = useState<CallHistoryRecord | null>(null);
  const [preSelectedQuote, setPreSelectedQuote] = useState<Quotation | null>(null);
  const [preSelectedInvoice, setPreSelectedInvoice] = useState<Invoice | null>(null);
  const [emailOriginPage, setEmailOriginPage] = useState<string>('ai-proxy');
  const [preSelectedQuoteForInvoice, setPreSelectedQuoteForInvoice] = useState<Quotation | null>(null);
  const [aiProxyInitialContext, setAiProxyInitialContext] = useState<{ category: string; label: string } | null>(null);
  const [pricingOriginPage, setPricingOriginPage] = useState('home');
  const [pricingInitialTab, setPricingInitialTab] = useState<'plans' | 'credits'>('plans');
  const [isViewContactDrawerOpen, setIsViewContactDrawerOpen] = useState(false);
  const [isViewCompanyDrawerOpen, setIsViewCompanyDrawerOpen] = useState(false);
  const [isViewProductDrawerOpen, setIsViewProductDrawerOpen] = useState(false);
  const [isTemplateBuilderOpen, setIsTemplateBuilderOpen] = useState(false);
  const [templateBuilderType, setTemplateBuilderType] = useState<'quotation' | 'invoice'>('quotation');
  const [selectedViewContact, setSelectedViewContact] = useState<ContactDetail | null>(null);
  const [selectedViewCompany, setSelectedViewCompany] = useState<Company | null>(null);
  const [selectedViewProduct, setSelectedViewProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteModalEntity, setDeleteModalEntity] = useState<{ type: 'contact' | 'company' | 'product' | 'quotation' | 'invoice' | 'presentation'; id: string; name: string } | null>(null);
  const [isDeletingEntity, setIsDeletingEntity] = useState(false);

  // FAB state management
  const [fabDismissed, setFabDismissed] = useState(false);
  const [showFabUndoToast, setShowFabUndoToast] = useState(false);

  // Chat state management
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const [chatUnreadCount, setChatUnreadCount] = useState(3);
  const [currentUser] = useState<{ id: string; name: string }>({
    id: 'mock-user-id',
    name: 'Melwyn Arrubio'
  });
  const [activeAccountTab, setActiveAccountTab] = useState<'profile' | 'preferences' | 'security' | 'billing' | 'workspaces' | 'voice' | 'connectors' | 'contact'>('profile');

  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [isConnectToolsModalOpen, setIsConnectToolsModalOpen] = useState(false);
  const [connectedTools, setConnectedTools] = useState<Record<string, boolean>>({});
  const [isAccountDeleting, setIsAccountDeleting] = useState(false);
  const [deleteAccountConfirmText, setDeleteAccountConfirmText] = useState('');

  const [isCallDetailsDrawerOpen, setIsCallDetailsDrawerOpen] = useState(false);
  const [isEmailHistoryDrawerOpen, setIsEmailHistoryDrawerOpen] = useState(false);
  const [workspaceHandlers, setWorkspaceHandlers] = useState<{
    onCreateWorkspace?: () => void;
    onJoinWorkspace?: () => void;
  }>({});
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);
  const [celebrationPosition, setCelebrationPosition] = useState({ x: 0, y: 0 });
  const [shimmerBurstTrigger, setShimmerBurstTrigger] = useState(0);
  const [shimmerBurstPosition, setShimmerBurstPosition] = useState({ x: 0, y: 0 });
  const [paperFlyTrigger, setPaperFlyTrigger] = useState(0);
  const [paperFlyPosition, setPaperFlyPosition] = useState({ x: 0, y: 0 });
  const [showEmailPaperPlane, setShowEmailPaperPlane] = useState(false);
  const [isTeamView, setIsTeamView] = useState(false);
  const homeFilterPreference = isTeamView ? 'team' : 'personal';

  const handleDealWonClick = useCallback((x: number, y: number) => {
    setCelebrationPosition({ x, y });
    setCelebrationTrigger(prev => prev + 1);
  }, []);

  const handlePaymentsClick = useCallback((x: number, y: number) => {
    setShimmerBurstPosition({ x, y });
    setShimmerBurstTrigger(prev => prev + 1);
  }, []);

  const handleQuotationsClick = useCallback((x: number, y: number) => {
    setPaperFlyPosition({ x, y });
    setPaperFlyTrigger(prev => prev + 1);
  }, []);

  const handleEmailSent = useCallback(() => {
    setShowEmailPaperPlane(true);
    setTimeout(() => {
      setShowEmailPaperPlane(false);
    }, 2500); // Duration of animation
  }, []);

  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceType | null>(null);

  useEffect(() => {
    if (focusedCallId) {
      const focusedCall = getFocusedCall();
      if (focusedCall && !focusedCall.isMinimized) {
        setSelectedContact(focusedCall.contact);

        if (focusedCall.callType === 'paymentReminder') {
          setSelectedInvoice(focusedCall.invoiceData || null);
          setIsPaymentReminderModalOpen(true);
          setIsColdCallModalOpen(false);
          setIsQuoteFollowUpModalOpen(false);
        } else if (focusedCall.callType === 'quoteFollowUp') {
          setSelectedQuotation(focusedCall.quotationData || null);
          setIsQuoteFollowUpModalOpen(true);
          setIsColdCallModalOpen(false);
          setIsPaymentReminderModalOpen(false);
        } else {
          setIsColdCallModalOpen(true);
          setIsPaymentReminderModalOpen(false);
          setIsQuoteFollowUpModalOpen(false);
        }
      }
    }
  }, [focusedCallId, getFocusedCall]);

  // Load unread count when Contact Us tab is active
  useEffect(() => {
    if (activePage !== 'account' || activeAccountTab !== 'contact' || !currentUser?.id) return;

    const loadUnreadCount = async () => {
      const { data } = await supabase
        .from('support_conversations')
        .select('unread_count')
        .eq('user_id', currentUser.id)
        .eq('status', 'open')
        .maybeSingle();

      if (data) {
        setChatUnreadCount(data.unread_count || 0);
      }
    };

    loadUnreadCount();

    const channel = supabase
      .channel(`support_unread:${currentUser.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_conversations',
          filter: `user_id=eq.${currentUser.id}`
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'unread_count' in payload.new) {
            setChatUnreadCount((payload.new as any).unread_count || 0);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activePage, activeAccountTab, currentUser?.id]);

  // Don't render special views with early returns - handle them in the main render
  // This prevents React hooks errors

  const handleCreateNew = useCallback((type: 'contact' | 'company' | 'product' | 'quote' | 'invoice') => {
    switch (type) {
      case 'contact':
        setIsContactDrawerOpen(true);
        break;
      case 'company':
        setIsCompanyDrawerOpen(true);
        break;
      case 'product':
        setIsProductDrawerOpen(true);
        break;
      case 'quote':
        setIsCreatingQuote(true);
        break;
      case 'invoice':
        setIsCreatingInvoice(true);
        break;
    }
  }, []);

  const handleViewCall = useCallback((call: CallHistoryRecord) => {
    setSelectedCall(call);
    setIsCallDetailsDrawerOpen(true);
  }, []);

  const handleOpenDeleteModal = (type: 'contact' | 'company' | 'product' | 'quotation' | 'invoice' | 'presentation', id: string, name: string) => {
    setDeleteModalEntity({ type, id, name });
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    if (!isDeletingEntity) {
      setIsDeleteModalOpen(false);
      setDeleteModalEntity(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalEntity) return;

    setIsDeletingEntity(true);

    try {
      const { type, id, name } = deleteModalEntity;

      let error = null;

      switch (type) {
        case 'contact':
          const { error: contactError } = await supabase
            .from('contacts')
            .delete()
            .eq('id', id);
          error = contactError;
          break;

        case 'company':
          const { error: companyError } = await supabase
            .from('companies')
            .delete()
            .eq('id', id);
          error = companyError;
          break;

        case 'product':
          const { error: productError } = await supabase
            .from('products')
            .delete()
            .eq('id', id);
          error = productError;
          break;

        case 'quotation':
          break;

        case 'invoice':
          break;

        case 'presentation':
          break;
      }

      if (error) {
        throw error;
      }

      setIsDeleteModalOpen(false);
      setDeleteModalEntity(null);

      const entityLabel = type.charAt(0).toUpperCase() + type.slice(1);
      showToast(`${entityLabel} removed successfully`, 'success');

      window.location.reload();
    } catch (error) {
      showToast('Failed to delete. Please try again.', 'error');
    } finally {
      setIsDeletingEntity(false);
    }
  };

  const handleOpenDeleteAccountModal = () => {
    setIsDeleteAccountModalOpen(true);
  };

  const handleCloseDeleteAccountModal = () => {
    if (!isAccountDeleting) {
      setIsDeleteAccountModalOpen(false);
      setDeleteAccountConfirmText('');
    }
  };

  const handleConfirmDeleteAccount = async () => {
    setIsAccountDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAccountDeleting(false);
    setIsDeleteAccountModalOpen(false);
    setDeleteAccountConfirmText('');
    showToast('Account deletion requested. You will receive a confirmation email.', 'info');
  };

  // ============================================
  // ALL HOOKS MUST BE ABOVE THIS LINE
  // React requires hooks to be called in the same order every render
  // ============================================

  // Render special full-screen views
  if (isViewingQuote) {
    return (
      <div className="h-screen w-screen">
        <ErrorBoundary>
          <QuoteView isFreeTier={true} onBackToQuotes={() => {
            setIsViewingQuote(false);
            setActivePage('quotations');
          }} />
        </ErrorBoundary>
      </div>
    );
  }

  if (isCreatingQuote) {
    return (
      <div className="h-screen w-screen">
        <ErrorBoundary>
          <CreateQuote
            onBack={() => {
              setIsCreatingQuote(false);
            }}
            onPublish={() => {
              setIsCreatingQuote(false);
              setIsViewingQuote(true);
            }}
          />
        </ErrorBoundary>
      </div>
    );
  }

  if (isCreatingInvoice) {
    return (
      <div className="h-screen w-screen">
        <ErrorBoundary>
          <CreateInvoice
            onBack={() => {
              setIsCreatingInvoice(false);
              setPreSelectedQuoteForInvoice(null);
            }}
            onPublish={() => {
              setIsCreatingInvoice(false);
              setPreSelectedQuoteForInvoice(null);
              setActivePage('invoices');
            }}
            preSelectedQuote={preSelectedQuoteForInvoice}
          />
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className="h-screen text-slate-600 antialiased selection:bg-sky-200 selection:text-slate-900 overflow-hidden">
        <div className="fixed inset-0 -z-10 h-full w-full bg-[#f7f7f8]"></div>
        <div className="flex h-screen pl-3">
          <Sidebar
            activePage={activePage}
            onPageChange={(page) => {
              if (page === 'new-email') {
                setSelectedEmailContact(null);
                setPreSelectedQuote(null);
                setPreSelectedInvoice(null);
                setEmailOriginPage(activePage);
              }
              if (page === 'pricing') {
                setPricingOriginPage(activePage);
                setPricingInitialTab('plans');
              }
              setActivePage(page);
            }}
            currentWorkspace={currentWorkspace}
            onCreateNew={handleCreateNew}
            onCreateQuote={() => setIsCreatingQuote(true)}
            onCreateInvoice={() => setIsCreatingInvoice(true)}
            onOpenQuoteTemplate={() => { setTemplateBuilderType('quotation'); setIsTemplateBuilderOpen(true); }}
            onOpenInvoiceTemplate={() => { setTemplateBuilderType('invoice'); setIsTemplateBuilderOpen(true); }}
          />

        <main className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden relative z-30" style={{ scrollbarGutter: 'stable' }}>
          {activePage === 'account' ? (
            <SimpleHeader
              title="Account Settings"
              subtitle="Manage your profile, security, and preferences."
              onNavigateToNotifications={() => setActivePage('notifications')}
            />
          ) : activePage === 'invoices' ? (
            <SimpleHeader
              title="Invoices"
              subtitle="Track payments, manage billing, and monitor invoice status."
              onNavigateToNotifications={() => setActivePage('notifications')}
            />
          ) : activePage === 'call-history' ? (
            <SimpleHeader
              title="Call History"
              subtitle="Review past calls, transcripts, and insights."
              onBack={() => setActivePage('contacts')}
              onNavigateToNotifications={() => setActivePage('notifications')}
            />
          ) : activePage === 'presentations' ? (
            <SimpleHeader
              title="Walkthroughs"
              subtitle="Record and share video walkthroughs for your quotes and invoices."
              onNavigateToNotifications={() => setActivePage('notifications')}
            />
          ) : activePage === 'notifications' ? (
            <SimpleHeader
              title="Notifications"
              subtitle="Stay updated with your team's activities and important alerts."
              onNavigateToNotifications={() => setActivePage('notifications')}
            />
          ) : activePage === 'currency' ? (
            <SimpleHeader
              title="Currency"
              subtitle="Manage display currency, convert between currencies, and view live exchange rates."
              onNavigateToNotifications={() => setActivePage('notifications')}
            />
          ) : activePage === 'new-email' ? null : activePage === 'ai-proxy' ? null : activePage === 'pricing' ? null : activePage === 'home' ? null : (
            <Header
              activePage={activePage}
              onOpenDrawer={() => {}}
              onCreateWorkspace={workspaceHandlers.onCreateWorkspace}
              onJoinWorkspace={workspaceHandlers.onJoinWorkspace}
              isTeamView={isTeamView}
              onToggleView={setIsTeamView}
              onNavigateToNotifications={() => setActivePage('notifications')}
            />
          )}

          {activePage === 'home' ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#fafafa] flex flex-col" style={{ scrollbarGutter: 'stable' }}>
            <DashboardHeader
              isTeamView={isTeamView}
              onToggleView={setIsTeamView}
              onNavigateToNotifications={() => setActivePage('notifications')}
            />
            <div className="px-6 py-6 flex-1 flex flex-col">
            <div className="grid grid-cols-12 gap-5 flex-1">
              <div className="col-span-12 xl:col-span-8 flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <StatsCard
                    title="Total Quotations"
                    value="$3,810,710"
                    subtitle={
                      <>
                        <span className="text-slate-900 font-semibold">24 quotes</span> sent this month
                      </>
                    }
                    icon="solar:document-text-linear"
                    iconColor="text-slate-400 group-hover:text-blue-500"
                    titleColor="text-indigo-600"
                  />
                  <StatsCard
                    title="Deals Won"
                    value="12"
                    subtitle={
                      <>
                        Total amount: <span className="text-slate-900 font-semibold">$2,100,450</span>
                      </>
                    }
                    icon="solar:cup-star-linear"
                    iconColor="text-slate-400 group-hover:text-rose-500"
                    titleColor="text-rose-600"
                    onIconClick={handleDealWonClick}
                  />
                  <StatsCard
                    title="Total Revenue"
                    value="$3,415,820"
                    subtitle={
                      <>
                        <span className="text-slate-900 font-semibold">6 unpaid invoices</span>
                      </>
                    }
                    icon="solar:wallet-money-linear"
                    iconColor="text-slate-400 group-hover:text-amber-500"
                    titleColor="text-amber-600"
                  />
                  <StatsCard
                    title="Total Payments"
                    value="$1,728,950"
                    subtitle={
                      <>
                        <span className="text-slate-900 font-semibold">12 invoices</span> collected
                      </>
                    }
                    icon="solar:cash-out-linear"
                    iconColor="text-slate-400 group-hover:text-emerald-500"
                    titleColor="text-emerald-600"
                    onIconClick={handlePaymentsClick}
                    iconAnimation="shine"
                  />
                </div>

                <ChartCard
                  isFreeTier={true}
                  onUpgrade={() => { setPricingOriginPage('home'); setActivePage('pricing'); }}
                />
              </div>

              <div className="col-span-12 xl:col-span-4">
                <TeamActivity
                  isFreeTier={true}
                  onUpgrade={() => { setPricingOriginPage('home'); setActivePage('pricing'); }}
                  onViewFullActivity={() => {
                    setActivePage('workspace');
                    requestAnimationFrame(() => {
                      document.getElementById('workspace-activity')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });
                  }}
                />
              </div>
            </div>
            </div>
            </div>
          ) : activePage === 'contacts' ? (
            <Contacts
              isTeamView={isTeamView}
              homeFilterPreference={homeFilterPreference}
              onColdCallClick={(contact) => {
                setSelectedContact(contact);
                setIsColdCallModalOpen(true);
              }}
              onViewHistory={() => setActivePage('call-history')}
              onSendEmail={(contact) => {
                setSelectedEmailContact({ name: contact.name, email: contact.email });
                setEmailOriginPage('contacts');
                setActivePage('new-email');
              }}
              onViewContact={(contact) => {
                setSelectedViewContact(contact);
                setIsViewContactDrawerOpen(true);
              }}
              onOpenAddContact={() => setIsContactDrawerOpen(true)}
              onDeleteContact={(contact) => {
                handleOpenDeleteModal('contact', contact.id, contact.name);
              }}
            />
          ) : activePage === 'new-email' ? (
            <NewEmail
              onBack={() => {
                setActivePage(emailOriginPage);
                setSelectedEmailContact(null);
                setPreSelectedQuote(null);
                setPreSelectedInvoice(null);
              }}
              contactName={selectedEmailContact?.name}
              contactEmail={selectedEmailContact?.email}
              preSelectedQuote={preSelectedQuote}
              preSelectedInvoice={preSelectedInvoice}
              onOpenEmailHistory={() => {
                setIsEmailHistoryDrawerOpen(true);
              }}
              onEmailSent={handleEmailSent}
            />
          ) : activePage === 'companies' ? (
            <Companies
              isTeamView={isTeamView}
              homeFilterPreference={homeFilterPreference}
              onViewCompany={(company) => {
                setSelectedViewCompany(company);
                setIsViewCompanyDrawerOpen(true);
              }}
              onOpenAddCompany={() => setIsCompanyDrawerOpen(true)}
              onDeleteCompany={(company) => {
                handleOpenDeleteModal('company', company.id, company.name);
              }}
            />
          ) : activePage === 'products' ? (
            <Products
              isTeamView={isTeamView}
              homeFilterPreference={homeFilterPreference}
              onViewProduct={(product) => {
                setSelectedViewProduct(product);
                setIsViewProductDrawerOpen(true);
              }}
              onOpenAddProduct={() => setIsProductDrawerOpen(true)}
              onDeleteProduct={(product) => {
                handleOpenDeleteModal('product', product.id, product.name);
              }}
            />
          ) : activePage === 'quotations' ? (
            <Quotations
              isTeamView={isTeamView}
              homeFilterPreference={homeFilterPreference}
              onViewQuote={() => {
                setIsViewingQuote(true);
              }}
              onQuoteFollowUpClick={(quotation, contact) => {
                setSelectedQuotation(quotation);
                setSelectedContact(contact);
                setIsQuoteFollowUpModalOpen(true);
              }}
              onEmailQuoteClick={(quotation) => {
                setPreSelectedQuote(quotation);
                setPreSelectedInvoice(null);
                setSelectedEmailContact({ name: quotation.client.name, email: undefined });
                setEmailOriginPage('quotations');
                setActivePage('new-email');
              }}
              onCreateInvoiceClick={(quotation) => {
                setPreSelectedQuoteForInvoice(quotation);
                setIsCreatingInvoice(true);
              }}
              onAskAIClick={(quotation) => {
                setAiProxyInitialContext({ category: 'Quote', label: quotation.number });
                setActivePage('ai-proxy');
              }}
              onOpenTemplateBuilder={() => {
                setTemplateBuilderType('quotation');
                setIsTemplateBuilderOpen(true);
              }}
              onOpenCreateQuote={() => setIsCreatingQuote(true)}
              onDeleteQuotation={(quotation) => {
                handleOpenDeleteModal('quotation', quotation.id, quotation.number);
              }}
              isFreeTier={true}
              onUpgrade={() => { setPricingOriginPage('quotations'); setActivePage('pricing'); }}
            />
          ) : activePage === 'invoices' ? (
            <Invoices
              isTeamView={isTeamView}
              homeFilterPreference={homeFilterPreference}
              onPaymentReminderClick={(invoice, contact) => {
                setSelectedInvoice(invoice);
                setSelectedContact(contact);
                setIsPaymentReminderModalOpen(true);
              }}
              onEmailInvoiceClick={(invoice) => {
                setPreSelectedInvoice(invoice);
                setPreSelectedQuote(null);
                setSelectedEmailContact({ name: invoice.client.name, email: undefined });
                setEmailOriginPage('invoices');
                setActivePage('new-email');
              }}
              onAskAIClick={(invoice) => {
                setAiProxyInitialContext({ category: 'Invoice', label: invoice.number });
                setActivePage('ai-proxy');
              }}
              onOpenTemplateBuilder={() => {
                setTemplateBuilderType('invoice');
                setIsTemplateBuilderOpen(true);
              }}
              onOpenCreateInvoice={() => setIsCreatingInvoice(true)}
              onDeleteInvoice={(invoice) => {
                handleOpenDeleteModal('invoice', invoice.id, invoice.number);
              }}
              isFreeTier={true}
              onUpgrade={() => { setPricingOriginPage('invoices'); setActivePage('pricing'); }}
            />
          ) : activePage === 'presentations' ? (
            <Presentations
              showRecordModal={showRecordModal}
              onCloseRecordModal={() => setShowRecordModal(false)}
              onOpenRecordModal={() => setShowRecordModal(true)}
              onDeletePresentation={(presentation) => {
                handleOpenDeleteModal('presentation', presentation.id, presentation.title);
              }}
              isFreeTier={true}
              onUpgrade={() => { setPricingOriginPage('presentations'); setActivePage('pricing'); }}
            />
          ) : activePage === 'currency' ? (
            <CurrencyPage
              isFreeTier={true}
              onUpgrade={() => { setPricingOriginPage('currency'); setActivePage('pricing'); }}
            />
          ) : activePage === 'notifications' ? (
            <Notifications />
          ) : activePage === 'workspace' ? (
            <Workspace onRegisterHandlers={setWorkspaceHandlers} onWorkspaceChange={setCurrentWorkspace} onUpgrade={() => { setPricingOriginPage('workspace'); setActivePage('pricing'); }} />
          ) : activePage === 'account' ? (
            <AccountProfile
              activeTab={activeAccountTab}
              onTabChange={setActiveAccountTab}
              onChatOpen={() => setIsSupportChatOpen(true)}
              chatUnreadCount={chatUnreadCount}
              onDeleteAccountClick={handleOpenDeleteAccountModal}
              connectedTools={connectedTools}
              onConnectedToolsChange={setConnectedTools}
              onViewPlans={() => { setPricingOriginPage('account'); setActivePage('pricing'); }}
              onSignOut={onSignOut}
            />
          ) : activePage === 'pricing' ? (
            <PricingPage onBack={() => { setActivePage(pricingOriginPage); setPricingInitialTab('plans'); }} initialTab={pricingInitialTab} />
          ) : activePage === 'call-history' ? (
            <CallHistory onBack={() => setActivePage('contacts')} onViewCall={handleViewCall} />
          ) : null}

          {/* Always mounted to preserve chat state */}
          <div className={activePage === 'ai-proxy' ? 'contents' : 'hidden'}>
            <AIProxyPage
              onNavigateToNotifications={() => setActivePage('notifications')}
              onViewContact={(contact) => {
                setSelectedViewContact(contact);
                setIsViewContactDrawerOpen(true);
              }}
              onViewCompany={(company) => {
                setSelectedViewCompany(company);
                setIsViewCompanyDrawerOpen(true);
              }}
              onViewProduct={(product) => {
                setSelectedViewProduct(product);
                setIsViewProductDrawerOpen(true);
              }}
              onViewQuote={() => {
                setIsViewingQuote(true);
              }}
              onCreateInvoiceFromQuote={(quotation) => {
                setPreSelectedQuoteForInvoice(quotation);
                setIsCreatingInvoice(true);
              }}
              onViewInvoice={() => {
                setActivePage('invoices');
              }}
              onOpenConnectors={() => setIsConnectToolsModalOpen(true)}
              connectedTools={connectedTools}
              initialContext={aiProxyInitialContext}
              onConsumeInitialContext={() => setAiProxyInitialContext(null)}
              fabEnabled={!fabDismissed}
              onFabEnabledChange={(enabled: boolean) => setFabDismissed(!enabled)}
              onGetMoreCredits={() => { setPricingOriginPage('ai-proxy'); setPricingInitialTab('credits'); setActivePage('pricing'); }}
            />
          </div>
        </main>
      </div>

      <AddContactDrawer isOpen={isContactDrawerOpen} onClose={() => setIsContactDrawerOpen(false)} />
      <AddCompanyDrawer isOpen={isCompanyDrawerOpen} onClose={() => setIsCompanyDrawerOpen(false)} />
      <AddProductDrawer isOpen={isProductDrawerOpen} onClose={() => setIsProductDrawerOpen(false)} />
      <ViewContactDrawer
        isOpen={isViewContactDrawerOpen}
        onClose={() => {
          setIsViewContactDrawerOpen(false);
          setSelectedViewContact(null);
        }}
        contact={selectedViewContact}
      />
      <ViewCompanyDrawer
        isOpen={isViewCompanyDrawerOpen}
        onClose={() => {
          setIsViewCompanyDrawerOpen(false);
          setSelectedViewCompany(null);
        }}
        company={selectedViewCompany}
      />
      <ViewProductDrawer
        isOpen={isViewProductDrawerOpen}
        onClose={() => {
          setIsViewProductDrawerOpen(false);
          setSelectedViewProduct(null);
        }}
        product={selectedViewProduct}
      />
      <EmailHistoryDrawer
        isOpen={isEmailHistoryDrawerOpen}
        onClose={() => setIsEmailHistoryDrawerOpen(false)}
        onComposeEmail={(recipient) => {
          setSelectedEmailContact({ name: recipient.name, email: recipient.email });
          setActivePage('new-email');
        }}
        contactEmail={selectedEmailContact?.email}
        contactName={selectedEmailContact?.name}
      />
      {isTemplateBuilderOpen && (
        <TemplateBuilder
          onClose={() => setIsTemplateBuilderOpen(false)}
          templateType={templateBuilderType}
        />
      )}
      <CallDetailsDrawer
        isOpen={isCallDetailsDrawerOpen}
        onClose={() => {
          setIsCallDetailsDrawerOpen(false);
          setSelectedCall(null);
        }}
        call={selectedCall}
      />
      <ColdCallModal
        isOpen={isColdCallModalOpen}
        onClose={() => {
          setIsColdCallModalOpen(false);
          setSelectedContact(null);
        }}
        contact={selectedContact}
        onNavigateToHistory={() => setActivePage('call-history')}
      />
      <PaymentReminderModal
        isOpen={isPaymentReminderModalOpen}
        onClose={() => {
          setIsPaymentReminderModalOpen(false);
          setSelectedContact(null);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        contact={selectedContact}
        onNavigateToHistory={() => setActivePage('call-history')}
      />
      <QuoteFollowUpModal
        isOpen={isQuoteFollowUpModalOpen}
        onClose={() => {
          setIsQuoteFollowUpModalOpen(false);
          setSelectedContact(null);
          setSelectedQuotation(null);
        }}
        quotation={selectedQuotation}
        contact={selectedContact}
        onNavigateToHistory={() => setActivePage('call-history')}
      />
      <Celebration trigger={celebrationTrigger} originX={celebrationPosition.x} originY={celebrationPosition.y} />
      <TreasureBurst trigger={shimmerBurstTrigger} originX={shimmerBurstPosition.x} originY={shimmerBurstPosition.y} />
      <PaperFly trigger={paperFlyTrigger} originX={paperFlyPosition.x} originY={paperFlyPosition.y} />
      <ConnectToolsModal
        isOpen={isConnectToolsModalOpen}
        onClose={() => setIsConnectToolsModalOpen(false)}
        connectedTools={connectedTools}
        onConnectedToolsChange={setConnectedTools}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        entityType={deleteModalEntity?.type || 'contact'}
        entityName={deleteModalEntity?.name}
        isDeleting={isDeletingEntity}
      />
      <MinimizedCallsBar />
      <FloatingAIWidget
        isVisible={activePage !== 'ai-proxy' && !(activePage === 'account' && activeAccountTab === 'contact')}
        dismissed={fabDismissed}
        onDismiss={() => {
          setFabDismissed(true);
          setShowFabUndoToast(true);
          setTimeout(() => setShowFabUndoToast(false), 4000);
        }}
        onGetMoreCredits={() => { setPricingOriginPage(activePage); setPricingInitialTab('credits'); setActivePage('pricing'); }}
        onViewContact={(contact) => { setSelectedViewContact(contact); setIsViewContactDrawerOpen(true); }}
        onViewCompany={(company) => { setSelectedViewCompany(company); setIsViewCompanyDrawerOpen(true); }}
        onViewProduct={(product) => { setSelectedViewProduct(product); setIsViewProductDrawerOpen(true); }}
      />
      {showFabUndoToast && (
        <div className="fixed bottom-6 left-0 right-0 z-[60] flex justify-center pointer-events-none">
        <div
          className="relative flex items-center gap-4 pl-4 pr-4 py-3 rounded-[14px] pointer-events-auto toast-enter overflow-hidden"
          style={{
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(20px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06) inset, 0 1px 0 rgba(255,255,255,0.05) inset',
          }}
        >
          <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-[10px]" style={{ background: 'rgba(251,191,36,0.1)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-medium text-white/90 leading-tight tracking-[-0.01em]">Task assistant hidden</span>
            <span className="text-[11.5px] text-slate-400 leading-tight">Re-enable anytime from Task page</span>
          </div>
          <button
            onClick={() => { setFabDismissed(false); setShowFabUndoToast(false); }}
            className="ml-2 text-[12.5px] font-semibold text-amber-400 hover:text-amber-300 transition-colors flex-shrink-0 px-2.5 py-1 rounded-lg hover:bg-amber-400/10"
          >
            Undo
          </button>
        </div>
        </div>
      )}
      <FloatingChatButton
        unreadCount={chatUnreadCount}
        onClick={() => setIsSupportChatOpen(!isSupportChatOpen)}
        isOpen={isSupportChatOpen}
        isVisible={activePage === 'account' && activeAccountTab === 'contact'}
      />
      {activePage === 'account' && activeAccountTab === 'contact' && (
        <SupportChatDialog
          isOpen={isSupportChatOpen}
          onClose={() => setIsSupportChatOpen(false)}
          userId={currentUser.id}
          userName={currentUser.name}
        />
      )}
      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onClose={handleCloseDeleteAccountModal}
        onConfirm={handleConfirmDeleteAccount}
        deleteConfirmText={deleteAccountConfirmText}
        onDeleteConfirmTextChange={setDeleteAccountConfirmText}
        isDeleting={isAccountDeleting}
      />

      {/* Email Sent Animation with Full-Screen Blur */}
      {showEmailPaperPlane && (
        <>
          {/* Backdrop Blur Overlay */}
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[9998] animate-in fade-in duration-300" />
          
          {/* Paper Plane Animation */}
          <div className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center">
            <div className="animate-paper-plane-fly">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 blur-xl animate-pulse rounded-full" />
                <Icon
                  icon="solar:letter-bold"
                  width="56"
                  className="relative text-blue-500 drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
          
          {/* Sparkles */}
          <div className="fixed inset-0 pointer-events-none z-[9999]">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-sparkle-float"
                style={{
                  left: '50%',
                  top: '50%',
                  animationDelay: `${i * 0.1}s`,
                  '--angle': `${(360 / 12) * i}deg`,
                } as React.CSSProperties}
              >
                <div className="w-1 h-1 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50" />
              </div>
            ))}
          </div>
          
          {/* Success Ripples */}
          <div className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center">
            <div className="absolute animate-success-ripple">
              <div className="w-64 h-64 rounded-full border-2 border-emerald-400/30" />
            </div>
            <div className="absolute animate-success-ripple" style={{ animationDelay: '0.2s' } as React.CSSProperties}>
              <div className="w-64 h-64 rounded-full border-2 border-blue-400/30" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CallManagerWithToast({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();

  return (
    <CallManagerProvider onError={(message) => showToast(message, 'warning')}>
      {children}
    </CallManagerProvider>
  );
}

type AuthPage = 'signin' | 'signup' | 'verify-email' | 'forgot-password' | 'onboarding' | null;

function App() {
  const [authPage, setAuthPage] = useState<AuthPage>('signin');
  const [signUpEmail, setSignUpEmail] = useState('');

  if (authPage === 'signin') {
    return (
      <SignIn
        onSignIn={() => setAuthPage('onboarding')}
        onGoToSignUp={() => setAuthPage('signup')}
        onForgotPassword={() => setAuthPage('forgot-password')}
      />
    );
  }

  if (authPage === 'forgot-password') {
    return (
      <ForgotPassword onBackToSignIn={() => setAuthPage('signin')} />
    );
  }

  if (authPage === 'signup') {
    return (
      <SignUp
        onSignUp={(email: string) => { setSignUpEmail(email); setAuthPage('verify-email'); }}
        onGoToSignIn={() => setAuthPage('signin')}
      />
    );
  }

  if (authPage === 'verify-email') {
    return (
      <VerifyEmail
        email={signUpEmail}
        onBackToSignIn={() => setAuthPage('signin')}
      />
    );
  }

  if (authPage === 'onboarding') {
    return (
      <Onboarding onComplete={() => setAuthPage(null)} />
    );
  }

  return (
    <ToastProvider>
      <CallManagerWithToast>
        <AppContent onSignOut={() => setAuthPage('signin')} />
      </CallManagerWithToast>
    </ToastProvider>
  );
}

export default App;
