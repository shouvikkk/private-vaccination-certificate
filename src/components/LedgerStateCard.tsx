import React, { useState } from 'react';
import { Database, RefreshCw, Layers, Key, Hash, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { ContractLedgerState } from '../services/midnight';

interface LedgerStateCardProps {
  ledger: ContractLedgerState | null;
  onRefresh: () => void;
  isLoading: boolean;
  onToast: (title: string, message?: string) => void;
}

export const LedgerStateCard: React.FC<LedgerStateCardProps> = ({
  ledger,
  onRefresh,
  isLoading,
  onToast,
}) => {
  const [copiedContract, setCopiedContract] = useState(false);
  const [copiedAuthority, setCopiedAuthority] = useState(false);
  const [copiedNullifier, setCopiedNullifier] = useState(false);

  const copyToClipboard = (text: string, label: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setFn(true);
    onToast(`${label} Copied!`, 'Address hash copied to clipboard.');
    setTimeout(() => setFn(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexFlow: 'column', gap: '1.5rem' }} id="ledger-vault-container">
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-title-icon" style={{ background: 'var(--teal-light)', color: 'var(--teal)' }}>
              <Database size={20} />
            </div>
            <div>
              <div className="card-title">Public Ledger Vault (On-Chain State)</div>
              <div className="card-subtitle">Indexed state query from Midnight Indexer</div>
            </div>
          </div>
          <button
            className="btn btn-secondary"
            onClick={onRefresh}
            disabled={isLoading}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            id="refresh-ledger-vault-btn"
          >
            <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
            Refresh State
          </button>
        </div>

        {ledger ? (
          <div style={{ display: 'flex', flexFlow: 'column', gap: '1.25rem' }}>
            <div className="stat-card" style={{ background: 'var(--bg-accent-subtle)', borderColor: '#bfdbfe' }}>
              <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                <Hash size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="stat-value" style={{ color: 'var(--primary)', fontSize: '1.8rem' }}>
                  {ledger.totalVerifications}
                </div>
                <div className="stat-label">Total Verified Zero-Knowledge Proofs On-Chain</div>
              </div>
              <span className="badge badge-blue">Verified Counter</span>
            </div>

            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <div className="data-row">
                <span className="data-label">
                  <Layers size={14} style={{ color: 'var(--primary)' }} /> Contract Deployment Address
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className="hash-pill">{ledger.contractAddress}</span>
                  <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }} onClick={() => copyToClipboard(ledger.contractAddress, 'Contract Address', setCopiedContract)}>
                    {copiedContract ? <Check size={12} style={{ color: 'var(--emerald)' }} /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              <div className="data-row">
                <span className="data-label">
                  <Key size={14} style={{ color: 'var(--emerald)' }} /> Health Authority Key Hash
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className="hash-pill">{ledger.authorityHash}</span>
                  <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }} onClick={() => copyToClipboard(ledger.authorityHash, 'Authority Key Hash', setCopiedAuthority)}>
                    {copiedAuthority ? <Check size={12} style={{ color: 'var(--emerald)' }} /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              <div className="data-row">
                <span className="data-label">
                  <ShieldCheck size={14} style={{ color: 'var(--teal)' }} /> Latest Disclosed ZK Nullifier
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className="hash-pill">{ledger.lastNullifier}</span>
                  <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }} onClick={() => copyToClipboard(ledger.lastNullifier, 'Nullifier Hash', setCopiedNullifier)}>
                    {copiedNullifier ? <Check size={12} style={{ color: 'var(--emerald)' }} /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Verification Log */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Recent Disclosed Nullifier Activity
              </div>
              <div style={{ display: 'flex', flexFlow: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="status-dot" style={{ color: 'var(--emerald)' }}></span>
                    <span className="hash-pill" style={{ fontSize: '0.72rem' }}>{ledger.lastNullifier.substring(0, 18)}...</span>
                  </div>
                  <span style={{ color: 'var(--text-tertiary)' }}>Just now</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="status-dot" style={{ color: 'var(--emerald)' }}></span>
                    <span className="hash-pill" style={{ fontSize: '0.72rem' }}>0x8a9b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b...</span>
                  </div>
                  <span style={{ color: 'var(--text-tertiary)' }}>14 mins ago</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="banner banner-info">Querying public ledger state from Midnight indexer...</div>
        )}
      </div>
    </div>
  );
};
