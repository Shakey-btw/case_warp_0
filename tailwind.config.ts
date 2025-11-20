import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "white",
        "background-secondary": "#F6F6F6",
        stroke: "#E0E0E0",
        "stroke-dark": "#9D9D9D", // 30% darker than stroke (#E0E0E0 * 0.7)
        border: "#E0E0E0",
        foreground: "#0A1111",
        "text-primary": "#000000",
        "text-body": "#525252",
        primary: {
          DEFAULT: "#0A1111",
          foreground: "white",
        },
        secondary: {
          DEFAULT: "white",
          foreground: "#000000",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        "h1": ["64px", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "700" }],
        "h2": ["40px", { lineHeight: "1.20", letterSpacing: "-0.01em", fontWeight: "700" }],
        "h3": ["28px", { lineHeight: "1.25", letterSpacing: "0em", fontWeight: "600" }],
        "subhead": ["20px", { lineHeight: "1.35", letterSpacing: "0em", fontWeight: "500" }],
        "lead": ["20px", { lineHeight: "1.45", letterSpacing: "0em", fontWeight: "500" }],
        "body": ["16px", { lineHeight: "1.60", letterSpacing: "0.01em", fontWeight: "400" }],
        "small": ["14px", { lineHeight: "1.55", letterSpacing: "0.01em", fontWeight: "500" }],
        "caption": ["13px", { lineHeight: "1.65", letterSpacing: "0.02em", fontWeight: "400" }],
        "button": ["16px", { lineHeight: "1.25", letterSpacing: "0.01em", fontWeight: "600" }],
        "input": ["16px", { lineHeight: "1.50", letterSpacing: "0.01em", fontWeight: "400" }],
        "faq": ["20px", { lineHeight: "1.35", letterSpacing: "0em", fontWeight: "600" }],
        "nav": ["16px", { lineHeight: "1.35", letterSpacing: "0.01em", fontWeight: "500" }],
      },
      borderRadius: {
        lg: "10px",
        md: "10px",
        sm: "10px",
        "box": "12px",
      },
      boxShadow: {
        "button-primary": "0px 2.5px 5px -2.5px rgba(0, 0, 0, 0.12), inset 0px 0px 5px 0px rgba(255, 255, 255, 0.5)",
      },
      spacing: {
        "button-y": "8px",
        "button-x": "16px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

