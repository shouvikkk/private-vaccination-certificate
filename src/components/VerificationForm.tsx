import React, { useState } from 'react';
import { Lock, FileCheck2, Loader2, AlertCircle, CheckCircle2, ShieldAlert, Cpu, EyeOff, Hash, Clock, Copy, Check } from 'lucide-react';
import { MidnightService, VerificationResult, WalletState } from '../services/midnight';

interface VerificationFormProps {
  wallet: WalletState;
  onSuccess: () => void;
  onToast: (title: string, message?: string) => void;
  initialSecret?: string;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
  wallet,
  onSuccess,
  onToast,
  initialSecret = 'SECRET_SALT_PATIENT_9821',
}) => {
  const [patientSecret, setPatientSecret] = useState(initialSecret);
  const [showSecret, setShowSecret] = useState(false);
  const [doseCount, setDoseCount] = useState<number>(3);
  const [vaccineCode, setVaccineCode] = useState<number>(101);
  const [expirationYear, setExpirationYear] = useState<number>(2030);
  const [minDosesRequired, setMinDosesRequired] = useState<number>(2);

  const [isLoading, setIsLoading] = useState(false);
  const [proofStep, setProofStep] = useState<number>(0);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedNullifier, setCopiedNullifier] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.isConnected) {
      setError('Please connect your Lace Wallet to submit zero-knowledge proof transactions to Midnight.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setProofStep(1); // 1. Witness Loading

    try {
      await new Promise((r) => setTimeout(r, 400));
      setProofStep(2); // 2. Circuit Assertions

      await new Promise((r) => setTimeout(r, 400));
      setProofStep(3); // 3. Proving ZK SNARK

      const midnight = MidnightService.getInstance();
      const res = await midnight.verifyCertificateCircuit({
        patientSecret,
        doseCount,
        vaccineCode,
        expirationYear,
        minDosesRequired,
      });

      setProofStep(4); // 4. Ledger Finality
      setResult(res);
      onSuccess();
      onToast('Proof Verified & Committed!', `Disclosed Nullifier: ${res.nullifierHash.substring(0, 14)}...`);
    } catch (err: any) {
      setError(err.message || 'Zero-Knowledge Circuit execution failed');
      onToast('Verification Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyNullifier = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedNullifier(true);
    onToast('Nullifier Copied!', 'ZK Nullifier hash copied to clipboard.');
    setTimeout(() => setCopiedNullifier(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexFlow: 'column', gap: '1.5rem' }} id="verification-form-container">
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-title-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Lock size={20} />
            </div>
            <div>
              <div className="card-title">Prove & Verify Vaccination Credential</div>
              <div className="card-subtitle">Execute Compact Zero-Knowledge Circuit Assertions</div>
            </div>
          </div>
          <span className="badge badge-emerald">
            <Cpu size={13} /> Midnight ZK Engine
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Witness Inputs Box */}
          <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--amber)', marginBottom: '0.75rem' }}>
              <EyeOff size={16} /> Private Witness Inputs (Never Disclosed On-Chain)
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="patientSecretFormInput">
                Patient Secret Salt / Private Witness Key
              </label>
              <input
                id="patientSecretFormInput"
                type={showSecret ? 'text' : 'password'}
                className="form-control"
                value={patientSecret}
                onChange={(e) => setPatientSecret(e.target.value)}
                placeholder="PATIENT_SECRET_KEY"
                required
              />
              <div className="form-hint">Used locally inside private witness state to calculate non-malleable ZK nullifier.</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="doseCountFormInput">
                  Doses Received
                </label>
                <input
                  id="doseCountFormInput"
                  type="number"
                  min="1"
                  max="10"
                  className="form-control"
                  value={doseCount}
                  onChange={(e) => setDoseCount(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="vaccineCodeFormSelect">
                  Vaccine Type Code
                </label>
                <select
                  id="vaccineCodeFormSelect"
                  className="form-control"
                  value={vaccineCode}
                  onChange={(e) => setVaccineCode(Number(e.target.value))}
                >
                  <option value={101}>101 - COVID-19 mRNA</option>
                  <option value={102}>102 - COVID Booster</option>
                  <option value={201}>201 - Yellow Fever</option>
                  <option value={301}>301 - Influenza</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="expirationYearFormInput">
                  Expiration Year
                </label>
                <input
                  id="expirationYearFormInput"
                  type="number"
                  className="form-control"
                  value={expirationYear}
                  onChange={(e) => setExpirationYear(Number(e.target.value))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Public Assertion Parameters */}
          <div style={{ background: 'var(--bg-accent-subtle)', border: '1px solid #bfdbfe', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>
              <Cpu size={16} /> Verifier Public Assertion Rule
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="minDosesRequiredFormInput">
                Verifier Required Minimum Doses (Public Rule)
              </label>
              <input
                id="minDosesRequiredFormInput"
                type="number"
                min="1"
                className="form-control"
                value={minDosesRequired}
                onChange={(e) => setMinDosesRequired(Number(e.target.value))}
                required
              />
              <div className="form-hint">
                Circuit checks <code>assert(private_dose_count &gt;= min_doses_required)</code> without exposing actual dose count!
              </div>
            </div>
          </div>

          {/* Execution Progress Stepper */}
          {isLoading && (
            <div style={{ marginBottom: '1.25rem', background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                <span>ZK Circuit Execution Progress</span>
                <span style={{ color: 'var(--primary)' }}>Step {proofStep}/4</span>
              </div>
              <div style={{ display: 'flex', gap: '4px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ flex: 1, background: proofStep >= 1 ? 'var(--primary)' : 'transparent', transition: 'all 0.3s' }}></div>
                <div style={{ flex: 1, background: proofStep >= 2 ? 'var(--primary)' : 'transparent', transition: 'all 0.3s' }}></div>
                <div style={{ flex: 1, background: proofStep >= 3 ? 'var(--primary)' : 'transparent', transition: 'all 0.3s' }}></div>
                <div style={{ flex: 1, background: proofStep >= 4 ? 'var(--emerald)' : 'transparent', transition: 'all 0.3s' }}></div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
            disabled={isLoading || !wallet.isConnected}
            id="submit-verification-btn"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="spin" />
                Executing Compact ZK Circuit...
              </>
            ) : (
              <>
                <FileCheck2 size={18} />
                Generate ZK Proof & Verify
              </>
            )}
          </button>
        </form>

        {/* Error Banner */}
        {error && (
          <div className="banner banner-error" id="circuit-error-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <AlertCircle size={18} />
              Circuit Assertion Failed
            </div>
            <div style={{ fontSize: '0.85rem' }}>{error}</div>
          </div>
        )}

        {/* Success Banner */}
        {result && (
          <div className="banner banner-success" id="circuit-success-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem', color: '#166534' }}>
              <CheckCircle2 size={20} style={{ color: '#166534' }} />
              Zero-Knowledge Verification Successful!
            </div>
            <div style={{ fontSize: '0.85rem', color: '#15803d', marginTop: '0.2rem' }}>
              The Compact circuit asserted eligibility (dose count ≥ {minDosesRequired}, unexpired) with <strong>zero personal medical data disclosed</strong>!
            </div>

            <div style={{ marginTop: '0.75rem', background: '#ffffff', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #bbf7d0' }}>
              <div className="data-row">
                <span className="data-label"><Hash size={14} /> Disclosed Nullifier Hash</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className="hash-pill">{result.nullifierHash}</span>
                  <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }} onClick={() => handleCopyNullifier(result.nullifierHash)}>
                    {copiedNullifier ? <Check size={12} style={{ color: 'var(--emerald)' }} /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
              <div className="data-row">
                <span className="data-label"><FileCheck2 size={14} /> Transaction ID</span>
                <span className="data-val" style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{result.txId}</span>
              </div>
              <div className="data-row">
                <span className="data-label"><Clock size={14} /> Block Height & Time</span>
                <span className="data-val">Block #{result.blockHeight} • {result.provedTimestamp}</span>
              </div>
            </div>
          </div>
        )}

        {!wallet.isConnected && (
          <div className="banner banner-info" style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <ShieldAlert size={18} />
              Wallet Connection Required
            </div>
            <div style={{ fontSize: '0.85rem' }}>
              Connect your Lace / Midnight wallet to sign ZK proof transactions to the blockchain ledger.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
