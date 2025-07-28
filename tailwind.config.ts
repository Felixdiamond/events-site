import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5EF',  // Softest tint
          100: '#FFE7DA',
          200: '#FFCEB3',
          300: '#F5A57F', 
          400: '#E47B4E',
          DEFAULT: '#C65A2D', // Muted, premium orange
          light: '#D86C3B', // Lighter refined orange
          dark: '#A84A25', // Darker shade for hover states
          600: '#A84A25',
          700: '#7E371B',
          800: '#552312',
          900: '#2D1009',
        },
        secondary: {
          50: '#F7F7F7',
          100: '#E3E3E3',
          200: '#C8C8C8',
          300: '#A4A4A4',
          400: '#818181',
          DEFAULT: '#1A1A1A',
          dark: '#0A0A0A', // Darker shade for hover states
          600: '#141414',
          700: '#0F0F0F',
          800: '#0A0A0A',
          900: '#050505',
        },
        destructive: {
          DEFAULT: "#FF5252",
          dark: "#D32F2F", // Darker shade for hover states
          foreground: "#FFFFFF",
        },
        accent: {
          light: '#FFFFFF',
          DEFAULT: '#F5F5F5',
          dark: '#E5E5E5',
          cream: '#FFF8E7',
          off: '#E8E8E8',
        },
        success: {
          light: '#E6F4EA',
          DEFAULT: '#34A853',
          dark: '#1E7E34',
        },
        warning: {
          light: '#FFF3E0',
          DEFAULT: '#FBBC04',
          dark: '#F57C00',
        },
        error: {
          light: '#FFEBEE',
          DEFAULT: '#EA4335',
          dark: '#C62828',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        cinzel: ['var(--font-cinzel)', 'Georgia', 'serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.75rem' }],
        '5xl': ['3rem', { lineHeight: '3.5rem' }],
        '6xl': ['3.75rem', { lineHeight: '4.25rem' }],
        '7xl': ['4.5rem', { lineHeight: '5rem' }],
        '8xl': ['6rem', { lineHeight: '6.5rem' }],
        '9xl': ['8rem', { lineHeight: '8.5rem' }],
      },
      spacing: {
        '4xs': '0.125rem',
        '3xs': '0.25rem',
        '2xs': '0.375rem',
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        '4xl': '3rem',
      },
      borderRadius: {
        '4xs': '0.125rem',
        '3xs': '0.25rem',
        '2xs': '0.375rem',
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '2rem',
      },
      boxShadow: {
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'elegant': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'premium': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'intense': '0 12px 40px rgba(0, 0, 0, 0.16)',
        'inner-sm': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
        'inner-md': 'inset 0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-spotlight': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'texture-pattern': "url('/images/texture.png')",
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        shine: {
          '0%': { 'background-position': '100%' },
          '100%': { 'background-position': '-100%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        shine: 'shine 5s linear infinite',
        float: 'float 3s ease-in-out infinite',
        pulse: 'pulse 2s ease-in-out infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};

export default config;
