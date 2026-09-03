/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          light: '#E2E8F0',
          sage: '#111827',
          mint: '#22D3EE',
          forest: '#94A3B8',
          dark: '#050816',
        },
        emergency: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#FF4D4D',
          600: '#E13F46',
          700: '#B91C2B',
          DEFAULT: '#FF4D4D',
        },
        dark: {
          bg: '#050816',
          surface: '#0B1120',
          elevated: '#111827',
          card: 'rgba(15, 23, 42, 0.75)',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        light: {
          bg: '#F6F8FB',
          surface: '#F8FAFC',
          card: 'rgba(255, 255, 255, 0.85)',
          border: 'rgba(0, 0, 0, 0.06)',
        },
        tech: {
          blue: '#22D3EE',
          cyan: '#22D3EE',
          darkBlue: '#0891B2',
        },
        status: {
          success: '#34D399',
          warning: '#FBBF24',
          danger: '#FF4D4D',
          info: '#22D3EE',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'emergency-glow': '0 0 25px -3px rgba(239, 68, 68, 0.45)',
        'tech-glow': '0 0 25px -3px rgba(56, 189, 248, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar 4s linear infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
