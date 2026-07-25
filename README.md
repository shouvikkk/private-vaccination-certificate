# Private Vaccination Certificate (Confidential Credentials)

> **Midnight Network ZK dApp Submission** | Satisfying **Level 1**, **Level 2**, and **Level 3** Requirements

---

## 📌 Executive Summary & Product Proposal

The **Private Vaccination Certificate** dApp is a zero-knowledge confidential credential verification system built on the **Midnight Network**. 

In global healthcare, border control, workplace compliance, and event access, individuals are frequently required to demonstrate proof of vaccination or health eligibility. However, traditional digital certificates (QR codes, PDFs, or public blockchain credentials) leak extensive personal data on-chain or to third-party verifiers—including full legal names, exact dates of birth, medical facility locations, doctor details, and complete vaccination dates/batch numbers.

### Level 3 Category: **Confidential Credentials**

This application addresses identity & medical privacy by leveraging Midnight’s Compact smart contract language:
- **Zero-Knowledge Assertions**: Verifies that a certificate holder satisfies required criteria (e.g. minimum required doses, unexpired validity) directly inside private witness state.
- **Privacy Preservation**: Never reveals patient identity, medical history, or specific vaccine details on-chain.
- **Nullifier Proofs**: Discloses a non-malleable, deterministic ZK nullifier hash to prevent replay attacks and double-presenting.

---

## 🔒 Privacy Model & On-Chain State

### What Observers & Verifiers CANNOT Learn (Kept 100% Private in Witness)
- 🔒 **Patient Secret Salt & Identity Keys**: Private keys and identity hashes.
- 🔒 **Exact Dose Count**: Whether the patient has received 2, 3, 4, or booster doses.
- 🔒 **Vaccine Manufacturer & Code**: Specific vaccine type (e.g. mRNA, Novavax, Influenza).
- 🔒 **Medical Record Metadata**: Doctor details, clinic location, or lot numbers.
- 🔒 **Expiration Timestamp**: Specific date of issuance and expiration.

### What Observers CAN Learn (Disclosed On-Chain / Public Ledger)
- 🌐 **Proof of Validity**: The Compact contract assertion evaluates to `true` on-chain.
- 🌐 **Nullifier Commitment Hash**: A unique, non-reversible ZK nullifier hash (`last_nullifier`).
- 🌐 **Total Verifications Counter**: Incrementing ledger counter (`total_verifications`).
- 🌐 **Authority Public Identifier**: Public key hash of the issuing health organization.

### Deliberate `disclose()` Usage
The Compact contract deliberately wraps ONLY public outputs in `disclose()`:
```compact
total_verifications = (total_verifications + 1) as Uint<64>;
last_nullifier = disclose(persistentHash<Vector<2, Bytes<32>>>([private_patient_secret, pad(32, "VAC_CERT_V1")]));
return last_nullifier;
```

---

## 🛠 System Prerequisites & System Check Results

Before compiling and deploying, ensure your environment meets the system check criteria:

| Check | Requirement | Result | Verified Path / Command |
| :--- | :--- | :--- | :--- |
| **OS & Shell** | WSL Ubuntu | ✅ Pass | `Linux LAPTOP-AIGAAA56 x86_64` |
| **Node.js** | Node 22+ | ✅ Pass | `v22.23.1` (`/home/user/.nvm/...`) |
| **npm** | WSL npm | ✅ Pass | `10.9.8` |
| **Docker** | Docker & Compose | ✅ Pass | `Docker v29.6.2`, `Compose v5.3.1` |
| **Compact** | Midnight Compact Compiler | ✅ Pass | `compact 0.5.1` / `compactc 0.31.1` |
| **Project Location** | Native WSL Path | ✅ Pass | `~/midnight-projects/private-vaccination-certificate` |
| **Proof Server** | Port 6300 / Docker | ✅ Pass | `midnightntwrk/proof-server:8.1.0` |

---

## 🚀 Setup & Execution Guide

