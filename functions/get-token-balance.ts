import * as solanaWeb3 from "@solana/web3.js";
import { sleep } from "helpers/sleep";
import { Token, Wallets } from "pages/index.page";

export async function getTokenBalance(tokens: Token[], wallets: Wallets, solConnection: solanaWeb3.Connection) {
  const validSolanaWallets = wallets.validSolanaWallets;
  const errorWallets = wallets.errorWallets;
  const walletToRemoveFromValidWallets = [];

  for (let wallet of validSolanaWallets) {
    const publickWallet = new solanaWeb3.PublicKey(wallet);
    for (let token of tokens) {
      console.log(`Checking wallet ${wallet} for minimum balance of ${token.amount} ${token.name}`);
      await sleep(500);
      const index = errorWallets.find((w) => w.wallet === wallet);
      try {
        const mint = new solanaWeb3.PublicKey(token.mint);
        const tokenAmount = parseInt(token.amount);
        const tokenAccount = await solConnection.getTokenAccountsByOwner(publickWallet, { mint: mint });

        if (tokenAccount.value.length == 0) {
          if (index) {
            index.errors.push(`Didn't mint ${token.name}`);
          } else errorWallets.push({ wallet, errors: [`Didn't mint ${token.name}`] });
        } else if (tokenAmount >= 0) {
          await sleep(500);
          const tokenAccountBalance = await solConnection.getTokenAccountBalance(tokenAccount.value[0].pubkey);
          if (tokenAccountBalance.value.uiAmount! < tokenAmount) {
            if (index) index.errors.push(`Doesn't have the required amount of ${token.name} (${tokenAmount})`);
            else
              errorWallets.push({
                wallet,
                errors: [`Doesn't have the required amount of ${token.name} (${tokenAmount})`],
              });
          }
        }
      } catch (error) {
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
  }

  if (walletToRemoveFromValidWallets.length > 0)
    walletToRemoveFromValidWallets.forEach((entry) => {
      validSolanaWallets.splice(validSolanaWallets.indexOf(entry), 1);
    });

  return { validSolanaWallets, errorWallets };
}
