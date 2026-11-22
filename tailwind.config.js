/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#ca9c5e",
        green: "#0f5e58",
        ink: "#374151",
        cream: "#fdfaf3",
      },
      fontFamily: {
        tajawal: ["Tajawal", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
