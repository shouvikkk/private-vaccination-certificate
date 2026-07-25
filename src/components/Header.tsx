import React from 'react';
import { ShieldCheck, Cpu, Wallet, LayoutDashboard, PlusCircle, CheckCircle2, Database, Lock, LogOut } from 'lucide-react';
import { WalletState } from '../services/midnight';

export type NavTab = 'overview' | 'issue' | 'verify' | 'ledger' | 'privacy';

interface HeaderProps {
  wallet: WalletState;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  wallet,
  activeTab,
  onTabChange,
  onConnect,
  onDisconnect,
}) => {
  return (
    <header className="header-bar" id="app-header">
      <div className="brand-container">
        <div className="brand-logo-box">
          <ShieldCheck size={26} />
        </div>
        <div>
          <div className="brand-title">MedVault ZK</div>
          <div className="brand-subtitle">Private Vaccination Certificate • Midnight Network</div>
        </div>
      </div>

      <nav className="nav-tabs" id="navigation-tabs">
        <button
          className={`nav-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => onTabChange('overview')}
          id="nav-overview-tab"
        >
          <LayoutDashboard size={16} />
          Overview
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'issue' ? 'active' : ''}`}
          onClick={() => onTabChange('issue')}
          id="nav-issue-tab"
        >
          <PlusCircle size={16} />
          Issue Record
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'verify' ? 'active' : ''}`}
          onClick={() => onTabChange('verify')}
          id="nav-verify-tab"
        >
          <CheckCircle2 size={16} />
          Verify Proof
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'ledger' ? 'active' : ''}`}
          onClick={() => onTabChange('ledger')}
          id="nav-ledger-tab"
        >
          <Database size={16} />
          Ledger Vault
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => onTabChange('privacy')}
          id="nav-privacy-tab"
        >
          <Lock size={16} />
          Privacy
        </button>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="badge badge-blue">
          <Cpu size={13} />
          {wallet.network.toUpperCase()}
        </div>

        {wallet.isConnected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="badge badge-emerald" style={{ padding: '0.45rem 0.85rem' }} id="wallet-status-badge">
              <span className="status-dot"></span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                {wallet.address?.substring(0, 12)}...{wallet.address?.substring(wallet.address.length - 4)}
              </span>
            </div>
            <button className="btn btn-danger" onClick={onDisconnect} style={{ padding: '0.45rem 0.75rem' }} id="disconnect-wallet-btn" title="Disconnect Wallet">
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={onConnect} id="connect-wallet-btn">
            <Wallet size={16} />
            Connect Lace Wallet
          </button>
        )}
      </div>
    </header>
  );
};
