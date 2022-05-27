import { breakpoints } from "./breakpoints";
import { secondaryColors } from "./colors";

export const browserDefault = 16;
export const fontFamily = "NH Mont, sans-serif";

export const getBodyRegularDefault = (scale = 1) => ({
  fontSize: `${(16 * scale) / browserDefault}rem`,
  lineHeight: 1.5 * scale,
  color: secondaryColors.main,
  fontFamily,
});

export const getBodySmallDefault = (scale = 1) => ({
  fontSize: `${(14 * scale) / browserDefault}rem`,
  lineHeight: 1.4 * scale,
  color: secondaryColors.main,
  fontFamily,
});

export const getTypography = (scale = 1) => ({
  fontFamily,
  h1: {
    fontSize: `${(32 * scale) / browserDefault}rem`,
    fontWeight: 700,
    lineHeight: 1.25,
    // color: secondaryColors.main,
  },
  h2: {
    fontSize: `${(32 * scale) / browserDefault}rem`,
    fontWeight: 600,
    lineHeight: 1.25,
    color: secondaryColors.main,
  },
  h3: {
    fontSize: `${(28 * scale) / browserDefault}rem`,
    fontWeight: 600,
    lineHeight: 1.4,
    color: secondaryColors.main,
  },
  h4: {
    fontSize: `${(28 * scale) / browserDefault}rem`,
    fontWeight: 500,
    lineHeight: 1.4,
    color: secondaryColors.main,
  },
  h5: {
    fontSize: `${(24 * scale) / browserDefault}rem`,
    fontWeight: 500,
    lineHeight: 1.3,
    color: secondaryColors.main,
  },
  h6: {
    fontSize: `${(20 * scale) / browserDefault}rem`,
    fontWeight: 500,
    lineHeight: 1.2,
    color: secondaryColors.main,
  },

  "subtitle-regular": {
    fontSize: `${(16 * scale) / browserDefault}rem`,
    fontWeight: 600,
    lineHeight: 1.5,
    color: secondaryColors.main,
    fontFamily,
  },

  "subtitle-small": {
    fontSize: `${(14 * scale) / browserDefault}rem`,
    fontWeight: 700,
    lineHeight: 1.7 * scale,
    color: secondaryColors.main,
    fontFamily,
  },

  "body-regular": {
    ...getBodyRegularDefault(),
    fontWeight: 400,
  },

  "body-regular-bold": {
    ...getBodyRegularDefault(),
    fontWeight: 500,
  },

  "body-small": {
    ...getBodySmallDefault(),
    fontWeight: 400,
  },

  "body-small-bold": {
    ...getBodySmallDefault(),
    fontWeight: 500,
  },

  button: {
    fontSize: `${(14 * scale) / browserDefault}rem`,
    fontWeight: 600,
    lineHeight: 1.7 * scale,
    color: secondaryColors.main,
    [`@media screen and (min-width: ${breakpoints.values.lg}px)`]: {
      fontSize: `${(12 * scale) / browserDefault}rem`,
    },
    [`@media screen and (min-width: ${breakpoints.values.xl}px)`]: {
      fontSize: `${(14 * scale) / browserDefault}rem`,
    },
  },
  caption: {
    fontSize: `${(12 * scale) / browserDefault}rem`,
    fontWeight: 400,
    lineHeight: 1.3 * scale,
    color: secondaryColors.main,
  },
  overline: {
    fontSize: `${(10 * scale) / browserDefault}rem`,
    fontWeight: 500,
    lineHeight: 1.6 * scale,
    color: secondaryColors.main,
  },
});
