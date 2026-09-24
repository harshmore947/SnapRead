/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Apple-inspired colors from DESIGN.md (keeping rose palette but adding Apple neutrals)
        apple: {
          black: "#000000",
          white: "#FFFFFF",
          "chip-translucent": "#D2D2D7",
          "surface-tile-1": "#272729",
          "surface-tile-2": "#2A2A2C",
          "surface-tile-3": "#252527",
          "surface-pearl": "#FAFAFC",
          "surface-black": "#000000",
          "canvas": "#FFFFFF",
          "canvas-parchment": "#F5F5F7",
          divider: "#F0F0F0",
          hairline: "#E0E0E0",
          ink: "#1D1D1F",
          "ink-muted-80": "#333333",
          "ink-muted-48": "#7A7A7A",
          "body-on-dark": "#FFFFFF",
          "primary-focus": "#0071E3",
          "primary-on-dark": "#2997FF",
          "on-primary": "#FFFFFF",
          "on-dark": "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        // From DESIGN.md
        pill: "9999px",
        // Utility card radius
        "utility-card": "18px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        // Apple SF Pro equivalents - using system fonts with fallback
        sans: [
          "SF Pro Display",
          "SF Pro Text",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: ["SF Pro Display", "system-ui", "-apple-system", "sans-serif"],
        text: ["SF Pro Text", "system-ui", "-apple-system", "sans-serif"],
      },
      typography: ({ theme }: any) => ({
        DEFAULT: {
          css: {
            color: theme("colors.foreground"),
            "[class~='lead']": {
              color: theme("colors.foreground"),
            },
          },
        },
      }),
      spacing: {
        // From DESIGN.md spacing scale
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        md: "17px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
        section: "80px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}