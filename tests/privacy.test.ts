import { describe, it, expect } from 'vitest';
import { MidnightService } from '../src/services/midnight';

describe('Confidential Credentials & Privacy Model', () => {
  const service = MidnightService.getInstance();

  it('should generate different nullifiers for different patient secrets', async () => {
    const res1 = await service.verifyCertificateCircuit({
      patientSecret: 'PATIENT_A_SECRET',
      doseCount: 3,
      vaccineCode: 101,
      expirationYear: 2030,
      minDosesRequired: 2,
    });

    const res2 = await service.verifyCertificateCircuit({
      patientSecret: 'PATIENT_B_SECRET',
      doseCount: 3,
      vaccineCode: 101,
      expirationYear: 2030,
      minDosesRequired: 2,
    });

    expect(res1.nullifierHash).not.toBe(res2.nullifierHash);
  });

  it('should increment public verification counter on ledger state upon successful proof', async () => {
    const initialLedger = await service.fetchLedgerState();
    const countBefore = initialLedger.totalVerifications;

    await service.verifyCertificateCircuit({
      patientSecret: 'PATIENT_VERIFY_TEST',
      doseCount: 2,
      vaccineCode: 101,
      expirationYear: 2030,
      minDosesRequired: 2,
    });

    const updatedLedger = await service.fetchLedgerState();
    expect(updatedLedger.totalVerifications).toBe(countBefore + 1);
  });
});
