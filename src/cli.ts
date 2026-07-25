/**
 * CLI for interacting with private-vaccination-certificate contract
 */
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { WebSocket } from 'ws';
import { Buffer } from 'buffer';

// Midnight SDK imports
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { resolveNetwork, getOrCreateSeed, getDeployment } from './network';
import { createWallet, persistWalletState, unshieldedToken, type WalletContext } from './wallet';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';

// Enable WebSocket for GraphQL subscriptions
// @ts-expect-error Required for wallet sync
globalThis.WebSocket = WebSocket;

const PRIVATE_STATE_ID = 'vaccinationCertificatePrivateState';

const { network, config: networkConfig } = resolveNetwork();
const SEED = getOrCreateSeed(network);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const zkConfigPath = path.resolve(__dirname, '..', 'contracts', 'managed', 'vaccination-certificate');
const contractPath = path.join(zkConfigPath, 'contract', 'index.js');

if (!fs.existsSync(contractPath)) {
  console.error('\n❌ Contract not compiled! Run: npm run compile\n');
  process.exit(1);
}

const VaccinationCertificate = await import(pathToFileURL(contractPath).href);

const compiledContract = CompiledContract.make('vaccination-certificate', VaccinationCertificate.Contract).pipe(
  CompiledContract.withVacantWitnesses,
  CompiledContract.withCompiledFileAssets(zkConfigPath),
);

async function createProviders(walletCtx: WalletContext) {
  const privateStatePassword = process.env.PRIVATE_STATE_PASSWORD?.trim() || 'Local-Devnet-Development-Placeholder-1';

  const walletProvider = {
    getCoinPublicKey: () => walletCtx.shieldedSecretKeys.coinPublicKey,
    getEncryptionPublicKey: () => walletCtx.shieldedSecretKeys.encryptionPublicKey,
    async balanceTx(tx: any, ttl?: Date) {
      const recipe = await walletCtx.wallet.balanceUnboundTransaction(
        tx,
        { shieldedSecretKeys: walletCtx.shieldedSecretKeys, dustSecretKey: walletCtx.dustSecretKey },
        { ttl: ttl ?? new Date(Date.now() + 30 * 60 * 1000) },
      );
      return walletCtx.wallet.finalizeRecipe(recipe);
    },
    submitTx: (tx: any) => walletCtx.wallet.submitTransaction(tx) as any,
  };

  const zkConfigProvider = new NodeZkConfigProvider(zkConfigPath);
  const accountId = walletCtx.unshieldedKeystore.getBech32Address().toString();

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'vaccination-certificate-state',
      accountId,
      privateStoragePasswordProvider: () => privateStatePassword,
    }),
    publicDataProvider: indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(networkConfig.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider: walletProvider,
  };
}

