module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#137fec",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        "card-light": "#ffffff",
        "card-dark": "#1a2632",
        "text-light": "#101922",
        "text-dark": "#f6f7f8",
        "text-muted-light": "#6b7280",
        "text-muted-dark": "#9ca3af",
        "border-light": "#e5e7eb",
        "border-dark": "#374151"
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
};
