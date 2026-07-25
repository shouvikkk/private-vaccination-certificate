import React, { useState, useEffect } from 'react';
import { PlusCircle, ShieldCheck, Lock, Copy, Check, Eye, EyeOff, FileText, User, Award, CheckCircle2 } from 'lucide-react';
import { MidnightService, IssuedCertificateRecord } from '../services/midnight';

interface IssueCertificateFormProps {
  onSuccessToast: (title: string, message?: string) => void;
  onNavigateToVerify: (secret: string) => void;
}

export const IssueCertificateForm: React.FC<IssueCertificateFormProps> = ({
  onSuccessToast,
  onNavigateToVerify,
}) => {
  const [patientName, setPatientName] = useState('Sarah Jenkins');
  const [patientSecret, setPatientSecret] = useState('SECRET_SALT_SARAH_8810');
  const [showSecret, setShowSecret] = useState(false);
  const [vaccineCode, setVaccineCode] = useState<number>(101);
  const [doseCount, setDoseCount] = useState<number>(3);
  const [expirationYear, setExpirationYear] = useState<number>(2030);
  const [issuingAuthority, setIssuingAuthority] = useState('WHO Authorized Ministry of Health');

  const [savedCerts, setSavedCerts] = useState<IssuedCertificateRecord[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const midnight = MidnightService.getInstance();

  useEffect(() => {
    setSavedCerts(midnight.fetchSavedCertificates());
  }, []);

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    const vaccineNames: Record<number, string> = {
      101: 'COVID-19 mRNA (Comirnaty)',
      102: 'COVID-19 Booster (Bivalent)',
      201: 'Yellow Fever Universal',
      301: 'Influenza Quadrivalent',
    };

    const newRecord = midnight.issueCertificateRecord({
      patientName,
      patientSecret,
      vaccineCode,
      vaccineName: vaccineNames[vaccineCode] || 'Custom Vaccine',
      doseCount,
      expirationYear,
      issuingAuthority,
    });

    setSavedCerts(midnight.fetchSavedCertificates());
    onSuccessToast(
      'Vaccination Certificate Issued!',
      `Created record ${newRecord.id} with private witness secret.`
    );
  };

  const handleCopySecret = (secret: string, id: string) => {
    navigator.clipboard.writeText(secret);
    setCopiedId(id);
    onSuccessToast('Secret Copied!', 'Private witness secret key copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexFlow: 'column', gap: '2rem' }} id="issue-certificate-container">
      <div className="grid-2">
        {/* Issuance Form */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-title-icon" style={{ background: 'var(--emerald-light)', color: 'var(--emerald)' }}>
                <PlusCircle size={20} />
              </div>
              <div>
                <div className="card-title">Issue Vaccination Credential</div>
                <div className="card-subtitle">Generate private witness record for Midnight ZK circuit</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleIssue}>
            <div className="form-group">
              <label className="form-label" htmlFor="patientNameInput">
                <User size={15} /> Patient Name (Local Display Only)
              </label>
              <input
                id="patientNameInput"
                type="text"
                className="form-control"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
              />
              <div className="form-hint">Stored strictly inside private client state — never written to chain.</div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="patientSecretInput">
                <Lock size={15} style={{ color: 'var(--amber)' }} /> Private Patient Secret Salt (Witness Key)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="patientSecretInput"
                  type={showSecret ? 'text' : 'password'}
                  className="form-control"
                  style={{ paddingRight: '2.5rem' }}
                  value={patientSecret}
                  onChange={(e) => setPatientSecret(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-tertiary)',
                    cursor: 'pointer',
                  }}
                >
                  {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="form-hint">Used as private secret input for Compact ZK nullifier calculation.</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="vaccineCodeSelect">
                  <FileText size={15} /> Vaccine Type
                </label>
                <select
                  id="vaccineCodeSelect"
                  className="form-control"
                  value={vaccineCode}
                  onChange={(e) => setVaccineCode(Number(e.target.value))}
                >
                  <option value={101}>101 - COVID-19 mRNA</option>
                  <option value={102}>102 - COVID-19 Booster</option>
                  <option value={201}>201 - Yellow Fever</option>
                  <option value={301}>301 - Influenza Universal</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="doseCountInput">
                  <Award size={15} /> Total Doses Received
                </label>
                <input
                  id="doseCountInput"
                  type="number"
                  min="1"
                  max="10"
                  className="form-control"
                  value={doseCount}
                  onChange={(e) => setDoseCount(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="expirationYearInput">
                  Certificate Expiration Year
                </label>
                <input
                  id="expirationYearInput"
                  type="number"
                  className="form-control"
                  value={expirationYear}
                  onChange={(e) => setExpirationYear(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="issuingAuthorityInput">
                  Issuing Health Authority
                </label>
                <input
                  id="issuingAuthorityInput"
                  type="text"
                  className="form-control"
                  value={issuingAuthority}
                  onChange={(e) => setIssuingAuthority(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-emerald" style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }} id="issue-submit-btn">
              <ShieldCheck size={18} />
              Issue Private Certificate Record
            </button>
          </form>
        </div>

        {/* Issued Records List */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-title-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                <FileText size={20} />
              </div>
              <div>
                <div className="card-title">Saved Certificate Records</div>
                <div className="card-subtitle">Local witness store ready for ZK verification</div>
              </div>
            </div>
            <span className="badge badge-subtle">{savedCerts.length} Records</span>
          </div>

          <div style={{ display: 'flex', flexFlow: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
            {savedCerts.map((cert) => (
              <div
                key={cert.id}
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  flexFlow: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {cert.patientName}
                  </span>
                  <span className="badge badge-emerald">{cert.id}</span>
                </div>

                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  <strong>{cert.vaccineName}</strong> • {cert.doseCount} Doses • Exp: {cert.expirationYear}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                    <Lock size={12} style={{ color: 'var(--amber)' }} />
                    Secret: <span className="hash-pill" style={{ fontSize: '0.72rem' }}>{cert.patientSecret.substring(0, 14)}...</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                      onClick={() => handleCopySecret(cert.patientSecret, cert.id)}
                      title="Copy Witness Secret"
                    >
                      {copiedId === cert.id ? <Check size={12} style={{ color: 'var(--emerald)' }} /> : <Copy size={12} />}
                      Copy
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                      onClick={() => onNavigateToVerify(cert.patientSecret)}
                    >
                      <CheckCircle2 size={12} />
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
