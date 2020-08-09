// import Color from "color";

export interface Theme {
  colors: ColorProfile;
  common: {
    background: string;
    text: string;
  };
}

export interface ColorProfile {
  primary: string;
  secondary: string;

  black: string;
  white: string;
}

export const colorProfileLight: ColorProfile = {
  primary: "#E9B44C",
  secondary: "#4756d7",
  black: "#151314",
  white: "#E5E5E5",
};

export const colorProfileDark: ColorProfile = {
  primary: "#E9B44C",
  secondary: "#4756d7",
  black: "#151314",
  white: "#E5E5E5",
};

export const themeLight: Theme = {
  colors: colorProfileLight,
  common: {
    background: colorProfileLight.white,
    text: colorProfileLight.black,
  },
};

export const themeDark: Theme = {
  colors: colorProfileDark,
  common: {
    background: colorProfileDark.black,
    text: colorProfileDark.white,
  },
};
