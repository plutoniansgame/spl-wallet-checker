import * as solanaWeb3 from "@solana/web3.js";

const mint = new solanaWeb3.PublicKey("2cJgFtnqjaoiu9fKVX3fny4Z4pRzuaqfJ3PBTMk2D9ur");
const requiredPLD = 5000;
export async function getPldBalance(
  connectedWallet: solanaWeb3.PublicKey | null,
  solConnection: solanaWeb3.Connection,
) {
  if (!connectedWallet) return false;
  const tokenAccount = await solConnection.getTokenAccountsByOwner(connectedWallet, { mint: mint });
  if (tokenAccount.value.length == 0) {
    return false;
  } else if (requiredPLD >= 0) {
    const tokenAccountBalance = await solConnection.getTokenAccountBalance(tokenAccount.value[0].pubkey);
    if (tokenAccountBalance.value.uiAmount! > requiredPLD) {
      return true;
    } else return false;
  }
  return false;
}
