import type { Config } from 'tailwindcss'

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FFD56B",
          50: "#FDFBF5",
          100: "#FFF7E1",
          200: "#FFEEC4",
          300: "#FFE6A6",
          400: "#FFDD89",
          500: "#FFD56B",
          600: "#D9B456",
          700: "#B39340",
          800: "#8E712B",
          900: "#685015",
          950: "#55400B",
        },
      },
    },
  },
  plugins: [],
} satisfies Config

