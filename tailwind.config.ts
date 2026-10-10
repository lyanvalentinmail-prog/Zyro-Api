import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // Esquinas totalmente cuadradas en todo el proyecto
      borderRadius: {
        none: "0",
        DEFAULT: "0",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      colors: {
        // Azul eléctrico principal
        primary: {
          50: "#EFF4FF",
          100: "#DBE5FE",
          500: "#2451F5",
          600: "#1D4ED8",
          700: "#1E40AF",
        },
        // Azul marino oscuro para texto
        navy: {
          800: "#1E293B",
          900: "#0F172A",
        },
      },
    },
  },
  plugins: [],
};

export default config;
