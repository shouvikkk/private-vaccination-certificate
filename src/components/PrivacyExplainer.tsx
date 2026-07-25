import React from 'react';
import { Eye, EyeOff, ShieldCheck, Cpu } from 'lucide-react';

export const PrivacyExplainer: React.FC = () => {
  return (
    <div className="card" style={{ marginTop: '2rem' }} id="privacy-explainer-card">
      <div className="card-title">
        <ShieldCheck size={22} />
        Zero-Knowledge Privacy Guarantee (Confidential Credentials)
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-rose)', fontWeight: 700, marginBottom: '0.75rem' }}>
            <EyeOff size={18} />
            100% Private (Kept Off-Chain / In Witness)
          </div>
          <ul className="privacy-list">
            <li className="private">Patient Secret Identity Salt & Secret Keys</li>
            <li className="private">Exact Number of Doses Received (e.g. 3, 4, booster details)</li>
            <li className="private">Specific Vaccine Type & Manufacturer (mRNA, Novavax, etc.)</li>
            <li className="private">Medical Facility Name & Doctor Information</li>
            <li className="private">Exact Date of Vaccination & Expiration Timestamp</li>
          </ul>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Eye size={18} />
            Disclosed On-Chain (Public Ledger)
          </div>
          <ul className="privacy-list">
            <li>Boolean Proof of Eligibility (Valid & Unexpired)</li>
            <li>Deterministic Unique ZK Nullifier Hash (Prevents replay)</li>
            <li>Total Verification Count Counter on Ledger</li>
            <li>Authority Identifier Public Hash</li>
          </ul>
        </div>
      </div>

      <div className="privacy-box">
        <div className="privacy-header">
          <Cpu size={18} />
          How Compact `disclose()` Protects Patient Privacy
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          In traditional blockchains, verifying medical credentials requires publishing sensitive patient data on-chain.
          Midnight’s Compact language executes zero-knowledge circuit assertions locally inside the user's browser/wallet.
          The contract uses <code>disclose()</code> only for the final proof verification status and nullifier hash.
          Observers on Midnight can verify that the holder satisfies health requirements without ever learning who they are or their medical history!
        </p>
      </div>
    </div>
  );
};