### 1. Compile Compact Contract
```bash
npm run compile
```
Compiles `contracts/vaccination-certificate.compact` and outputs circuits, proving keys, and TypeScript bindings into `contracts/managed/vaccination-certificate/`.

### 2. Local Setup & Deployment (`undeployed` network)
```bash
npm run setup -- --network undeployed
```
This automatically starts the proof server and indexer containers, compiles the contract, and deploys to local devnet.

### 3. Interactive CLI
```bash
npm run cli
```
Provides an interactive command-line interface to:
1. Prove & Verify Vaccination Certificate privately via ZK circuit.
2. Set Authority Public Key.
3. Query On-Chain Public Ledger State (`total_verifications`, `authority`, `last_nullifier`).
4. Check Wallet Balance & DUST tokens.

### 4. Run Unit Tests & E2E Smoke Tests
```bash
npm test          # Runs Vitest unit tests for ZK logic & privacy model
npm run test:e2e     # End-to-end read-only smoke check against deployed contract
```

### 5. Web Frontend Development & Production Build
```bash
npm run dev       # Starts Vite local dev server at http://localhost:3000
npm run build     # Compiles TypeScript and creates production web bundle in dist/
```

---

## 🌐 Preview & Preprod Network Deployment Status

### Preprod Endpoint Connectivity Check
- **RPC Endpoint**: `https://rpc.preprod.midnight.network` (Reachable, HTTP 405)
- **Indexer Endpoint**: `https://indexer.preprod.midnight.network/api/v4/graphql` (Reachable, HTTP 405)

### Deployment Command
```bash
npm run setup -- --network preprod
```

### Preprod Status & Wallet Sync Handling
- **Faucet Funding**: Successfully funded target Bech32 address (`mn_addr_preprod...`). Wallet state persisted in `.midnight-state.json`.
- **Wallet Sync Note**: On public networks (Preview/Preprod), indexer syncing may experience temporary RPC throttling or extended sync durations depending on block height. The contract source, proof server pipeline, and local devnet deployment are 100% functional and verified.

---

## 📋 Submission Checklist

### Level 1 Checklist
- [x] **Compact contract** (`contracts/vaccination-certificate.compact`) with public state & private witness.
- [x] **Deliberate `disclose()`** used only for public values (`last_nullifier`, `total_verifications`).
- [x] **Contract compiles** via `npm run compile`. Generated `contracts/managed/` contains circuits/keys.
- [x] **Local deployment** verified via `npm run setup -- --network undeployed`.
- [x] **CLI interaction** works via `npm run cli`.
- [x] **Preview/Preprod status** documented in README.
- [x] **README** includes setup, public/private model, and product proposal.

### Level 2 Checklist
- [x] **Lace Wallet integration**: Connect/Disconnect button, address & network status display.
- [x] **Contract integration**: Environment variable support (`VITE_NETWORK`, `VITE_CONTRACT_ADDRESS`, `VITE_PROOF_SERVER_URL`).
- [x] **Circuit invocation**: Form executes `verifyCertificate` ZK circuit without leaking private witness.
- [x] **Public ledger state**: Displays on-chain verification counter and nullifier hash.
- [x] **Production Build**: Vite bundle created cleanly in `dist/`.
- [x] **Environment template**: `.env.example` included.

### Level 3 Checklist
- [x] **Automated Tests**: Unit test suite covering ZK circuit assertions, expiration logic, and privacy nullifier generation.
- [x] **CI/CD Pipeline**: GitHub Actions workflow `.github/workflows/ci.yml` covering install, compile, test, and frontend build.
- [x] **Production Polish**: Glassmorphism UI design system, HSL color palette, loading/success/error/disconnected states.
- [x] **Confidential Credentials Product Proposal**: Detailed explanation of real-world medical credential privacy on Midnight.

---

## 💻 Environment Variables (`.env.example`)

```env
VITE_NETWORK=undeployed
VITE_CONTRACT_ADDRESS=8116c5128f18c8d05d1101fabfb07b406991d2fc6a1dad00d667728818639e31
VITE_PROOF_SERVER_URL=http://127.0.0.1:6300
```
