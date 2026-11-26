/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        kwar: {
          bg: '#FFFFFF',
          'bg-light': '#F8FAFC',
          text: '#0F172A',
          green: '#166534',
          red: '#991B1B',
          blue: '#1E40AF',
          'yellow-dark': '#92400E',
        },
      },
      fontSize: {
        'kwar-label': ['18px', { lineHeight: '150%', fontWeight: '700' }],
        'kwar-price': ['22px', { lineHeight: '120%' }],
        'kwar-total': ['32px', { lineHeight: '120%' }],
        'kwar-jumbo': ['40px', { lineHeight: '120%' }],
      },
      spacing: {
        'kwar-touch': '56px',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
