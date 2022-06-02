import * as solanaWeb3 from "@solana/web3.js";
import { sleep } from "helpers/sleep";
import { Token, Wallets } from "pages/index.page";

export async function getTokenBalance(tokens: Token[], wallets: Wallets, solConnection: solanaWeb3.Connection) {
  const validWallets = wallets.validWallets;
  const invalidWallets = wallets.invalidWallets;
  for (let wallet of validWallets) {
    const publickWallet = new solanaWeb3.PublicKey(wallet);
    for (let token of tokens) {
      await sleep(500);
      const mint = new solanaWeb3.PublicKey(token.mint);
      const tokenAmount = parseInt(token.amount);
      const index = invalidWallets.find((w) => w.wallet === wallet);
      const tokenAccount = await solConnection.getTokenAccountsByOwner(publickWallet, { mint: mint });
      console.log(wallet);

      if (tokenAccount.value.length == 0) {
        if (index) {
          index.errors.push(`Didn't mint ${token.name}`);
        } else invalidWallets.push({ wallet, errors: [`Didn't mint ${token.name}`] });
      } else if (tokenAmount >= 0) {
        await sleep(500);
        const tokenAccountBalance = await solConnection.getTokenAccountBalance(tokenAccount.value[0].pubkey);
        if (tokenAmount < tokenAccountBalance.value.uiAmount!) {
          if (index)
            index.errors.push(
              `Doesn't have the required amount (${tokenAccountBalance.value.uiAmountString}) of ${token.name}`,
            );
        }
      }
    }
  }

  invalidWallets.forEach((entry) => {
    validWallets.splice(validWallets.indexOf(entry.wallet), 1);
  });
  return { validWallets, invalidWallets };
}
