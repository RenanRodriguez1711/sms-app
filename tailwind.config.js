/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(0, 0%, 100%)",
        foreground: "hsl(0, 0%, 10%)",
        card: "hsl(0, 0%, 98%)",
        "card-foreground": "hsl(0, 0%, 10%)",
        primary: "hsl(217, 100%, 50%)",
        "primary-foreground": "hsl(0, 0%, 100%)",
        secondary: "hsl(217, 32%, 17%)",
        "secondary-foreground": "hsl(0, 0%, 100%)",
        muted: "hsl(217, 14%, 91%)",
        "muted-foreground": "hsl(217, 9%, 45%)",
        accent: "hsl(25, 100%, 50%)",
        "accent-foreground": "hsl(0, 0%, 10%)",
        destructive: "hsl(0, 84%, 60%)",
        "destructive-foreground": "hsl(0, 0%, 100%)",
        border: "hsl(217, 33%, 90%)",
        input: "hsl(0, 0%, 100%)",
        ring: "hsl(217, 100%, 50%)",
      },
      fontSize: {
        xs: "14px",
        sm: "16px",
        base: "18px",
        lg: "20px",
        xl: "24px",
        "2xl": "28px",
      },
      height: {
        "touch": "44px",
        "touch-lg": "56px",
      },
      minHeight: {
        "touch": "44px",
        "touch-lg": "56px",
      },
    },
  },
  plugins: [],
}
