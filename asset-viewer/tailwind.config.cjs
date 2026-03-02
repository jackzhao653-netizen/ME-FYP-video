/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        abyss: '#0f172a',
        cyanpulse: '#22d3ee',
        emeraldpulse: '#34d399'
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Manrope', 'sans-serif']
      }
    }
  },
  plugins: []
};
