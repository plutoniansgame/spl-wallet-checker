import * as solanaWeb3 from "@solana/web3.js";
import { lamportsPerSol, maxMultipleAccountssize, RPCURLS } from "types/constants";
import { Account, Wallets } from "types/types";

export async function getSolanaBalance(wallets: Wallets, minValue: Number, rpcIndex: number): Promise<Wallets> {
  const connection = new solanaWeb3.Connection(RPCURLS[rpcIndex]);
  const validSolanaWallets = wallets.validSolanaWallets;
  const errorWallets = wallets.errorWallets;
  const walletToRemoveFromValidWallets: string[] = [];
  const validSolanaWalletsPer100: solanaWeb3.PublicKey[][] = [];
  let accounts: Account[] = [];

  const publickKeys = validSolanaWallets.map((w) => new solanaWeb3.PublicKey(w));

  while (publickKeys.length > 0) validSolanaWalletsPer100.push(publickKeys.splice(0, maxMultipleAccountssize));

  for await (let wallets of validSolanaWalletsPer100) {
    const mappedWalletsAndSol = wallets.map((w) => {
      return {
        wallet: w.toString(),
        amount: 0,
      } as Account;
    });

    const programAccounts = await connection.getMultipleAccountsInfo(wallets);
    programAccounts.forEach((pa, index) => {
      mappedWalletsAndSol[index].amount = pa != null ? pa.lamports / lamportsPerSol : null;
    });
    accounts = accounts.concat(mappedWalletsAndSol);
  }

  validSolanaWallets.forEach((wallet) => {
    const index = errorWallets.find((w) => w.wallet === wallet);
    const account = accounts.find((acc) => acc.wallet === wallet);
    if (account && account.amount !== null && account.amount < minValue) {
      if (index) index.errors.push(`Doesn't have the required amount of Solana (${minValue})`);
      else
        errorWallets.push({
          wallet,
          errors: [`Doesn't have the required amount of Solana (${minValue})`],
        });
    } else if (account == undefined || account.amount === null) {
      walletToRemoveFromValidWallets.push(wallet);

      if (index) index.errors.push("can't get account info.");
      else errorWallets.push({ wallet, errors: ["can't get account info."] });
    }
  });

  if (walletToRemoveFromValidWallets.length > 0)
    walletToRemoveFromValidWallets.forEach((entry) => {
      validSolanaWallets.splice(validSolanaWallets.indexOf(entry), 1);
    });
  return { errorWallets, validSolanaWallets };
}
