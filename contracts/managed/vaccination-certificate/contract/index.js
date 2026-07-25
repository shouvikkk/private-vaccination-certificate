import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_2 = new __compactRuntime.CompactTypeVector(2, _descriptor_0);

const _descriptor_3 = __compactRuntime.CompactTypeBoolean;

class _Either_0 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_3.fromValue(value_0),
      left: _descriptor_0.fromValue(value_0),
      right: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.is_left).concat(_descriptor_0.toValue(value_0.left).concat(_descriptor_0.toValue(value_0.right)));
  }
}

const _descriptor_4 = new _Either_0();

const _descriptor_5 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_6 = new _ContractAddress_0();

const _descriptor_7 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      setAuthority: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`setAuthority: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const new_authority_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('setAuthority',
                                     'argument 1 (as invoked from Typescript)',
                                     'vaccination-certificate.compact line 9 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(new_authority_0.buffer instanceof ArrayBuffer && new_authority_0.BYTES_PER_ELEMENT === 1 && new_authority_0.length === 32)) {
          __compactRuntime.typeError('setAuthority',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'vaccination-certificate.compact line 9 char 1',
                                     'Bytes<32>',
                                     new_authority_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(new_authority_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._setAuthority_0(context,
                                              partialProofData,
                                              new_authority_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      verifyCertificate: (...args_1) => {
        if (args_1.length !== 7) {
          throw new __compactRuntime.CompactError(`verifyCertificate: expected 7 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const private_patient_secret_0 = args_1[1];
        const private_dose_count_0 = args_1[2];
        const private_vaccine_type_0 = args_1[3];
        const private_expiration_timestamp_0 = args_1[4];
        const min_doses_required_0 = args_1[5];
        const current_timestamp_0 = args_1[6];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('verifyCertificate',
                                     'argument 1 (as invoked from Typescript)',
                                     'vaccination-certificate.compact line 13 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(private_patient_secret_0.buffer instanceof ArrayBuffer && private_patient_secret_0.BYTES_PER_ELEMENT === 1 && private_patient_secret_0.length === 32)) {
          __compactRuntime.typeError('verifyCertificate',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'vaccination-certificate.compact line 13 char 1',
                                     'Bytes<32>',
                                     private_patient_secret_0)
        }
        if (!(typeof(private_dose_count_0) === 'bigint' && private_dose_count_0 >= 0n && private_dose_count_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('verifyCertificate',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'vaccination-certificate.compact line 13 char 1',
                                     'Uint<0..18446744073709551616>',
                                     private_dose_count_0)
        }
        if (!(typeof(private_vaccine_type_0) === 'bigint' && private_vaccine_type_0 >= 0n && private_vaccine_type_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('verifyCertificate',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'vaccination-certificate.compact line 13 char 1',
                                     'Uint<0..18446744073709551616>',
                                     private_vaccine_type_0)
        }
        if (!(typeof(private_expiration_timestamp_0) === 'bigint' && private_expiration_timestamp_0 >= 0n && private_expiration_timestamp_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('verifyCertificate',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'vaccination-certificate.compact line 13 char 1',
                                     'Uint<0..18446744073709551616>',
                                     private_expiration_timestamp_0)
        }
        if (!(typeof(min_doses_required_0) === 'bigint' && min_doses_required_0 >= 0n && min_doses_required_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('verifyCertificate',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'vaccination-certificate.compact line 13 char 1',
                                     'Uint<0..18446744073709551616>',
                                     min_doses_required_0)
        }
        if (!(typeof(current_timestamp_0) === 'bigint' && current_timestamp_0 >= 0n && current_timestamp_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('verifyCertificate',
                                     'argument 6 (argument 7 as invoked from Typescript)',
                                     'vaccination-certificate.compact line 13 char 1',
                                     'Uint<0..18446744073709551616>',
                                     current_timestamp_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(private_patient_secret_0).concat(_descriptor_1.toValue(private_dose_count_0).concat(_descriptor_1.toValue(private_vaccine_type_0).concat(_descriptor_1.toValue(private_expiration_timestamp_0).concat(_descriptor_1.toValue(min_doses_required_0).concat(_descriptor_1.toValue(current_timestamp_0)))))),
            alignment: _descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment())))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._verifyCertificate_0(context,
                                                   partialProofData,
                                                   private_patient_secret_0,
                                                   private_dose_count_0,
                                                   private_vaccine_type_0,
                                                   private_expiration_timestamp_0,
                                                   min_doses_required_0,
                                                   current_timestamp_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      setAuthority: this.circuits.setAuthority,
      verifyCertificate: this.circuits.verifyCertificate
    };
    this.provableCircuits = {
      setAuthority: this.circuits.setAuthority,
      verifyCertificate: this.circuits.verifyCertificate
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('setAuthority', new __compactRuntime.ContractOperation());
    state_0.setOperation('verifyCertificate', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(1n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(2n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_2, value_0);
    return result_0;
  }
  _setAuthority_0(context, partialProofData, new_authority_0) {
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new_authority_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    return [];
  }
  _verifyCertificate_0(context,
                       partialProofData,
                       private_patient_secret_0,
                       private_dose_count_0,
                       private_vaccine_type_0,
                       private_expiration_timestamp_0,
                       min_doses_required_0,
                       current_timestamp_0)
  {
    __compactRuntime.assert(private_dose_count_0 >= min_doses_required_0,
                            'Insufficient doses for eligibility');
    __compactRuntime.assert(private_expiration_timestamp_0
                            >=
                            current_timestamp_0,
                            'Certificate has expired');
    __compactRuntime.assert(private_vaccine_type_0 > 0n, 'Invalid vaccine code');
    const tmp_0 = ((t1) => {
                    if (t1 > 18446744073709551615n) {
                      throw new __compactRuntime.CompactError('vaccination-certificate.compact line 25 char 27: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 18446744073709551615');
                    }
                    return t1;
                  })(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_7.toValue(1n),
                                                                                                           alignment: _descriptor_7.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value)
                     +
                     1n);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(1n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_1 = this._persistentHash_0([private_patient_secret_0,
                                          new Uint8Array([86, 65, 67, 95, 67, 69, 82, 84, 95, 86, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(2n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_7.toValue(2n),
                                                                                                 alignment: _descriptor_7.alignment() } }] } },
                                                                      { popeq: { cached: false,
                                                                                 result: undefined } }]).value);
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    get authority() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_7.toValue(0n),
                                                                                                   alignment: _descriptor_7.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get total_verifications() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_7.toValue(1n),
                                                                                                   alignment: _descriptor_7.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get last_nullifier() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_7.toValue(2n),
                                                                                                   alignment: _descriptor_7.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({ });
export const pureCircuits = {};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
