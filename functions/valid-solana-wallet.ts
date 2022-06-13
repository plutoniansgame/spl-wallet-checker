import { PublicKey } from "@solana/web3.js";
import { ErrorWallet, Wallets } from "pages/index.page";
import { state } from "state/state";

export function validSolanaWallets(wallets: string[]): Wallets {
  const validSolanaWallets: string[] = [];
  const errorWallets: ErrorWallet[] = [];

  wallets.map(async (wallet) => {
    state.message = `Validating wallet ${wallet}`;
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
    state.progress = state.progress + 1;
  });
  errorWallets.forEach((entry) => {
    validSolanaWallets.splice(validSolanaWallets.indexOf(entry.wallet), 1);
  });
  return { errorWallets, validSolanaWallets };
}
