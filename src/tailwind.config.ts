/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgMain: '#0a0e0f',
        bgRaised: '#11161a',
        line: '#232b2e',
        ink: '#e9eeec',
        inkDim: '#8b9a98',
        accentAmber: '#ff6b35',
        accentCyan: '#5eead4',
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Archivo', 'Helvetica Neue', 'sans-serif'],
      }
    },
  },
  plugins: [],
}