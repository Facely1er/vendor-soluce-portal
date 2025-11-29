/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'vendortal-purple': '#7C4DFF',
        'vendortal-light-purple': '#9C7CFF',
        'vendortal-pale-purple': '#E8D5FF',
        'vendortal-dark-purple': '#5E3FC0',
        'vendortal-lavender': '#D1C4E9',
        'vendortal-violet': '#6A1B9A',
        'vendortal-navy': '#1E3B8A',
        // Legacy support - deprecated, use vendortal-* variants instead
        'vendorsoluce-green': '#7C4DFF',
        'vendorsoluce-light-green': '#9C7CFF',
        'vendorsoluce-pale-green': '#E8D5FF',
        'vendorsoluce-dark-green': '#5E3FC0',
        'vendorsoluce-navy': '#1E3B8A',
        'vendorsoluce-teal': '#7C4DFF',
        'vendorsoluce-blue': '#7C4DFF',
        'neutral-gray': '#6B7280',
        'risk-critical': '#DC2626',
        'risk-high': '#EA580C',
        'risk-medium': '#F59E0B',
        'risk-low': '#16A34A',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};