import React, { useState } from 'react';
import { Lock, FileCheck2, Loader2, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { MidnightService, VerificationResult, WalletState } from '../services/midnight';

interface VerificationFormProps {
  wallet: WalletState;
  onSuccess: () => void;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({ wallet, onSuccess }) => {
  const [patientSecret, setPatientSecret] = useState('SECRET_SALT_PATIENT_9821');
  const [doseCount, setDoseCount] = useState<number>(3);
  const [vaccineCode, setVaccineCode] = useState<number>(101);
  const [expirationYear, setExpirationYear] = useState<number>(2030);
  const [minDosesRequired, setMinDosesRequired] = useState<number>(2);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.isConnected) {
      setError('Please connect your Lace / Midnight wallet before generating zero-knowledge proofs.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const midnight = MidnightService.getInstance();
      const res = await midnight.verifyCertificateCircuit({
        patientSecret,
        doseCount,
        vaccineCode,
        expirationYear,
        minDosesRequired,
      });

      setResult(res);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Circuit execution failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card" id="verification-form-card">
      <div className="card-title">
        <Lock size={22} />
        Prove & Verify Certificate (ZK Circuit)
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="patientSecretInput">
            🔒 Private Patient Secret Key / Identity Salt
          </label>
          <input
            id="patientSecretInput"
            type="password"
            className="form-input"
            value={patientSecret}
            onChange={(e) => setPatientSecret(e.target.value)}
            placeholder="e.g. SECRET_KEY_OR_PASSPORT_SALT"
            required
          />
          <div className="form-hint">
            Stored in private witness state only — NEVER broadcasted to chain or verifiers.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="doseCountInput">
              🔒 Total Doses Received
            </label>
            <input
              id="doseCountInput"
              type="number"
              min="1"
              max="10"
              className="form-input"
              value={doseCount}
              onChange={(e) => setDoseCount(Number(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="vaccineCodeSelect">
              🔒 Vaccine Identifier Code
            </label>
            <select
              id="vaccineCodeSelect"
              className="form-select"
              value={vaccineCode}
              onChange={(e) => setVaccineCode(Number(e.target.value))}
            >
              <option value={101}>101 - COVID-19 mRNA</option>
              <option value={102}>102 - COVID-19 Booster</option>
              <option value={201}>201 - Yellow Fever</option>
              <option value={301}>301 - Influenza Universal</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="expirationYearInput">
              🔒 Certificate Expiration Year
            </label>
            <input
              id="expirationYearInput"
              type="number"
              className="form-input"
              value={expirationYear}
              onChange={(e) => setExpirationYear(Number(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="minDosesRequiredInput">
              🌐 Verifier Required Min Doses (Public)
            </label>
            <input
              id="minDosesRequiredInput"
              type="number"
              min="1"
              className="form-input"
              value={minDosesRequired}
              onChange={(e) => setMinDosesRequired(Number(e.target.value))}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}
          disabled={isLoading || !wallet.isConnected}
          id="submit-proof-btn"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              Generating Zero-Knowledge Proof...
            </>
          ) : (
            <>
              <FileCheck2 size={18} />
              Execute ZK Circuit & Submit Proof
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="banner banner-error" id="circuit-error-banner">
          <div className="banner-title">
            <AlertCircle size={18} />
            Verification Assert Failed
          </div>
          <div>{error}</div>
        </div>
      )}

      {result && (
        <div className="banner banner-success" id="circuit-success-banner">
          <div className="banner-title">
            <CheckCircle2 size={18} />
            ZK Certificate Verification Successful!
          </div>
          <div style={{ fontSize: '0.85rem' }}>
            The Compact circuit confirmed eligibility (doses ≥ {minDosesRequired}, unexpired) without disclosing personal data!
          </div>
          <div className="data-row" style={{ marginTop: '0.5rem' }}>
            <span className="data-key">Disclosed Nullifier:</span>
            <span className="mono-hash">{result.nullifierHash}</span>
          </div>
          <div className="data-row">
            <span className="data-key">Transaction ID:</span>
            <span className="data-val" style={{ fontSize: '0.8rem' }}>{result.txId}</span>
          </div>
          <div className="data-row">
            <span className="data-key">Block Height:</span>
            <span className="data-val">{result.blockHeight}</span>
          </div>
        </div>
      )}

      {!wallet.isConnected && (
        <div className="banner banner-info" style={{ marginTop: '1rem' }}>
          <div className="banner-title">
            <ShieldAlert size={18} />
            Wallet Disconnected
          </div>
          <div style={{ fontSize: '0.85rem' }}>
            Connect your Midnight wallet to submit transactions to the ledger.
          </div>
        </div>
      )}
    </div>
  );
};
