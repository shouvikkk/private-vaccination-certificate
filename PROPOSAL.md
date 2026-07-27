# Architecture Proposal: MedVault ZK — Private Vaccination Certificate Platform

## 📋 Executive Summary

**MedVault ZK** is a privacy-preserving healthcare credential verification system built on the **Midnight Network**. Leveraging Midnight's native Zero-Knowledge (ZK) smart contract language, **Compact**, MedVault ZK enables individuals to cryptographically prove their vaccination status, dose compliance, and certificate validity to verifiers (such as border control, employers, or event venues) without revealing sensitive medical history, identity secrets, or personal data.

By storing private witness data strictly within client-side memory and publishing only non-malleable, single-use cryptographic nullifier hashes to the Midnight public ledger, MedVault ZK establishes a paradigm shift in healthcare data sovereignty.

---

## 🚨 Problem Statement

Traditional vaccination certificate verification systems suffer from critical privacy and security vulnerabilities:

1. **Over-Disclosure of Personal Data**: Presenting physical or digital COVID-19/vaccination cards exposes full legal names, dates of birth, medical clinic identifiers, lot numbers, and complete vaccination history to third-party verifiers.
2. **Centralized Surveillance & Data Harvesting**: Centralized QR-code verification portals log patient locations, verification timestamps, and identity credentials, creating massive surveillance risks and target databases for cyberattacks.
3. **Fraud & Forgery**: Paper credentials and static digital PDFs can be easily forged or altered, undermining public health compliance and trust.

---

## 🎯 Motivation

Modern healthcare infrastructure urgently requires a verification architecture that balances **public health verification necessity** with **individual privacy rights**. Zero-Knowledge Proof (ZKP) technology on the Midnight Network makes it mathematically possible to prove that a statement is true (e.g., *"This patient has received at least 2 valid doses of an approved vaccine and the certificate is unexpired"*) without revealing any of the underlying evidence or patient identity.

---

## 🚧 Existing Challenges

- **Blockchain Transparency Conflict**: Public blockchains (such as Ethereum or Cardano) make all state transitions public by default, making them unsuitable for sensitive HIPAA/GDPR-regulated medical data.
- **Complex ZK Tooling**: Writing custom ZK circuits in low-level languages (Circom, Halo2) requires deep domain cryptography expertise and produces error-prone integration code.
- **Wallet & Prover Integration**: Bridging browser extension wallets with client-side ZK proof generation engines requires seamless DApp connector standards.

---

## 💡 Proposed Solution

MedVault ZK solves these challenges by combining:
1. **Compact ZK Smart Contracts**: Defining structured private witness inputs and public state transitions using Midnight's Compact language.
2. **Client-Side Proof Generation**: Compiling ZK circuits locally using the Midnight Proof Server so private data never leaves the user's browser.
3. **Disclosed Nullifier State**: Utilizing Compact's `disclose()` mechanism to emit single-use nullifiers to the ledger, preventing double-verification replay attacks while maintaining total anonymity.
4. **Lace Wallet Integration**: Seamless authentication and transaction signing via the official Midnight Lace browser extension.

---

## 🏹 Objectives

- **Zero Data Leakage**: Enforce 0% leakage of patient identity, dose count, or expiration dates during verification.
- **Deterministic Verification**: Provide sub-second verification feedback for valid credential holders.
- **Replay Protection**: Implement deterministic nullifier hashing to prevent reuse of a single credential across fraudulent verifications.
- **Regulatory Compliance**: Ensure full alignment with GDPR Article 25 (Privacy by Design) and HIPAA privacy mandates.

---

## 🔒 Midnight Privacy Model

MedVault ZK partitions system data strictly across private client memory and the public Midnight ledger:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       PATIENT CLIENT ENVIRONMENT                        │
│                                                                         │
│  Private Witness Data (Off-Chain Only):                                │
│  - Patient Identity Secret Hash (Bytes<32>)                             │
│  - Dose Count (Uint<64>)                                                │
│  - Vaccine Identifier Code (Uint<64>)                                   │
│  - Certificate Expiration Timestamp (Uint<64>)                          │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     │ Generates Zero-Knowledge Proof
                                     v
┌─────────────────────────────────────────────────────────────────────────┐
│                        MIDNIGHT PUBLIC LEDGER                           │
│                                                                         │
│  Public Ledger State (On-Chain Disclosed):                              │
│  - Total Verifications Counter (Uint<64>)                               │
│  - Disclosed Single-Use Nullifier Hash (Bytes<32>)                      │
│  - Authority Key Commitment (Bytes<32>)                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Zero-Knowledge Workflow

