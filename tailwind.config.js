/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeSlideDown: {
          "0%":   { opacity: "0", transform: "translateY(-24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeSlideUp: {
          "0%":   { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-slide-down":   "fadeSlideDown 0.7s ease both",
        "fade-slide-down-1": "fadeSlideDown 0.7s ease 0.15s both",
        "fade-slide-down-2": "fadeSlideDown 0.7s ease 0.3s both",
        "fade-slide-up":     "fadeSlideUp 0.9s ease 0.4s both",
        "fade-slide-up-2":   "fadeSlideUp 1s ease 0.3s both",
      },
    },
  },
  plugins: [],
};