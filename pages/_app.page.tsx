import "../next-i18next.config";

import { ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { customTheme } from "styles/theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={customTheme()}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default appWithTranslation(MyApp);
