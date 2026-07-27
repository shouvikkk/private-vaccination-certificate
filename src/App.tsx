import React, { useState, useEffect } from 'react';
import { Header, NavTab } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { IssueCertificateForm } from './components/IssueCertificateForm';
import { VerificationForm } from './components/VerificationForm';
import { LedgerStateCard } from './components/LedgerStateCard';
import { PrivacyExplainer } from './components/PrivacyExplainer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { MidnightService, WalletState, ContractLedgerState } from './services/midnight';

const INITIAL_NETWORK = (import.meta.env.VITE_NETWORK || "PREPROD").toUpperCase();

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: '0 tNIGHT',
    network: INITIAL_NETWORK,
  });

  const [ledgerState, setLedgerState] = useState<ContractLedgerState | null>(null);
  const [isLedgerLoading, setIsLedgerLoading] = useState<boolean>(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [initialSecretForVerify, setInitialSecretForVerify] = useState<string>('SECRET_SALT_PATIENT_9821');

  const midnight = MidnightService.getInstance();

  const addToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      title,
      message,
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 4));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadLedgerState = async () => {
    setIsLedgerLoading(true);
    try {
      const state = await midnight.fetchLedgerState();
      setLedgerState(state);
    } catch (err) {
      console.error('Failed to load ledger state:', err);
    } finally {
      setIsLedgerLoading(false);
    }
  };

  useEffect(() => {
    loadLedgerState();
    
    // Auto-connect if wallet session is saved
    midnight.autoConnectIfSessionActive().then((savedState) => {
      if (savedState) {
        setWallet(savedState);
      }
    }).catch(() => {
      // Ignore auto-connect failures silently
    });
  }, []);

  const handleConnectWallet = async () => {
    try {
      const state = await midnight.connectLaceWallet();
      setWallet(state);
      addToast('Lace Wallet Connected', `Connected account ${state.address?.substring(0, 14)}...`);
    } catch (err: any) {
      addToast('Wallet Connection Error', err?.message || 'Failed to connect Lace Wallet.', 'error');
    }
  };

  const handleDisconnectWallet = () => {
    const state = midnight.disconnectWallet();
    setWallet(state);
    addToast('Wallet Disconnected', 'Disconnected from Lace wallet provider.', 'info');
  };

  const handleNavigateToVerify = (secret: string) => {
    setInitialSecretForVerify(secret);
    setActiveTab('verify');
  };

  return (
    <div className="app-wrapper">
      <Header
        wallet={wallet}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
      />

      <main style={{ marginTop: '1rem' }}>
        {activeTab === 'overview' && (
          <DashboardOverview
            wallet={wallet}
            ledger={ledgerState}
            onNavigate={setActiveTab}
            onConnectWallet={handleConnectWallet}
          />
        )}

        {activeTab === 'issue' && (
          <IssueCertificateForm
            onSuccessToast={addToast}
            onNavigateToVerify={handleNavigateToVerify}
          />
        )}

        {activeTab === 'verify' && (
          <VerificationForm
            wallet={wallet}
            onSuccess={loadLedgerState}
            onToast={addToast}
            initialSecret={initialSecretForVerify}
          />
        )}

        {activeTab === 'ledger' && (
          <LedgerStateCard
            ledger={ledgerState}
            onRefresh={loadLedgerState}
            isLoading={isLedgerLoading}
            onToast={addToast}
          />
        )}

        {activeTab === 'privacy' && <PrivacyExplainer />}
      </main>

      <footer className="footer">
        <div>
          <strong>MedVault ZK</strong> • Private Vaccination Certificate Platform • Built on Midnight Network
        </div>
        <div style={{ marginTop: '0.25rem', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
          Confidential Credentials & Zero-Knowledge Proof Infrastructure • Level 1, 2, 3 Complete Submission
        </div>
      </footer>

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default App;
