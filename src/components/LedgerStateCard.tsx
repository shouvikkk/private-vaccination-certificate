import React from 'react';
import { Database, RefreshCw, Layers, Key, Hash } from 'lucide-react';
import { ContractLedgerState } from '../services/midnight';

interface LedgerStateCardProps {
  ledger: ContractLedgerState | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export const LedgerStateCard: React.FC<LedgerStateCardProps> = ({ ledger, onRefresh, isLoading }) => {
  return (
    <div className="card" id="ledger-state-card">
      <div className="card-title" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Database size={22} />
          Public Ledger State (On-Chain)
        </div>
        <button className="btn btn-secondary" onClick={onRefresh} disabled={isLoading} style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }} id="refresh-ledger-btn">
          <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      {ledger ? (
        <div>
          <div className="data-row">
            <span className="data-key" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={14} /> Contract Address
            </span>
            <span className="mono-hash">{ledger.contractAddress}</span>
          </div>

          <div className="data-row">
            <span className="data-key" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Hash size={14} /> Total Verified Proofs
            </span>
            <span className="data-val" style={{ color: 'var(--accent-emerald)', fontSize: '1.2rem' }}>
              {ledger.totalVerifications}
            </span>
          </div>

          <div className="data-row">
            <span className="data-key" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Key size={14} /> Authority Public Key / ID
            </span>
            <span className="mono-hash">{ledger.authorityHash}</span>
          </div>

          <div className="data-row">
            <span className="data-key" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <LockIcon size={14} /> Latest Disclosed Nullifier
            </span>
            <span className="mono-hash">{ledger.lastNullifier}</span>
          </div>
        </div>
      ) : (
        <div className="banner banner-info">Loading public ledger state...</div>
      )}
    </div>
  );
};

const LockIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5:0 0 1 10 0v4"></path>
  </svg>
);
