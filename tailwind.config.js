// module.exports = {
//   content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
//   theme: {
//     extend: {},
//   },
//   plugins: [
//     function ({ addUtilities }) {
//       addUtilities({
//         ".no-scrollbar": {
//           "-ms-overflow-style": "none !important" /* IE and Edge */,
//           "scrollbar-width": "none !important" /* Firefox */,
//         },
//         ".no-scrollbar::-webkit-scrollbar": {
//           display: "none !important" /* Chrome, Safari, and Opera */,
//         },
//       });
//     },
//   ],
//   corePlugins: {
//     preflight: false,
//   },
// };

// -------------------------------

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        erica: ['"Erica One"', "cursive"], // Erica One font
        sourGummy: ['"Sour Gummy"', "sans-serif"], // Sour Gummy font
        nunito: ['Nunito', 'sans-serif'],

      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
};
