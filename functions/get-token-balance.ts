import { state } from "state/state";

import { CustomProgramAccount, Token, Wallets } from "./../state/types";

export function getTokenBalance(
  wallets: Wallets,
  tokens: Token[],
  customProgramAccount: CustomProgramAccount[],
): Wallets {
  const validSolanaWallets = wallets.validSolanaWallets;
  const errorWallets = wallets.errorWallets;
  const walletToRemoveFromValidWallets = [];

  for (let wallet of validSolanaWallets) {
    for (let token of tokens) {
      state.message = `Checking ${wallet} for minimum balance of ${token.amount}  ${token.name}`;
      const index = errorWallets.find((w) => w.wallet === wallet);
      try {
        const tokenRequiredAmount = parseInt(token.amount);
        const programAccount = customProgramAccount.find((cpa) => cpa.tokenMint == token.mint);
        const account = programAccount?.accounts.find((pa, index) => pa.wallet == wallet);

        if (account) {
          if (account.amount < tokenRequiredAmount) {
            if (index) index.errors.push(`Doesn't have the required amount of ${token.name} (${tokenRequiredAmount})`);
            else
              errorWallets.push({
                wallet,
                errors: [`Doesn't have the required amount of ${token.name} (${tokenRequiredAmount})`],
              });
          }
        } else if (index) {
          index.errors.push(`Didn't mint ${token.name}`);
        } else errorWallets.push({ wallet, errors: [`Didn't mint ${token.name}`] });
        state.progress = state.progress + 1;
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
      state.maxProgress = state.maxProgress - state.tokensToCheckCount;

      validSolanaWallets.splice(validSolanaWallets.indexOf(entry), 1);
    });

  return { validSolanaWallets, errorWallets };
}
