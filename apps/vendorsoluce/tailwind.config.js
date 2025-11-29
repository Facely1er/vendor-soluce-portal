/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'vendorsoluce-green': '#33691E',
        'vendorsoluce-light-green': '#66BB6A',
        'vendorsoluce-pale-green': '#E8F5E8',
        'vendorsoluce-dark-green': '#2A5618',
        'vendorsoluce-navy': '#1E3B8A',
        'vendorsoluce-teal': '#2D7D7D',
        'vendorsoluce-blue': '#3B82F6',
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