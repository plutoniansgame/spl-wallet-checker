import * as solanaWeb3 from "@solana/web3.js";
import { program, RPCURLS } from "types/constants";
import { Account, AccountData, CustomProgramAccount } from "types/types";

export async function getCustomProgramAccounts(
  tokenName: string,
  mint: string,
  rpcIndex: number,
): Promise<CustomProgramAccount> {
  const connection = new solanaWeb3.Connection(RPCURLS[rpcIndex]);
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
