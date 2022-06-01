import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Box, Button, Checkbox, FormControlLabel, Grid, Input, TextField, Typography } from "@mui/material";
import { convertLetterToNumber } from "helpers/convert-letter-to-number";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
type Token = {
  mint: string;
  amount: string;
};
const Home: NextPage = () => {
  const { t } = useTranslation("common");
  const [fileHasTitles, setFileHasTitles] = useState(false);
  const [addressColumn, setAddressColumn] = useState("A");
  const [tokenArray, setTokenArray] = useState<Token[]>([{ mint: "", amount: "" }]);
  const [minumumSol, setMinimumSol] = useState(0.25);
  const [urlRPC, setUrlRPC] = useState("");
  const [reqPerSecond, setReqPerSecond] = useState(10);
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
  function procesCSV(csv: string) {
    const rows = csv
      .slice(fileHasTitles ? csv.indexOf("\n") : 0)
      .split("\n")
      .filter((e) => e);

    const wallets = rows.map((row) => {
      const values = row.split(`,`);
      return {
        solanaWallet: values[convertLetterToNumber(addressColumn)],
      };
    });

    console.log(wallets);
  }
  function fileChangeHandler(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files?.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        procesCSV(text);
      };

      reader.readAsText(event.target.files[0]);
    }
  }
  return (
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
                  sx={{ width: "500px" }}
                  label={t("TokenSection.token-mint")}
                  value={token.mint}
                  variant="outlined"
                  onChange={(e) => updateTokenMints(index, e.target.value)}
                />
                <TextField
                  inputProps={{ min: "0", max: "100000", step: "1" }}
                  type="number"
                  value={token.amount}
                  sx={{ width: "150px", marginLeft: 1 }}
                  label={t("TokenSection.min-amount")}
                  variant="outlined"
                  onChange={(e) => updateTokenValues(index, e.target.value)}
                />
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid item xs={2} display="flex" flexDirection={"column"}>
          <Typography variant="h3">{t("RPCSection.title")}</Typography>
          <TextField
            value={urlRPC}
            label={t("RPCSection.url")}
            onChange={(e) => setUrlRPC(e.target.value)}
            variant="outlined"
          />
          <TextField
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
