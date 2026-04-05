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
        primary: { DEFAULT: "#6C5CE7", light: "#A29BFE", dark: "#5541d7" },
        candy: { DEFAULT: "#FD79A8", dark: "#e8608e" },
        gold: { DEFAULT: "#FDCB6E", dark: "#e6b455" },
        mint: { DEFAULT: "#00B894", dark: "#009d7e" },
        coral: { DEFAULT: "#E17055", dark: "#c85c3e" },
      },
      fontFamily: {
        fun: ["'Fredoka One'", "cursive"],
        body: ["'Nunito'", "sans-serif"],
      },
      borderRadius: { xl2: "20px", xl3: "28px" },
      boxShadow: {
        fun: "0 8px 30px rgba(108,92,231,0.25)",
        candy: "0 8px 30px rgba(253,121,168,0.25)",
        gold: "0 8px 30px rgba(253,203,110,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
