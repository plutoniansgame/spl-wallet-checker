import FileUploadIcon from "@mui/icons-material/FileUpload";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Input,
  LinearProgress,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import * as solanaWeb3 from "@solana/web3.js";
import { getCustomProgramAccounts } from "functions/get-custom-program-accounts";
import { getTokenBalance } from "functions/get-token-balance";
import { validSolanaWallets } from "functions/valid-solana-wallet";
import { convertLetterToNumber } from "helpers/convert-letter-to-number";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { state } from "state/state";
import { Token, Wallets } from "state/types";
import { useSnapshot } from "valtio";

require("@solana/wallet-adapter-react-ui/styles.css");
const urlRPC = "https://api.mainnet-beta.solana.com";
const Home: NextPage = () => {
  const { t } = useTranslation("common");
  const [fileHasTitles, setFileHasTitles] = useState(false);
  const [addressColumn, setAddressColumn] = useState("E");
  const [tokenArray, setTokenArray] = useState<Token[]>([
    { mint: "2cJgFtnqjaoiu9fKVX3fny4Z4pRzuaqfJ3PBTMk2D9ur", amount: "5000", name: "PLD" },
    { mint: "EAefyXw6E8sny1cX3LTH6RSvtzH6E5EFy1XsE2AiH1f3", amount: "10000", name: "RPC" },
  ]);
  const [minumumSol, setMinimumSol] = useState(0.25);
  const [fileAsString, setFileAsString] = useState("");
  const [errorWalletsString, setErrorWalletsString] = useState<string[]>([]);
  const [validWallets, setValidWallets] = useState<string[]>([]);
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
    let wallets: Wallets = validSolanaWallets(inputWallets);

    const customProgramAccounts = await Promise.all(
      tokenArray.map(async (token) => {
        return await getCustomProgramAccounts(token.name, token.mint, new solanaWeb3.Connection(urlRPC));
      }),
    );

    // wallets = await getSolanaBalance(wallets, minumumSol, new solanaWeb3.Connection(urlRPC));
    wallets = await getTokenBalance(wallets, tokenArray, customProgramAccounts);
    console.log(wallets);
    const errorWalletsAsString: string[] = wallets.errorWallets.map((errorWallet) => errorWallet.wallet);
    const filteredValidWallets: string[] = wallets.validSolanaWallets.filter(
      (wallet) => !errorWalletsAsString.includes(wallet),
    );
    setValidWallets(filteredValidWallets);
    setErrorWalletsString(errorWalletsAsString);
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

  async function submit() {
    setValidWallets([]);
    setErrorWalletsString([]);
    procesCSV(fileAsString);
  }

  return (
    <>
      <Head>
        <title>spl-wallet-checker</title>
        <meta name="description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", paddingBottom: 10 }}>
        <Grid container columnSpacing={12}>
          <Grid item xs={2}></Grid>
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
                <Box key={index} sx={{ margin: 1 }}>
                  <TextField
                    sx={{ width: "100px", margin: 0.5 }}
                    label={t("TokenSection.token-name")}
                    value={token.name}
                    variant="outlined"
                    onChange={(e) => updateTokenNames(index, e.target.value)}
                  />
                  <TextField
                    sx={{ width: "400px", margin: 0.5 }}
                    label={t("TokenSection.token-mint")}
                    value={token.mint}
                    variant="outlined"
                    onChange={(e) => updateTokenMints(index, e.target.value)}
                  />
                  <TextField
                    inputProps={{ min: "0", max: "100000", step: "1" }}
                    type="number"
                    value={token.amount}
                    sx={{ width: "100px", margin: 0.5 }}
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
        </Grid>
      </Box>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "50%" }}>
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            {snap.message}
          </Typography>
          <LinearProgress variant="determinate" value={Math.round((snap.progress / snap.maxProgress) * 100)} />
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            {/* Add Time Left */}
            {snap.progress} / {snap.maxProgress}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 2.5 }}>
        <Box sx={{ width: "50%", display: "flex", justifyContent: "space-between" }}>
          <TextareaAutosize
            minRows={20}
            placeholder="Valid wallets"
            value={validWallets}
            style={{ width: 450, marginRight: "auto" }}
          />
          <TextareaAutosize
            minRows={20}
            placeholder="Error wallets"
            value={errorWalletsString}
            style={{ width: 450, marginLeft: "auto" }}
          />
        </Box>
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
