/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        spot: '#1ED760',
        spotdark: '#1DB954',
        ink: '#000000',
        panel: '#121212',
        card: '#181818',
        elev: '#232323',
        muted: '#B3B3B3',
        line: '#282828',
      },
      fontFamily: {
        sans: ['CircularSp', 'Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp .35s cubic-bezier(.32,.72,0,1)',
        'fade-in': 'fadeIn .25s ease',
        marquee: 'marquee 12s linear infinite',
      },
      keyframes: {
        slideUp: { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
}
