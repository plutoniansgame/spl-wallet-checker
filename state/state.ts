import { proxy } from "valtio";

const state = proxy({
  maxProgress: 0,
  progress: 0,
  message: "",
  numberOfTestsPerWallet: 0,
  numberOfWallets: 0,
  tokensToCheckCount: 0,
  invalidAddres: (): void => {},
  setInformation: (walletCount: number, testCount: number, tokenArrayLength: number): void => {
    state.progress = 0;
    state.numberOfWallets = walletCount;
    state.numberOfTestsPerWallet = testCount;
    state.maxProgress = walletCount * testCount;
    state.tokensToCheckCount = tokenArrayLength;
  },
});

export { state };