function stringToBytes32(str: string): Uint8Array {
  const bytes = new Uint8Array(32);
  const encoded = Buffer.from(str, 'utf-8');
  bytes.set(encoded.subarray(0, 32));
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('hex');
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║       Private Vaccination Certificate dApp CLI               ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  const rl = createInterface({ input: stdin, output: stdout });

  const deployment = getDeployment(network);
  if (!deployment) {
    console.error(`No deploy on file for network ${network}. Run \`npm run setup -- --network ${network}\` first.`);
    process.exit(1);
  }
  console.log(`  Contract Address: ${deployment.address}`);
  console.log(`  Target Network:   ${network}\n`);

  try {
    const seed = SEED;

    console.log('  Connecting to wallet...');
    const walletCtx = await createWallet({ network, networkConfig, seed });
    const restoredCount = Object.values(walletCtx.restored).filter(Boolean).length;
    if (restoredCount > 0) {
      console.log(`  Restored ${restoredCount}/3 child wallets from saved state.`);
    }

    console.log('  Syncing with network...');
    const syncStart = Date.now();
    const syncInterval = setInterval(() => {
      const elapsed = Math.round((Date.now() - syncStart) / 1000);
      process.stdout.write(`\r  ⏳ Syncing... (${elapsed}s elapsed)   `);
    }, 5000);
    const state = await walletCtx.wallet.waitForSyncedState();
    clearInterval(syncInterval);
    process.stdout.write('\r  ✓ Synced with network.                                      \n');

    await persistWalletState(network, walletCtx);
    const balance = state.unshielded.balances[unshieldedToken().raw] ?? 0n;
    console.log(`  Wallet Balance: ${balance.toLocaleString()} tNight\n`);

    if (balance === 0n && network !== 'undeployed' && networkConfig.faucet) {
      const address = walletCtx.unshieldedKeystore.getBech32Address();
      console.log('  ⚠ Wallet has no tNight. Fund it from the faucet to send transactions:');
      console.log(`     ${networkConfig.faucet}`);
      console.log(`     Wallet address: ${address}\n`);
    }

    console.log('  Connecting to contract...');
    const providers = await createProviders(walletCtx);

    const deployed: any = await findDeployedContract(providers, {
      compiledContract: compiledContract as any,
      contractAddress: deployment.address,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {},
    });

    console.log('  ✅ Connected to Midnight Zero-Knowledge Contract!\n');

    let running = true;
    while (running) {
      console.log('─── Menu ───────────────────────────────────────────────────────');
      console.log('  1. Prove & Verify Vaccination Certificate (Zero-Knowledge)');
      console.log('  2. Set Authority Public Key');
      console.log('  3. Read On-Chain Public Ledger State');
      console.log('  4. Check Wallet Balance');
      console.log('  5. Exit\n');

      const choice = await rl.question('  Your choice: ');

      switch (choice.trim()) {
        case '1': {
          console.log('\n  --- Private Vaccination Proof Submission ---');
          const secretInput = await rl.question('  Enter Private Patient Secret / Salt (default: "PATIENT_SECRET_123"): ');
          const patientSecret = stringToBytes32(secretInput.trim() || 'PATIENT_SECRET_123');

          const dosesInput = await rl.question('  Enter Total Doses Received (default: 3): ');
          const doseCount = BigInt(dosesInput.trim() || '3');

          const vaccineTypeInput = await rl.question('  Enter Vaccine Code (101: COVID mRNA, 102: Booster, 201: Yellow Fever) (default: 101): ');
          const vaccineType = BigInt(vaccineTypeInput.trim() || '101');

          const expYearInput = await rl.question('  Enter Expiration Year (e.g. 2030) (default: 2030): ');
          const expYear = BigInt(expYearInput.trim() || '2030');

          const minDosesInput = await rl.question('  Enter Verifier Min Required Doses (default: 2): ');
          const minDoses = BigInt(minDosesInput.trim() || '2');

          const currentYear = BigInt(new Date().getFullYear());

          console.log('\n  Generating ZK proof & submitting transaction (30-60s)...');
          try {
            const tx = await deployed.callTx.verifyCertificate(
              patientSecret,
              doseCount,
              vaccineType,
              expYear,
              minDoses,
              currentYear
            );
            console.log(`\n  ✅ Certificate Verification Proved & Recorded On-Chain!`);
            console.log(`  Transaction ID: ${tx.public.txId}`);
            console.log(`  Block Height:   ${tx.public.blockHeight}`);
            console.log(`  Nullifier Hash: 0x${bytesToHex(tx.output)}\n`);
          } catch (error) {
            console.error('\n  ❌ Verification Failed:', error instanceof Error ? error.message : error);
          }
          break;
        }

        case '2': {
          const authInput = await rl.question('  Enter New Authority Name/ID (default: "WHO_AUTHORIZED_MINISTRY"): ');
          const newAuth = stringToBytes32(authInput.trim() || 'WHO_AUTHORIZED_MINISTRY');
          console.log('\n  Submitting authority update...');
          try {
            const tx = await deployed.callTx.setAuthority(newAuth);
            console.log(`\n  ✅ Authority Updated On-Chain!`);
            console.log(`  Transaction ID: ${tx.public.txId}`);
            console.log(`  Block Height:   ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error('\n  ❌ Update Failed:', error instanceof Error ? error.message : error);
          }
          break;
        }

        case '3': {
          console.log('\n  Fetching public ledger state from Midnight Indexer...');
          try {
            const contractState = await providers.publicDataProvider.queryContractState(deployment.address);
            if (contractState) {
              const ledgerState = VaccinationCertificate.ledger(contractState.data);
              console.log('\n  📋 --- Public Ledger State ---');
              console.log(`  Total Verifications: ${ledgerState.total_verifications}`);
              console.log(`  Authority ID Hash:   0x${bytesToHex(ledgerState.authority)}`);
              console.log(`  Last Nullifier Hash: 0x${bytesToHex(ledgerState.last_nullifier)}\n`);
            } else {
              console.log('\n  📋 Contract state is empty / uninitialized.\n');
            }
          } catch (error) {
            console.error('\n  ❌ Query Failed:', error instanceof Error ? error.message : error);
          }
          break;
        }

        case '4': {
          console.log('\n  Checking wallet balance...');
          const currentState = await walletCtx.wallet.waitForSyncedState();
          const currentBalance = currentState.unshielded.balances[unshieldedToken().raw] ?? 0n;
          const dustBalance = currentState.dust.balance(new Date());
          console.log(`\n  tNight: ${currentBalance.toLocaleString()}`);
          console.log(`  DUST:   ${dustBalance.toLocaleString()}\n`);
          break;
        }

        case '5':
          running = false;
          console.log('\n  👋 Goodbye!\n');
          break;

        default:
          console.log('\n  ❌ Invalid choice. Please enter 1-5.\n');
      }
    }

    await persistWalletState(network, walletCtx);
    await walletCtx.wallet.stop();
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
