import * as solanaWeb3 from "@solana/web3.js";
import { Account, AccountData, CustomProgramAccount } from "state/types";

const program = new solanaWeb3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

export async function getCustomProgramAccounts(
  tokenName: string,
  mint: string,
  connection: solanaWeb3.Connection,
): Promise<CustomProgramAccount> {
  const programAccounts = await connection.getParsedProgramAccounts(program, {
    filters: [
      {
        dataSize: 165,
      },
      {
        memcmp: {
          offset: 0,
          bytes: mint,
        },
      },
    ],
  });

  return {
    tokenMint: mint,
    tokenName: tokenName,
    accounts: programAccounts.map((entry) => {
      const data = (entry.account.data as solanaWeb3.ParsedAccountData).parsed as AccountData;

      return {
        wallet: data.info.owner,
        amount: data.info.tokenAmount.uiAmount ?? 0,
      } as Account;
    }),
  };
}
