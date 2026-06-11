import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          900: '#1e3a8a',
        },
        risk: {
          green: '#16a34a',
          yellow: '#d97706',
          red: '#dc2626',
          'green-bg': '#f0fdf4',
          'yellow-bg': '#fffbeb',
          'red-bg': '#fef2f2',
        },
      },
    },
  },
  plugins: [],
}

export default config
