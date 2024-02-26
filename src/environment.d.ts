declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PRIVATE_KEY: string;
      CELESTIA_RPC_URL: string;
      ETH_RPC_URL: string;
      VERIFY_CONTRACT_ADDRESS: string;
      BRIDGE_ADDRESS: string;
      CHAIN_ID: string;
      NAMESPACE: string;
    }
  }
}

export {}