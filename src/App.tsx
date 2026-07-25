import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VerificationForm } from './components/VerificationForm';
import { LedgerStateCard } from './components/LedgerStateCard';
import { PrivacyExplainer } from './components/PrivacyExplainer';
import { MidnightService, WalletState, ContractLedgerState } from './services/midnight';

export const App: React.FC = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: '0 tNIGHT',
    network: 'UNDEPLOYED',
  });

  const [ledgerState, setLedgerState] = useState<ContractLedgerState | null>(null);
  const [isLedgerLoading, setIsLedgerLoading] = useState<boolean>(false);

  const midnight = MidnightService.getInstance();

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
  }, []);

  const handleConnectWallet = async () => {
    const state = await midnight.connectLaceWallet();
    setWallet(state);
  };

  const handleDisconnectWallet = () => {
    const state = midnight.disconnectWallet();
    setWallet(state);
  };

  return (
    <div className="app-container">
      <Header
        wallet={wallet}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
      />

      <main className="dashboard-grid">
        <VerificationForm
          wallet={wallet}
          onSuccess={loadLedgerState}
        />
        <LedgerStateCard
          ledger={ledgerState}
          onRefresh={loadLedgerState}
          isLoading={isLedgerLoading}
        />
      </main>

      <PrivacyExplainer />

      <footer>
        <div>Private Vaccination Certificate dApp • Midnight ZK Blockchain • Level 1, 2, 3 Full-Stack Submission</div>
      </footer>
    </div>
  );
};

export default App;
