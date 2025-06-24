import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import daisyui from "daisyui";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Barlow", "sans-serif"],
        barlow: ["Barlow", "sans-serif"],
      },
    }
  },

  plugins: [typography, daisyui]
} as Config;
