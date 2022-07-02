import * as solanaWeb3 from "@solana/web3.js";

export type Token = {
  name: string;
  mint: string;
  amount: string;
};
export type Wallets = {
  validSolanaWallets: string[];
  errorWallets: ErrorWallet[];
};
export type ErrorWallet = {
  wallet: string;
  errors: string[];
};

export type AccountData = {
  type: string;
  info: Info;
};

export type Account = {
  wallet: string;
  amount: number;
};

export type Info = {
  isNative: boolean;
  mint: string;
  owner: string;
  state: string;
  tokenAmount: solanaWeb3.TokenAmount;
};

export type CustomProgramAccount = {
  tokenName: string;
  tokenMint: string;
  accounts: Account[];
};