1. **Credential Issuance**: A health authority issues a signed digital certificate containing a `patient_secret`, `dose_count`, `vaccine_code`, and `expiration_timestamp`.
2. **Verification Request**: A verifier specifies public criteria (e.g., `min_doses_required = 2`, `current_timestamp = 2026`).
3. **Local Circuit Execution**: The patient's client inputs private witness parameters and public parameters into the `verifyCertificate` Compact circuit.
4. **Assertion Evaluation**:
   $$\text{dose\_count} \ge \text{min\_doses\_required}$$
   $$\text{expiration\_timestamp} \ge \text{current\_timestamp}$$
   $$\text{vaccine\_code} > 0$$
5. **Nullifier Hash Derivation**:
   $$\text{nullifier} = \text{persistentHash}([\text{patient\_secret}, \text{pad}(32, \text{"VAC\_CERT\_V1"})])$$
6. **Proof Submission**: The client submits the ZK proof and disclosed nullifier to the Midnight Network ledger, incrementing the verification counter.

---

## 🏗️ Architecture

MedVault ZK is built as a three-tier decentralized healthcare DApp:

- **Presentation Layer**: React 18 + TypeScript + Vite single-page application featuring interactive ZK verification flows, certificate generation, ledger state inspection, and Lace wallet connectivity.
- **Client Integration Layer**: Midnight.js SDK services coordinating ZK proof creation with the local Midnight Proof Server (`http://127.0.0.1:6300`).
- **Contract & Ledger Layer**: Compact ZK smart contract deployed on the Midnight Network (`contracts/vaccination-certificate.compact`).

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Smart Contract** | Compact v0.31.1 (Midnight ZK Language) |
| **Blockchain** | Midnight Network (Preprod / Local Devnet) |
| **ZK Prover** | Midnight Proof Server v8.1.0 Docker Container |
| **Indexer Service** | Midnight Standalone Indexer v4.3.3 |
| **Frontend Framework** | React v18.3.1 + TypeScript v5.7.3 |
| **Bundler & Tooling** | Vite v6.4.3 + Vitest v3.2.7 |
| **Wallet Connector** | Midnight Lace Browser Extension (`window.midnight.mnLace`) |
| **Icons & Styling** | Lucide React + Custom CSS Design System |

---

## 📁 Repository Structure

```
private-vaccination-certificate/
├── .github/workflows/ci.yml         # Automated CI/CD build & test workflow
├── contracts/
│   ├── vaccination-certificate.compact # Compact ZK smart contract
│   └── managed/                     # Compiled ZK circuit artifacts & keys
├── docs/images/                     # Platform UI screenshots & diagrams
├── scripts/e2e-check.ts              # End-to-end integration verification
├── src/
│   ├── components/                  # UI components (Header, Forms, Vault)
│   ├── services/midnight.ts         # Midnight SDK & Lace wallet integration
│   ├── App.tsx                      # Root application layout
│   └── index.css                    # Design tokens and responsive styles
├── tests/                           # Vitest unit test suites
│   ├── contract.test.ts             # ZK circuit logic assertions
│   └── privacy.test.ts              # Nullifier & privacy model tests
├── .env.example                     # Environment configuration template
├── docker-compose.yml               # Local proof server & indexer stack
├── package.json                     # Node dependencies & npm scripts
└── PROPOSAL.md                      # High-level architecture proposal
```

---

## 🔐 Security Model

1. **Client-Side Data Storage**: All raw patient credentials reside exclusively in the user's browser `localStorage` or local encrypted storage. No plaintext health data is ever transmitted over network requests.
2. **Cryptographic Nullifier Uniqueness**: Nullifiers are computed deterministically via `persistentHash` on the patient secret and domain salt, preventing double-verification while shielding patient identities.
3. **Authority Hash Constraint**: Future updates enforce that certificates are verified against an authorized healthcare provider public key hash.

---

## 🌟 Expected Impact

- **Public Health Acceleration**: Enables instant, verifiable health compliance checks at airports, stadium venues, and workplaces.
- **Privacy Preservation**: Eliminates identity theft and medical profiling risks associated with health passports.
- **Standardization Benchmark**: Establishes a reference implementation for confidential credentials on the Midnight Network.

---

## 🔮 Future Enhancements

- **Offline QR Code Proofs**: Export compact ZK proofs as offline scanable QR codes.
- **Cryptographic Revocation Accumulators**: On-chain Merkle trees for invalidating compromised certificates.
- **Biometric Witness Protection**: Integrating device Secure Enclave / WebAuthn for unlocking patient secrets.

---

## 🏁 Conclusion

MedVault ZK demonstrates the transformative power of the Midnight Network for healthcare privacy. By combining Compact ZK smart contracts with client-side proof generation and Lace wallet integration, MedVault ZK proves that public health verification and absolute personal privacy can coexist seamlessly.
