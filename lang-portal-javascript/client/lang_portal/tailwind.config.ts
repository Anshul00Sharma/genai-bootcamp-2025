import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2C3930",
          dark: "#2C3930",
        },
        secondary: {
          DEFAULT: "#3F4F44",
          hover: "#4a5c50",
        },
        accent: {
          DEFAULT: "#A27B5C",
          light: "#DCD7C9",
        },
      },
    },
  },
  plugins: [],
};

export default config;
