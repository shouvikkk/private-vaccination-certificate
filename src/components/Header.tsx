import React from 'react';
import { ShieldCheck, Cpu } from 'lucide-react';
import { WalletState } from '../services/midnight';

interface HeaderProps {
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({ wallet, onConnect, onDisconnect }) => {
  return (
    <header className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <ShieldCheck size={26} />
        </div>
        <div>
          <div className="brand-title">Private Vaccination Certificate</div>
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '2px' }}>
            <span className="brand-tag">Midnight ZK</span>
            <span className="brand-tag" style={{ color: 'var(--accent-cyan)', borderColor: 'rgba(6,182,212,0.3)' }}>Confidential Credentials</span>
          </div>
        </div>
      </div>

      <div className="nav-actions">
        <div className="badge badge-network">
          <Cpu size={14} />
          Network: {wallet.network.toUpperCase()}
        </div>

        {wallet.isConnected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="badge badge-connected">
              <span className="dot"></span>
              {wallet.address?.substring(0, 14)}...{wallet.address?.substring(wallet.address.length - 6)}
            </div>
            <button className="btn btn-danger" onClick={onDisconnect} id="disconnect-wallet-btn">
              Disconnect
            </button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={onConnect} id="connect-wallet-btn">
            <ShieldCheck size={16} />
            Connect Lace Wallet
          </button>
        )}
      </div>
    </header>
  );
};
