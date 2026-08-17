/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}", "./src/features/**/*.{js,ts,jsx,tsx}", "./src/lib/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        secondary: "var(--secondary)",
        "secondary-hover": "var(--secondary-hover)",
        "text-main": "var(--main-text)",
        "bg-main": "var(--main-bg)",
        "border-muted": "var(--main-border)",
      },
    },
  },
  plugins: [],
};
