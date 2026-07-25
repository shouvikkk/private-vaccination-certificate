import React from 'react';
import { Eye, EyeOff, ShieldCheck, Cpu, Check, X, FileCode } from 'lucide-react';

export const PrivacyExplainer: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexFlow: 'column', gap: '1.75rem' }} id="privacy-architecture-container">
      {/* Overview Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-title-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="card-title">Confidential Credentials Architecture</div>
              <div className="card-subtitle">How Midnight Protocol protects sensitive medical data</div>
            </div>
          </div>
          <span className="badge badge-emerald">Zero-Knowledge Proofs</span>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Traditional health passes and digital certificates broadcast full patient identity details, exact medical history, clinic locations, and vaccination dates to verifiers or public blockchains.
          Midnight’s Compact programming language shifts verification into local private witness state—enabling patients to prove health criteria with absolute mathematical privacy.
        </p>

        {/* Side-by-side comparison */}
        <div className="grid-2">
          {/* Traditional Credentials */}
          <div style={{ background: '#fff5f5', border: '1px solid #fecdd3', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#991b1b', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
              <X size={18} /> Traditional Certificates (QR / Public Blockchain)
            </div>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#7f1d1d', display: 'flex', flexFlow: 'column', gap: '0.5rem' }}>
              <li style={{ display: 'flex', gap: '0.4rem' }}>
                <span style={{ color: '#e11d48', fontWeight: 'bold' }}>✕</span> Patient Legal Full Name & Date of Birth broadcasted.
              </li>
              <li style={{ display: 'flex', gap: '0.4rem' }}>
                <span style={{ color: '#e11d48', fontWeight: 'bold' }}>✕</span> Exact number of doses received (e.g. 3, 4) publicly readable.
              </li>
              <li style={{ display: 'flex', gap: '0.4rem' }}>
                <span style={{ color: '#e11d48', fontWeight: 'bold' }}>✕</span> Vaccine manufacturer name & batch/lot number exposed.
              </li>
              <li style={{ display: 'flex', gap: '0.4rem' }}>
                <span style={{ color: '#e11d48', fontWeight: 'bold' }}>✕</span> Medical facility name & treating physician identity revealed.
              </li>
              <li style={{ display: 'flex', gap: '0.4rem' }}>
                <span style={{ color: '#e11d48', fontWeight: 'bold' }}>✕</span> Verifier can build tracking profile of user visits.
              </li>
            </ul>
          </div>

          {/* Midnight ZK Credentials */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
              <Check size={18} /> Midnight ZK Confidential Credentials
            </div>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#14532d', display: 'flex', flexFlow: 'column', gap: '0.5rem' }}>
              <li style={{ display: 'flex', gap: '0.4rem' }}>
                <span style={{ color: '#059669', fontWeight: 'bold' }}>✓</span> 🔒 <strong>Zero Identity Data Leaked</strong>: Kept 100% in private witness.
              </li>
              <li style={{ display: 'flex', gap: '0.4rem' }}>
                <span style={{ color: '#059669', fontWeight: 'bold' }}>✓</span> 🔒 <strong>Exact Doses Hidden</strong>: Proves <code>doses &gt;= min_required</code> only.
              </li>
              <li style={{ display: 'flex', gap: '0.4rem' }}>
                <span style={{ color: '#059669', fontWeight: 'bold' }}>✓</span> 🔒 <strong>Vaccine Type Protected</strong>: Asserts code validity privately.
              </li>
              <li style={{ display: 'flex', gap: '0.4rem' }}>
                <span style={{ color: '#059669', fontWeight: 'bold' }}>✓</span> 🔒 <strong>No Medical History Exposure</strong>: Unexpired state proven by ZK SNARK.
              </li>
              <li style={{ display: 'flex', gap: '0.4rem' }}>
                <span style={{ color: '#059669', fontWeight: 'bold' }}>✓</span> 🌐 <strong>Non-Replayable Nullifier</strong>: Discloses single-use nullifier hash.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technical Code Visualizer */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-title-icon" style={{ background: 'var(--teal-light)', color: 'var(--teal)' }}>
              <FileCode size={20} />
            </div>
            <div>
              <div className="card-title">Compact Smart Contract Circuit Logic</div>
              <div className="card-subtitle">How <code>disclose()</code> enforces state boundary privacy</div>
            </div>
          </div>
          <span className="badge badge-subtle">contracts/vaccination-certificate.compact</span>
        </div>

        <div style={{ background: '#0f172a', color: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '0.825rem', lineHeight: 1.65, overflowX: 'auto' }}>
          <div style={{ color: '#94a3b8' }}>// Circuit executes inside patient's local private witness context</div>
          <div><span style={{ color: '#f43f5e' }}>export circuit</span> <span style={{ color: '#38bdf8' }}>verifyCertificate</span>(</div>
          <div style={{ paddingLeft: '1.5rem', color: '#fbbf24' }}>private_patient_secret: Bytes&lt;32&gt;,</div>
          <div style={{ paddingLeft: '1.5rem', color: '#fbbf24' }}>private_dose_count: Uint&lt;64&gt;,</div>
          <div style={{ paddingLeft: '1.5rem', color: '#fbbf24' }}>private_vaccine_type: Uint&lt;64&gt;,</div>
          <div style={{ paddingLeft: '1.5rem', color: '#fbbf24' }}>private_expiration_timestamp: Uint&lt;64&gt;,</div>
          <div style={{ paddingLeft: '1.5rem', color: '#a7f3d0' }}>min_doses_required: Uint&lt;64&gt;,</div>
          <div style={{ paddingLeft: '1.5rem', color: '#a7f3d0' }}>current_timestamp: Uint&lt;64&gt;</div>
          <div>): Bytes&lt;32&gt; &#123;</div>
          <div style={{ paddingLeft: '1.5rem', color: '#94a3b8' }}>// ZK assertions evaluate privately — error if rules are broken</div>
          <div style={{ paddingLeft: '1.5rem', color: '#34d399' }}>assert(private_dose_count &gt;= min_doses_required, "Insufficient doses");</div>
          <div style={{ paddingLeft: '1.5rem', color: '#34d399' }}>assert(private_expiration_timestamp &gt;= current_timestamp, "Certificate expired");</div>
          <div style={{ paddingLeft: '1.5rem', color: '#34d399' }}>assert(private_vaccine_type &gt; 0, "Invalid vaccine code");</div>
          <br />
          <div style={{ paddingLeft: '1.5rem', color: '#94a3b8' }}>// Increment public verification counter and disclose ONLY nullifier hash</div>
          <div style={{ paddingLeft: '1.5rem' }}>total_verifications = (total_verifications + 1) <span style={{ color: '#f43f5e' }}>as</span> Uint&lt;64&gt;;</div>
          <div style={{ paddingLeft: '1.5rem' }}>last_nullifier = <span style={{ color: '#f43f5e' }}>disclose</span>(persistentHash([private_patient_secret, pad(32, "VAC_CERT_V1")]));</div>
          <div style={{ paddingLeft: '1.5rem' }}><span style={{ color: '#f43f5e' }}>return</span> last_nullifier;</div>
          <div>&#125;</div>
        </div>
      </div>
    </div>
  );
};
