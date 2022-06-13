import FileUploadIcon from "@mui/icons-material/FileUpload";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Input,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import * as solanaWeb3 from "@solana/web3.js";
import { getSolanaBalance } from "functions/get-solana-balance";
import { getTokenBalance } from "functions/get-token-balance";
import { validSolanaWallets } from "functions/valid-solana-wallet";
import { convertLetterToNumber } from "helpers/convert-letter-to-number";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { state } from "state/state";
import { useSnapshot } from "valtio";
export type Token = {
  name: string;
  mint: string;
  amount: string;
};
export type Wallets = {
  validSolanaWallets: string[];
  errorWallets: ErrorWallet[];
};
export type ErrorWallet = {
  wallet: string;
  errors: string[];
};

const Home: NextPage = () => {
  const { t } = useTranslation("common");
  const [fileHasTitles, setFileHasTitles] = useState(false);
  const [addressColumn, setAddressColumn] = useState("E");
  const [tokenArray, setTokenArray] = useState<Token[]>([
    { mint: "2cJgFtnqjaoiu9fKVX3fny4Z4pRzuaqfJ3PBTMk2D9ur", amount: "5000", name: "PLD" },
    { mint: "EAefyXw6E8sny1cX3LTH6RSvtzH6E5EFy1XsE2AiH1f3", amount: "10000", name: "RPC" },
  ]);
  const [minumumSol, setMinimumSol] = useState(0.25);
  const [urlRPC, setUrlRPC] = useState("https://api.mainnet-beta.solana.com");
  const [reqPerSecond, setReqPerSecond] = useState(10);
  const [fileAsString, setFileAsString] = useState("");
  // const [errorWallets, setErrorWallets] = useState<InvalidWallet[]>([]);
  // const [validWallets, setValidWallets] = useState<string[]>([]);
  const snap = useSnapshot(state);
  function updateTokenMints(index: number, mint: string) {
    const newTokenArray = [...tokenArray];
    newTokenArray[index].mint = mint;
    setTokenArray(newTokenArray);
  }
  function updateTokenValues(index: number, value: string) {
    const newTokenArray = [...tokenArray];
    newTokenArray[index].amount = value;
    setTokenArray(newTokenArray);
  }

  function updateTokenNames(index: number, value: string) {
    const newTokenArray = [...tokenArray];
    newTokenArray[index].name = value;
    setTokenArray(newTokenArray);
  }

  function procesCSV(csv: string) {
    const rows = csv
      .slice(fileHasTitles ? csv.indexOf("\n") : 0)
      .split("\n")
      .filter((e) => e);

    const wallets = rows.map((row) => {
      const values = row.split(`,`);
      const value = values[convertLetterToNumber(addressColumn)];
      return value;
    });

    validateWallets(wallets);
  }

  async function validateWallets(inputWallets: string[]) {
    state.setInformation(inputWallets.length, 2 + tokenArray.length, tokenArray.length);
    let wallets = validSolanaWallets(inputWallets);
    wallets = await getSolanaBalance(wallets, minumumSol, new solanaWeb3.Connection(urlRPC));
    wallets = await getTokenBalance(tokenArray, wallets, new solanaWeb3.Connection(urlRPC));
    console.log(wallets);
  }

  function fileChangeHandler(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files?.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setFileAsString(text);
      };

      reader.readAsText(event.target.files[0]);
    }
  }

  function submit() {
    procesCSV(fileAsString);
  }

  return (
    <>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Head>
          <title>spl-wallet-checker</title>
          <meta name="description" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Grid container spacing={12}>
          <Grid item xs={2} display="flex" flexDirection={"column"}>
            <Typography variant="h3">{t("FileSection.title")}</Typography>
            <label htmlFor={"upload-button"}>
              <Input
                id={"upload-button"}
                type="file"
                sx={{ display: "none" }}
                inputProps={{ accept: ".csv" }}
                onChange={fileChangeHandler}
              />
              <Button color="primary" component="span">
                <FileUploadIcon /> {t("FileSection.upload-csv")}
              </Button>
            </label>
            <FormControlLabel
              control={<Checkbox checked={fileHasTitles} onChange={() => setFileHasTitles(!fileHasTitles)} />}
              label={t("FileSection.first-row-are-titles") as string}
            />
            <TextField
              label={t("FileSection.addresses-in-column")}
              value={addressColumn}
              onChange={(e) => setAddressColumn(e.target.value)}
              variant="outlined"
            />
            <Button onClick={submit}>GO</Button>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="h3">{t("SolSection.solana")}</Typography>
            <TextField
              value={minumumSol}
              sx={{ width: "100%" }}
              type="number"
              label={t("SolSection.min-needed")}
              inputProps={{ min: "0", max: "10", step: "0.25" }}
              onChange={(e) => setMinimumSol(parseFloat(e.target.value))}
            />
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h3">{t("TokenSection.title")}</Typography>
            <Box>
              {tokenArray.map((token, index) => (
                <Box key={index}>
                  <TextField
                    sx={{ width: "100px" }}
                    label={t("TokenSection.token-name")}
                    value={token.name}
                    variant="outlined"
                    onChange={(e) => updateTokenNames(index, e.target.value)}
                  />
                  <TextField
                    sx={{ width: "400px", marginLeft: 1 }}
                    label={t("TokenSection.token-mint")}
                    value={token.mint}
                    variant="outlined"
                    onChange={(e) => updateTokenMints(index, e.target.value)}
                  />
                  <TextField
                    inputProps={{ min: "0", max: "100000", step: "1" }}
                    type="number"
                    value={token.amount}
                    sx={{ width: "100px", marginLeft: 1 }}
                    label={t("TokenSection.min-amount")}
                    variant="outlined"
                    onChange={(e) => updateTokenValues(index, e.target.value)}
                  />
                </Box>
              ))}
              <Button
                onClick={() => {
                  if (tokenArray.length != 3) setTokenArray([...tokenArray, { mint: "", amount: "", name: "" }]);
                }}
              >
                Add
              </Button>
              <Button onClick={() => setTokenArray(tokenArray.slice(0, -1))}>Remove</Button>
            </Box>
          </Grid>
          <Grid item xs={3} display="flex" flexDirection={"column"}>
            <Typography variant="h3">{t("RPCSection.title")}</Typography>
            <TextField
              value={urlRPC}
              label={t("RPCSection.url")}
              onChange={(e) => setUrlRPC(e.target.value)}
              variant="outlined"
            />
            <TextField
              disabled={urlRPC == "https://api.mainnet-beta.solana.com"}
              inputProps={{ min: "0", max: "500", step: "10" }}
              sx={{ marginTop: 1 }}
              type="number"
              label={t("RPCSection.requests-per-second")}
              variant="outlined"
              value={reqPerSecond}
              onChange={(e) => setReqPerSecond(parseFloat(e.target.value))}
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Typography variant="body2" sx={{ textAlign: "center" }}>
          {snap.message}
        </Typography>
        <LinearProgress variant="determinate" value={Math.round((snap.progress / snap.maxProgress) * 100)} />
        <Typography variant="body2" sx={{ textAlign: "center" }}>
          {/* Add Time Left */}
          {snap.progress} / {snap.maxProgress}
        </Typography>
      </Box>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["common"])),
    },
  };
};

export default Home;
