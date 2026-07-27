# MedVault ZK: Private Vaccination Certificate Platform

[![CI/CD Pipeline](https://github.com/shouvikkk/private-vaccination-certificate/actions/workflows/ci.yml/badge.svg)](https://github.com/shouvikkk/private-vaccination-certificate/actions/workflows/ci.yml)
[![Midnight Network](https://img.shields.io/badge/Midnight-Preprod-8A2BE2.svg)](https://midnight.network)
[![Compact Compiler](https://img.shields.io/badge/Compact-v0.31.1-blue.svg)](https://midnight.network)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Private Vaccination Certificate DApp** built on the **Midnight Network** utilizing **Compact** Zero-Knowledge Smart Contracts and **Confidential Credentials**.
>
> 📄 **Technical Proposal & Architecture Specification**: See [PROPOSAL.md](PROPOSAL.md) for full details.

---

## 📸 Platform Screenshots

### Dashboard & Network Overview
![MedVault ZK Landing Overview](docs/images/landing_page.png)

### ZK Proof Verification & Certificate Issuance
![MedVault ZK Certificate Issuance](docs/images/certification_page.png)

---

## 🔗 Contract Deployment Details

- **Contract Address**: `8116c5128f18c8d05d1101fabfb07b406991d2fc6a1dad00d667728818639e31`
- **Midnight Network**: `Midnight Preprod / Standalone Testnet`
- **Deployment Status**: `Deployed & Verified`
- **Block Explorer Link**: [Midnight Preprod Explorer](https://explorer.preprod.midnight.network/contract/8116c5128f18c8d05d1101fabfb07b406991d2fc6a1dad00d667728818639e31)
- **Deployment Method**: Compiled with `compact` v0.31.1 and deployed via Midnight SDK contract initialization (`npm run setup` / `npm run deploy`).

---

## 🧠 Witness Inputs

MedVault ZK operates on a zero-knowledge witness model implemented in `contracts/vaccination-certificate.compact`:

### 🔒 Private Witness Data (Off-Chain Client Memory)
- `private_patient_secret: Bytes<32>`: Secret salt identifying the patient credential holder.
- `private_dose_count: Uint<64>`: Total number of vaccination doses received.
- `private_vaccine_type: Uint<64>`: Numeric vaccine code (e.g., `101` for COVID-19 mRNA, `201` for Yellow Fever).
- `private_expiration_timestamp: Uint<64>`: Certificate expiration timestamp.

### 🌐 Public Inputs & Parameters (Verifier Provided)
- `min_doses_required: Uint<64>`: Minimum doses required by the verifier policy.
- `current_timestamp: Uint<64>`: Current verification timestamp.

### ⚡ Proof Generation & Circuit Assertions
The Compact circuit evaluates three zero-knowledge assertions locally:
1. `private_dose_count >= min_doses_required`: Verifies dose requirement compliance.
2. `private_expiration_timestamp >= current_timestamp`: Verifies certificate freshness.
3. `private_vaccine_type > 0`: Verifies valid vaccine registration.

### 📢 Public Ledger Commitments
- `total_verifications`: Counter incremented on the public ledger upon every valid proof submission.
- `last_nullifier`: Disclosed single-use hash generated via `persistentHash([private_patient_secret, pad(32, "VAC_CERT_V1")])` to prevent replay attacks.

---

## 🦊 Lace Wallet Integration

MedVault ZK integrates with the official **Midnight Lace Browser Extension** (`window.midnight.mnLace`):

- **Automatic Detection**: Detects installed Midnight Lace browser extension across standard window provider objects (`window.midnight.mnLace`, `window.midnight.lace`, `window.cardano.lace`).
- **Authentic Permission Flow**: Clicking **Connect Lace Wallet** invokes the native Lace authorization popup.
- **State & Account Display**: Displays connected wallet address and balance in the header navigation bar.
- **Session Persistence**: Persists wallet connection state across page reloads via local session storage.
- **Graceful Error Handling**: Provides user notifications if the Lace extension is missing or if connection is rejected.

---

## 🏛️ Architecture & Data Flow

```
+-------------------------------------------------------------------+
|                    PATIENT / HOLDER (CLIENT)                      |
|                                                                   |
|  Private Witness Data (Off-Chain):                                |
|  - Patient Secret (Bytes<32>)                                     |
|  - Dose Count & Expiration Year                                   |
+---------------------------------+---------------------------------+
                                  |
                                  | Local Circuit Evaluation
                                  v
+-------------------------------------------------------------------+
|                     COMPACT ZK CIRCUIT PROVER                     |
|                                                                   |
|  Executes Circuit Assertions Locally:                             |
|  - Verify dose count >= required minimum                          |
|  - Verify certificate is unexpired                                |
|  - Verify valid vaccine identifier                                |
+---------------------------------+---------------------------------+
                                  | Generates ZK Proof
                                  v
+-------------------------------------------------------------------+
|                     MIDNIGHT PUBLIC LEDGER                        |
|                                                                   |
|  Public State Updates:                                            |
|  - Increment total verifications counter                          |
|  - Record disclosed single-use nullifier hash                     |
+-------------------------------------------------------------------+
```

---

## 🛡️ Privacy Model

MedVault ZK operates on a strict privacy-first architecture:

- **What Remains Private**: Patient legal name, dose history, vaccine manufacturer, expiration timestamp, and personal keys stay 100% off-chain within client memory.
- **What Becomes Public**: Total verifications counter, authorized health authority public key hash, and single-use disclosed nullifier hashes.
- **Compact Confidential Execution**: Circuits run on-device, generating cryptographic proofs of eligibility while `disclose()` bounds the public state output.

---

## 📁 Repository Structure

```
private-vaccination-certificate/
├── .github/workflows/ci.yml         # GitHub Actions CI/CD pipeline
├── contracts/
│   ├── vaccination-certificate.compact # Compact smart contract
│   └── managed/                     # Generated ZK circuits & proving keys
├── docs/images/                     # Platform screenshots
├── scripts/e2e-check.ts              # End-to-end smoke test
├── src/
│   ├── components/                  # React UI components
│   │   ├── DashboardOverview.tsx    # Landing overview component
│   │   ├── Header.tsx               # Header and navigation
│   │   ├── IssueCertificateForm.tsx # Certificate issuance form
│   │   ├── LedgerStateCard.tsx      # On-chain state vault
│   │   ├── PrivacyExplainer.tsx     # Privacy documentation view
│   │   ├── Toast.tsx                # Notification system
│   │   └── VerificationForm.tsx     # ZK proof verifier
│   ├── services/midnight.ts         # Midnight integration service & Lace wallet
│   ├── App.tsx                      # Root application layout
│   ├── index.css                    # Design system styles
│   └── vite-env.d.ts                # TypeScript environment declarations
├── tests/                           # Vitest unit test suites
│   ├── contract.test.ts             # Contract logic unit tests
│   └── privacy.test.ts              # Privacy & nullifier unit tests
├── .env.example                     # Environment variable template
├── docker-compose.yml               # Local proof server & indexer services
├── package.json                     # Project dependencies and scripts
├── PROPOSAL.md                      # Architecture proposal document
├── README.md                        # Project documentation
└── vite.config.ts                   # Vite bundler configuration
```

---

## 🚀 Installation & Local Setup

### Prerequisites
- **Node.js**: v22.0.0 or higher
- **npm**: v10.0.0 or higher
- **Compact Compiler**: v0.31.1
- **Docker & Docker Compose** (for local proof server and indexer)

### Installation
```bash
git clone https://github.com/shouvikkk/private-vaccination-certificate.git
cd private-vaccination-certificate
npm install
```

### Running Locally

1. **Start Docker Proof Server & Indexer**:
   ```bash
   docker compose up -d
   ```

2. **Compile Smart Contracts**:
   ```bash
   npm run compile
   ```

3. **Start Development Web Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3001` in your browser.

---

## 🧪 Testing

Execute automated unit and integration tests:
```bash
npm test
```

---

## 🔄 CI/CD Pipeline

Continuous integration is configured via `.github/workflows/ci.yml`. On every push or pull request to `main`, the automated workflow:

1. Checks out repository code.
2. Configures Node.js 22.x environment.
3. Installs Compact compiler toolchain.
4. Installs Node dependencies (`npm ci`).
5. Compiles Compact smart contract circuits (`npm run compile`).
6. Runs Vitest unit test suite (`npm test`).
7. Builds production web bundle (`npm run build`).

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
