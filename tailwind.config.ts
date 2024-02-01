import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        text: {
          50: "#e7f4ff",
          100: "#c9dae9",
          200: "#a9c1d6",
          300: "#88a8c4",
          400: "#678fb2",
          500: "#4e7699",
          600: "#3c5b77",
          700: "#294156",
          800: "#162736",
          900: "#000e17",
        },
        background: {
          50: "#eeeefe",
          100: "#cfcfe6",
          200: "#afb0d0",
          300: "#8f90bc",
          400: "#7070a8",
          500: "#56578e",
          600: "#42436f",
          700: "#2f3050",
          800: "#1b1d32",
          900: "#070a16",
        },
        primary: {
          50: "#f2f2f2",
          100: "#d9d9d9",
          200: "#bfbfbf",
          300: "#a6a6a6",
          400: "#8c8c8c",
          500: "#737373",
          600: "#595959",
          700: "#404040",
          800: "#262626",
          900: "#0d0d0d",
        },
        secondary: {
          50: "#eeeeff",
          100: "#ced0e7",
          200: "#afb0d1",
          300: "#9090bd",
          400: "#7071a9",
          500: "#56578f",
          600: "#434470",
          700: "#2f3052",
          800: "#1c1d34",
          900: "#090918",
        },
      },
    },
  },
  plugins: [],
};
export default config;
