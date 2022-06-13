import * as solanaWeb3 from "@solana/web3.js";
import { sleep } from "helpers/sleep";
import { Wallets } from "pages/index.page";
import { state } from "state/state";

const lamportsPerSol = 1000000000;
export async function getSolanaBalance(wallets: Wallets, minValue: number, solConnection: solanaWeb3.Connection) {
  const validSolanaWallets = wallets.validSolanaWallets;
  const errorWallets = wallets.errorWallets;
  const walletToRemoveFromValidWallets = [];
  for (let wallet of validSolanaWallets) {
    state.message = `Checking wallet ${wallet} for minimum balance of ${minValue} Solana`;
    const index = errorWallets.find((w) => w.wallet === wallet);

    try {
      await sleep(500);
      const publickWallet = new solanaWeb3.PublicKey(wallet);
      const accountInfo = await solConnection.getAccountInfo(publickWallet);
      const solvalue = accountInfo!.lamports / lamportsPerSol;
      if (solvalue < minValue) {
        if (index) index.errors.push(`Doesn't have the required amount of Solana (${minValue})`);
        else
          errorWallets.push({
            wallet,
            errors: [`Doesn't have the required amount of Solana (${minValue})`],
          });
      }
      state.progress = state.progress + 1;
    } catch (error: unknown) {
      if (error instanceof Error) {
        walletToRemoveFromValidWallets.push(wallet);
        if (index) index.errors.push(error.message);
        else
          errorWallets.push({
            wallet,
            errors: [error.message],
          });
      }
    }
  }
  if (walletToRemoveFromValidWallets.length > 0)
    walletToRemoveFromValidWallets.forEach((entry) => {
      state.maxProgress = state.maxProgress - (1 + state.tokensToCheckCount);
      validSolanaWallets.splice(validSolanaWallets.indexOf(entry), 1);
    });
  return { validSolanaWallets, errorWallets };
}
