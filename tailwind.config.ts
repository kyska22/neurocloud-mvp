import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17231f",
        forest: "#1d5b49",
        mint: "#dff2e8",
        cream: "#f7f4ed",
        coral: "#ef7d62",
        sand: "#e8dfcf",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 35, 31, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
