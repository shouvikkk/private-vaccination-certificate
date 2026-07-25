# MedVault ZK

> Private Vaccination Certificate Platform built on Midnight Protocol

[![CI/CD Pipeline](https://github.com/shouvikkk/private-vaccination-certificate/actions/workflows/ci.yml/badge.svg)](https://github.com/shouvikkk/private-vaccination-certificate/actions/workflows/ci.yml)
![Midnight Version](https://img.shields.io/badge/Midnight%20Compact-v0.31.1-blue)
![Node Version](https://img.shields.io/badge/Node.js-%3E%3D22.0.0-green)
![License](https://img.shields.io/badge/License-MIT-emerald)

---

## Project Overview

MedVault ZK is a confidential healthcare credentials platform designed to issue, store, and verify medical vaccination certificates with absolute data privacy. Powered by Midnight Protocol's Zero-Knowledge technology and the Compact programming language, MedVault ZK enables patients to prove medical compliance—such as meeting dose requirements and unexpired validity—without exposing legal names, medical histories, or vaccine manufacturers to verifiers or public blockchains.

---

## Landing Page

![MedVault ZK Landing Page](docs/images/landing_page.png)

> **Landing Page**: This is the main dashboard of the MedVault ZK Private Vaccination Certificate platform. Users can connect their wallet, monitor system status, issue private vaccination credentials, verify confidential certificates, and interact with Midnight's Zero-Knowledge infrastructure through a modern healthcare dashboard.

---

## Certification Page

![MedVault ZK Certification Page](docs/images/certification_page.png)

> **Certification Page**: This page allows authorised healthcare providers to issue confidential vaccination certificates. All sensitive patient information remains private through Midnight Protocol's confidential execution while generating secure Zero-Knowledge proofs for verification.

---

## Project Status

| Module | Status | Description |
| :--- | :--- | :--- |
| **Smart Contract** | ✅ Complete | Compact contract successfully implemented |
| **Frontend** | ✅ Complete | Responsive React application |
| **Wallet Integration** | ✅ Complete | Lace wallet connectivity available |
| **Local Deployment** | ✅ Complete | Successfully deployed on Midnight local devnet |
| **Testing** | ✅ Complete | Unit tests and end-to-end validation completed |
| **CI/CD** | ✅ Complete | GitHub Actions pipeline configured |
| **Documentation** | ✅ Complete | Complete setup guide and screenshots included |

The project has been validated in the local Midnight development environment. The smart contract compiles successfully, the frontend operates correctly, automated tests pass, and continuous integration verifies the repository on every push.

---

## Problem Statement

Legacy paper health passes, digital QR codes, and public blockchain registries expose sensitive patient information during verification:

- **Identity Exposure**: Standard QR codes broadcast full names, birth dates, and personal identification numbers to any scanner.
- **Unnecessary Medical Disclosure**: Verifiers gain access to exact dose counts, medical histories, clinic locations, and vaccine batch details—violating basic data minimization principles.
- **Tracking & Profiling**: Static credentials allow third parties to build location and visit histories across different venues.
- **Fraud & Forgery**: Paper passes are easily falsified, while public records lack privacy-preserving verification mechanisms.

---

## Solution Overview

MedVault ZK addresses these challenges using Midnight's confidential execution model:

- **Private Witness State**: Sensitive data (patient secrets, dose counts, vaccine types, expiration dates) remains strictly within local client storage.
- **On-Device Assertion Rules**: Compact smart contract circuits evaluate eligibility conditions locally (e.g. verifying that received doses meet minimum criteria and that the certificate is unexpired).
- **Cryptographic Nullifiers**: Midnight's `disclose()` operator generates a single-use nullifier hash. This hash proves that a valid certificate exists without revealing patient identity or underlying medical details.

---

## Key Features

- **Confidential Verification**: Prove vaccination compliance without exposing identity, dose counts, or vaccine brands.
- **Deterministic Nullifiers**: Prevent credential reuse and duplicate submissions while preserving patient anonymity.
- **Healthcare Provider Module**: Enable authorized providers to issue private credential records directly to patient client state.
- **Public Ledger Vault**: Monitor system metrics, total verification counts, and disclosed nullifiers through a real-time interface.
- **Healthcare Light Dashboard**: Clean, modern interface designed with custom CSS tokens, accessible typography, and smooth transitions.
- **Automated Validation**: Full automated test suite covering smart contract rules, privacy preservation, and application builds.

---

## Technology Stack

- **Smart Contract**: Compact (Midnight Protocol), ZKIR, proving keys
- **Frontend**: React 18, Vite 6, TypeScript 5, Lucide React
- **Protocol Tools**: Midnight JS SDK, standalone Proof Server, Indexer
- **Testing & CI**: Vitest, TypeScript compiler, GitHub Actions

---

## Architecture Overview

```
+-------------------------------------------------------------------+
|                        CLIENT WITNESS CONTEXT                     |
|                                                                   |
|  Private Witness Data (Off-Chain Only):                           |
|  - Patient secret key / salt                                      |
|  - Dose count & vaccine code                                      |
|  - Certificate expiration date                                    |
+---------------------------------+---------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                     COMPACT ZK CIRCUIT PROVER                     |
|                                                                   |
|  Executes Circuit Assertions Locally:                              |
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

## Project Workflow

1. **Credential Issuance**: A healthcare provider generates a private vaccination certificate containing a secret salt for the patient's local storage.
2. **Witness Loading**: When verification is requested, the patient's application loads private credential attributes into the local prover.
3. **Proof Generation**: The client executes the Compact circuit locally, constructing a zero-knowledge proof that all requirements are satisfied.
4. **On-Chain Settlement**: The ZK proof and disclosed nullifier hash are submitted to the Midnight network, updating public ledger state without revealing private data.

---

## Security & Privacy

MedVault ZK is built with privacy-first architecture principles:

- **Confidential Patient Data**: Personal medical attributes remain within the patient's local environment and are never transmitted to public servers or blockchains.
- **Midnight Confidential Execution**: ZK circuit assertions evaluate rules on-device, generating cryptographic proofs without disclosing underlying inputs.
- **Data Minimization**: Verifiers receive only boolean confirmation of eligibility alongside a cryptographic nullifier hash.
- **Clean Repository Practices**: All local environment secrets, deployment states, and temporary build outputs are excluded from version control.

---

## Smart Contract Overview

The smart contract (`contracts/vaccination-certificate.compact`) manages public state and verification logic:

- **Public Ledger State**: Tracks the authorized health authority key hash, total verifications counter, and the latest disclosed nullifier hash.
- **Circuits**:
  - `setAuthority`: Administrative circuit to update the authorized authority hash.
  - `verifyCertificate`: Core circuit evaluating dose count, expiration date, and vaccine code assertions, returning a disclosed nullifier hash.

---

## Frontend Overview

The web application consists of focused components:

- **Header**: Navigation bar with tab switching, network status badge, and wallet connectivity.
- **DashboardOverview**: Main landing view displaying platform statistics, system health, and quick actions.
- **IssueCertificateForm**: Form for healthcare providers to register private certificate records.
- **VerificationForm**: Verification interface featuring a step-by-step ZK proof progress indicator.
- **LedgerStateCard**: Interface for inspecting on-chain contract state and disclosed nullifier logs.
- **PrivacyExplainer**: Educational section detailing the privacy model and Compact `disclose()` logic.
- **Toast**: Interactive notification alerts for user actions and system status updates.

---

## Wallet Integration

MedVault ZK integrates with the **Lace Wallet** browser extension for Midnight Protocol, with support for standard Web3 providers:

- Detects active wallet extension instances on startup.
- Displays wallet connection status, truncated address strings, and balance metrics.
- Provides fallback connectivity for local testing and development.

---

## Repository Structure

```
private-vaccination-certificate/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI/CD pipeline
├── contracts/
│   ├── vaccination-certificate.compact  # Compact smart contract
│   └── managed/                   # Generated ZK circuits & proving keys
├── docs/
│   └── images/
│       ├── landing_page.png       # Dashboard screenshot
│       └── certification_page.png # Certification issuance screenshot
├── scripts/
│   └── e2e-check.ts               # End-to-end smoke test
├── src/
│   ├── components/
│   │   ├── DashboardOverview.tsx  # Main dashboard component
│   │   ├── Header.tsx             # Header and navigation
│   │   ├── IssueCertificateForm.tsx # Certificate issuance component
│   │   ├── LedgerStateCard.tsx    # On-chain state vault
│   │   ├── PrivacyExplainer.tsx   # Privacy documentation view
│   │   ├── Toast.tsx              # Notification system
│   │   └── VerificationForm.tsx   # ZK proof verifier
│   ├── services/
│   │   └── midnight.ts            # Midnight integration service
│   ├── App.tsx                    # Core application layout
│   ├── index.css                  # Design system styles
│   ├── main.tsx                   # React entry point
│   └── vite-env.d.ts              # TypeScript environment declarations
├── tests/
│   ├── contract.test.ts           # Contract logic unit tests
│   └── privacy.test.ts            # Privacy & nullifier unit tests
├── .env.example                   # Environment variable template
├── .gitignore                     # Git exclusion rules
├── docker-compose.yml             # Local proof server & indexer services
├── package.json                   # Project dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── vite.config.ts                 # Vite bundler configuration
```

---

## Local Development

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

### Compiling Smart Contracts
```bash
npm run compile
```

### Running Local Services & Deployment
```bash
# Start local proof server and indexer containers
docker compose up -d

# Deploy contract to local development network
npm run setup -- --network undeployed
```

### Running Tests
```bash
npm test
```

### Running Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### Building for Production
```bash
npm run build
```

---

## GitHub Actions CI/CD

Continuous integration is configured via `.github/workflows/ci.yml`. On every push or pull request to `main`, the automated pipeline:

1. Checks out repository code.
2. Sets up Node.js 22.x environment.
3. Installs the Compact compiler toolchain.
4. Installs project dependencies (`npm ci`).
5. Compiles Compact smart contract circuits (`npm run compile`).
6. Executes automated unit tests (`npm test`).
7. Validates TypeScript types and builds the production bundle (`npm run build`).

---

## Testing Summary

Automated testing is implemented with **Vitest**:

- **Contract Assertion Tests**: Validate that valid certificates pass verification while insufficient doses, expired dates, or invalid vaccine codes trigger circuit errors.
- **Privacy & Nullifier Tests**: Confirm that different patient secrets generate distinct cryptographic nullifiers and that successful proofs update public state.

Run the test suite locally with `npm test`.

---

## Future Enhancements

- **QR Code Verification**: Generate and scan offline QR codes containing zero-knowledge proof payloads.
- **Certificate Revocation**: Implement on-chain cryptographic accumulators to support credential revocation.
- **Multi-Authority Issuance**: Enable signature verification across multiple recognized health organizations.
- **Mobile Wallet Integration**: Support native mobile wallet extensions and biometric witness storage.
- **Provider Dashboard**: Expand healthcare provider tooling for batch certificate issuance and audit management.
- **Multi-Language Support**: Localize the user interface for international health credentials.

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
