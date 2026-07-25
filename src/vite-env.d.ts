/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NETWORK: string;
  readonly VITE_CONTRACT_ADDRESS: string;
  readonly VITE_PROOF_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
