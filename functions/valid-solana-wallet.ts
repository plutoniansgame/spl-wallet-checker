import * as solanaWeb3 from "@solana/web3.js";
import { InvalidWallet, Wallets } from "pages/index.page";

export function validSolanaWallets(wallets: string[]): Wallets {
  const invalidWallets: InvalidWallet[] = [];
  const validWallets: string[] = [];
  wallets.map(async (wallet) => {
    if (wallet.startsWith("0x")) invalidWallets.push({ wallet, errors: ["Ethereum wallet"] });
    try {
      const publickWallet = new solanaWeb3.PublicKey(wallet).toBytes();
      const validwallet = solanaWeb3.PublicKey.isOnCurve(publickWallet);
      if (!validwallet) {
        const index = invalidWallets.find((w) => w.wallet === wallet);
        if (index) index.errors.push("Solana wallet");
        else invalidWallets.push({ wallet, errors: ["Invalid Solana wallet"] });
      } else validWallets.push(wallet);
    } catch (error) {
      const index = invalidWallets.find((w) => w.wallet === wallet);
      if (index) index.errors.push("Solana wallet");
      else invalidWallets.push({ wallet, errors: ["Invalid Solana wallet"] });
    }
  });

  return { invalidWallets, validWallets };
}
