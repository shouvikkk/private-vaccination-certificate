import { describe, it, expect } from 'vitest';
import { MidnightService } from '../src/services/midnight';

describe('Vaccination Certificate ZK Contract Logic', () => {
  const service = MidnightService.getInstance();

  it('should successfully verify when doses and expiration satisfy requirements', async () => {
    const res = await service.verifyCertificateCircuit({
      patientSecret: 'SECRET_SALT_123',
      doseCount: 3,
      vaccineCode: 101,
      expirationYear: 2030,
      minDosesRequired: 2,
    });

    expect(res.success).toBe(true);
    expect(res.nullifierHash).toMatch(/^0x[0-9a-f]{64}$/);
    expect(res.txId).toContain('tx_mid_');
    expect(res.blockHeight).toBeGreaterThan(0);
  });

  it('should fail ZK assertion when dose count is insufficient', async () => {
    await expect(
      service.verifyCertificateCircuit({
        patientSecret: 'SECRET_SALT_123',
        doseCount: 1,
        vaccineCode: 101,
        expirationYear: 2030,
        minDosesRequired: 2,
      })
    ).rejects.toThrow(/Insufficient doses/);
  });

  it('should fail ZK assertion when certificate is expired', async () => {
    await expect(
      service.verifyCertificateCircuit({
        patientSecret: 'SECRET_SALT_123',
        doseCount: 3,
        vaccineCode: 101,
        expirationYear: 2020,
        minDosesRequired: 2,
      })
    ).rejects.toThrow(/expired/);
  });

  it('should fail ZK assertion when vaccine code is invalid', async () => {
    await expect(
      service.verifyCertificateCircuit({
        patientSecret: 'SECRET_SALT_123',
        doseCount: 3,
        vaccineCode: 0,
        expirationYear: 2030,
        minDosesRequired: 2,
      })
    ).rejects.toThrow(/Invalid vaccine code/);
  });
});
