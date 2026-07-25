# MedVault ZK

> Private Vaccination Certificate Platform built on Midnight Protocol

[![CI/CD Pipeline](https://github.com/shouvikkk/private-vaccination-certificate/actions/workflows/ci.yml/badge.svg)](https://github.com/shouvikkk/private-vaccination-certificate/actions/workflows/ci.yml)
![Midnight Version](https://img.shields.io/badge/Midnight%20Compact-v0.31.1-blue)
![Node Version](https://img.shields.io/badge/Node.js-%3E%3D22.0.0-green)
![License](https://img.shields.io/badge/License-MIT-emerald)

---

## Project Overview

MedVault ZK is a confidential healthcare credentials platform designed to issue, store, and verify medical vaccination certificates with absolute data privacy. Powered by Midnight Protocol's Zero-Knowledge technology and the Compact programming language, MedVault ZK enables patients to prove medical compliance—such as meeting minimum dose requirements and unexpired validity—without exposing legal names, medical histories, or vaccine manufacturers to verifiers or public blockchains.

---

## Application Preview

<p align="center">
  <img src="docs/images/landing_page.png" alt="Landing Page" width="100%" />
</p>

### Landing Page

The landing dashboard introduces the MedVault ZK Private Vaccination Certificate platform, providing healthcare administrators and users with a secure environment for issuing, managing, and verifying confidential vaccination credentials powered by Midnight Protocol.

<br />

<p align="center">
  <img src="docs/images/certification_page.png" alt="Certification Page" width="100%" />
</p>

### Certification Page

The certificate issuance interface enables authorised healthcare providers to securely create confidential vaccination certificates while protecting sensitive patient information through Zero-Knowledge technology and Midnight Protocol confidential execution.

---

# 🌐 Live Application

The application is deployed and publicly accessible. Explore the live MedVault ZK platform to experience confidential vaccination certificate issuance and verification powered by Midnight Protocol.

🚀 **Live Web Application:** [https://private-vaccination-certificate.vercel.app/](https://private-vaccination-certificate.vercel.app/)

### 🎥 Video Demonstration

Watch the complete demonstration of the MedVault ZK Private Vaccination Certificate platform, showcasing certificate issuance, confidential verification, wallet integration, and Midnight Protocol Zero-Knowledge workflows:

▶ **[Watch the complete project demonstration on YouTube](https://youtu.be/PM3jLemgOpg)**

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
- **On-Device Assertion Rules**: Compact smart contract circuits evaluate eligibility conditions locally (e.g., verifying that received doses meet minimum criteria and that the certificate is unexpired).
- **Cryptographic Nullifiers**: Midnight's `disclose()` operator generates a single-use nullifier hash. This hash proves that a valid certificate exists without revealing patient identity or underlying medical details.

---

## Key Features

- **Confidential Vaccination Certificate Issuance**: Enable healthcare providers to issue tamper-evident credentials directly into patient witness storage.
- **Zero-Knowledge Verification**: Execute local proof circuits that assert dose and expiration criteria without leaking medical data.
- **Midnight Protocol Confidential Execution**: Leverage Midnight's dual-state engine to decouple public ledger state from private witness attributes.
- **Compact Smart Contracts**: Enforce business rules and nullifier tracking using compiled Compact ZK circuits.
- **Lace Wallet Integration**: Connect seamlessly with the Lace Wallet browser extension for signing ZK transactions on-chain.
- **Secure Healthcare Credential Management**: Store and manage witness records locally with instant copy and verification controls.
- **Privacy-Preserving Verification**: Disclose only boolean verification results and single-use cryptographic nullifier hashes.
- **Responsive React Frontend**: Monitor platform metrics, system health, and verification logs across desktop, tablet, and mobile devices.

---

## Technology Stack

- **Smart Contract**: Compact (Midnight Protocol), ZKIR, proving keys
- **Frontend**: React 18, Vite 6, TypeScript 5, Lucide React
- **Protocol Tools**: Midnight JS SDK, standalone Proof Server, Indexer
- **Testing & CI**: Vitest, TypeScript compiler, GitHub Actions

---

## Architecture

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

## Privacy Model

MedVault ZK operates on a strict privacy-first architecture:

- **What Remains Private**: Patient legal name, dose history, vaccine manufacturer, expiration timestamp, and personal keys stay 100% off-chain within client memory.
- **What Becomes Public**: Total verifications counter, authorized health authority public key hash, and single-use disclosed nullifier hashes.
- **Compact Confidential Execution**: Circuits run on-device, generating cryptographic proofs of eligibility while `disclose()` bounds the public state output.

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
├── LICENSE                        # MIT License
├── docker-compose.yml             # Local proof server & indexer services
├── package.json                   # Project dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── vite.config.ts                 # Vite bundler configuration
```

---

## Installation

### Prerequisites
- **Node.js**: v22.0.0 or higher
- **npm**: v10.0.0 or higher
- **Compact Compiler**: v0.31.1
- **Docker & Docker Compose** (for local proof server and indexer)

```bash
git clone https://github.com/shouvikkk/private-vaccination-certificate.git
cd private-vaccination-certificate
npm install
```

---

## Running Locally

### Compiling Smart Contracts
```bash
npm run compile
```

### Starting Local Environment & Server
```bash
# Start local proof server and indexer containers
docker compose up -d

# Deploy contract to local development network
npm run setup -- --network undeployed

# Start development web server
npm run dev
```
Open `http://localhost:3000` in your web browser.

### Building for Production
```bash
npm run build
```

---

## Testing

Execute unit and integration test suites:
```bash
npm test
```

---

## CI/CD

Continuous integration is configured via `.github/workflows/ci.yml`. On every push or pull request to `main`, the automated pipeline:

1. Checks out repository code.
2. Sets up Node.js 22.x environment.
3. Installs the Compact compiler toolchain.
4. Installs project dependencies (`npm ci`).
5. Compiles Compact smart contract circuits (`npm run compile`).
6. Executes automated unit tests (`npm test`).
7. Validates TypeScript types and builds the production bundle (`npm run build`).

---

## Security & Privacy

MedVault ZK is built with privacy-first architecture principles:

- **Confidential Patient Data**: Personal medical attributes remain within the patient's local environment and are never transmitted to public servers or blockchains.
- **Midnight Confidential Execution**: ZK circuit assertions evaluate rules on-device, generating cryptographic proofs without disclosing underlying inputs.
- **Data Minimization**: Verifiers receive only boolean confirmation of eligibility alongside a cryptographic nullifier hash.
- **Clean Repository Practices**: All local environment secrets, deployment states, and temporary build outputs are excluded from version control.

---

## Future Enhancements

- **QR Code Verification**: Generate and scan offline QR codes containing zero-knowledge proof payloads.
- **Certificate Revocation**: Implement on-chain cryptographic accumulators to support credential revocation.
- **Mobile Wallet Compatibility**: Support native mobile wallet extensions and biometric witness storage.
- **National Healthcare Integration**: Connect with international healthcare registry APIs and standards.
- **Multi-Language Support**: Localize the user interface for global healthcare deployments.

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
