import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  setAuthority(context: __compactRuntime.CircuitContext<PS>,
               new_authority_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verifyCertificate(context: __compactRuntime.CircuitContext<PS>,
                    private_patient_secret_0: Uint8Array,
                    private_dose_count_0: bigint,
                    private_vaccine_type_0: bigint,
                    private_expiration_timestamp_0: bigint,
                    min_doses_required_0: bigint,
                    current_timestamp_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
}

export type ProvableCircuits<PS> = {
  setAuthority(context: __compactRuntime.CircuitContext<PS>,
               new_authority_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verifyCertificate(context: __compactRuntime.CircuitContext<PS>,
                    private_patient_secret_0: Uint8Array,
                    private_dose_count_0: bigint,
                    private_vaccine_type_0: bigint,
                    private_expiration_timestamp_0: bigint,
                    min_doses_required_0: bigint,
                    current_timestamp_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  setAuthority(context: __compactRuntime.CircuitContext<PS>,
               new_authority_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verifyCertificate(context: __compactRuntime.CircuitContext<PS>,
                    private_patient_secret_0: Uint8Array,
                    private_dose_count_0: bigint,
                    private_vaccine_type_0: bigint,
                    private_expiration_timestamp_0: bigint,
                    min_doses_required_0: bigint,
                    current_timestamp_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
}

export type Ledger = {
  readonly authority: Uint8Array;
  readonly total_verifications: bigint;
  readonly last_nullifier: Uint8Array;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
