import { PublicKey } from "@solana/web3.js";
import { ErrorWallet, Wallets } from "pages/index.page";

export function validSolanaWallets(wallets: string[]): Wallets {
  const validSolanaWallets: string[] = [];
  const errorWallets: ErrorWallet[] = [];
  wallets.map(async (wallet) => {
    console.log(`Checking wallet ${wallet}`);
    if (wallet.startsWith("0x")) errorWallets.push({ wallet, errors: ["Ethereum wallet"] });
    try {
      const publickWallet = new PublicKey(wallet);
      const validwallet = PublicKey.isOnCurve(publickWallet.toBuffer());
      if (!validwallet) {
        const index = errorWallets.find((w) => w.wallet === wallet);
        if (index) index.errors.push("Invalid Solana wallet");
        else errorWallets.push({ wallet, errors: ["Invalid Solana wallet"] });
      } else validSolanaWallets.push(wallet);
    } catch (error) {
      const index = errorWallets.find((w) => w.wallet === wallet);
      if (index) index.errors.push("Invalid Solana wallet");
      else errorWallets.push({ wallet, errors: ["Invalid Solana wallet"] });
    }
  });
  errorWallets.forEach((entry) => {
    validSolanaWallets.splice(validSolanaWallets.indexOf(entry.wallet), 1);
  });
  return { errorWallets, validSolanaWallets };
}
