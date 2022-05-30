import { createTheme } from "@mui/material";

import { breakpoints } from "./breakpoints";
import { primaryColors, secondaryColors } from "./colors";
import { getTypography } from "./typography";

export const customTheme = () => {
  return createTheme({
    palette: {
      primary: {
        ...primaryColors,
        contrastText: secondaryColors.main,
      },
      secondary: { ...secondaryColors },
      text: {
        primary: secondaryColors.main,
      },
    },
    components: {},
    breakpoints,
    typography: getTypography(),
  });
};
