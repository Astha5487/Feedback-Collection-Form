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
        // Primary color - Vibrant indigo
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          950: 'var(--color-primary-950)',
        },
        // Secondary color - Teal
        secondary: {
          50: 'var(--color-secondary-50)',
          100: 'var(--color-secondary-100)',
          200: 'var(--color-secondary-200)',
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)',
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
          800: 'var(--color-secondary-800)',
          900: 'var(--color-secondary-900)',
          950: 'var(--color-secondary-950)',
        },
        // Accent color - Amber
        accent: {
          50: 'var(--color-accent-50)',
          100: 'var(--color-accent-100)',
          200: 'var(--color-accent-200)',
          300: 'var(--color-accent-300)',
          400: 'var(--color-accent-400)',
          500: 'var(--color-accent-500)',
          600: 'var(--color-accent-600)',
          700: 'var(--color-accent-700)',
          800: 'var(--color-accent-800)',
          900: 'var(--color-accent-900)',
          950: 'var(--color-accent-950)',
        },
        // Enhanced neutral colors for better dark mode
        neutral: {
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
          950: 'var(--color-neutral-950)',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Lexend', 'Inter var', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'soft-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        'soft-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.07)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)',
        'glow': '0 0 15px rgba(99, 102, 241, 0.5)',
        'glow-secondary': '0 0 15px rgba(20, 184, 166, 0.5)',
        'glow-accent': '0 0 15px rgba(245, 158, 11, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'slide-down': 'slideDown 0.5s ease-in-out',
        'slide-left': 'slideLeft 0.5s ease-in-out',
        'slide-right': 'slideRight 0.5s ease-in-out',
        'scale-in': 'scaleIn 0.5s ease-in-out',
        'bounce-in': 'bounceIn 0.7s ease-in-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '40%': { transform: 'scale(1.1)', opacity: '1' },
          '80%': { transform: 'scale(0.9)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        },
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.primary.600'),
              '&:hover': {
                color: theme('colors.primary.500'),
              },
            },
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.gray.900'),
              fontWeight: theme('fontWeight.bold'),
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: theme('colors.primary.300'),
              },
            },
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.gray.100'),
            },
          },
        },
      }),
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function ({ addComponents }) {
      addComponents({
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0.375rem',
          fontWeight: '500',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          padding: '0.625rem 1.25rem',
          transitionProperty: 'all',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDuration: '150ms',
          '&:focus': {
            outline: 'none',
          },
          '&:disabled': {
            opacity: '0.65',
            pointerEvents: 'none',
          },
        },
        '.btn-primary': {
          backgroundColor: 'var(--color-primary-600)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'var(--color-primary-700)',
          },
          '&:focus': {
            boxShadow: '0 0 0 2px white, 0 0 0 4px var(--color-primary-600)',
          },
          '&:active': {
            backgroundColor: 'var(--color-primary-800)',
          },
        },
        '.btn-secondary': {
          backgroundColor: 'var(--color-secondary-600)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'var(--color-secondary-700)',
          },
          '&:focus': {
            boxShadow: '0 0 0 2px white, 0 0 0 4px var(--color-secondary-600)',
          },
          '&:active': {
            backgroundColor: 'var(--color-secondary-800)',
          },
        },
        '.btn-accent': {
          backgroundColor: 'var(--color-accent-500)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'var(--color-accent-600)',
          },
          '&:focus': {
            boxShadow: '0 0 0 2px white, 0 0 0 4px var(--color-accent-500)',
          },
          '&:active': {
            backgroundColor: 'var(--color-accent-700)',
          },
        },
        '.btn-outline': {
          backgroundColor: 'transparent',
          borderWidth: '1px',
          borderColor: 'var(--color-primary-600)',
          color: 'var(--color-primary-600)',
          '&:hover': {
            backgroundColor: 'var(--color-primary-50)',
          },
          '&:focus': {
            boxShadow: '0 0 0 2px white, 0 0 0 4px var(--color-primary-600)',
          },
          '&:active': {
            backgroundColor: 'var(--color-primary-100)',
          },
        },
        '.btn-ghost': {
          backgroundColor: 'transparent',
          color: 'var(--color-primary-600)',
          '&:hover': {
            backgroundColor: 'var(--color-primary-50)',
          },
          '&:focus': {
            boxShadow: '0 0 0 2px white, 0 0 0 4px var(--color-primary-200)',
          },
          '&:active': {
            backgroundColor: 'var(--color-primary-100)',
          },
        },
        '.form-input': {
          display: 'block',
          width: '100%',
          borderRadius: '0.375rem',
          borderWidth: '1px',
          borderColor: 'var(--color-neutral-300)',
          backgroundColor: 'white',
          padding: '0.625rem 0.75rem',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          color: 'var(--color-neutral-900)',
          '&:focus': {
            outline: 'none',
            borderColor: 'var(--color-primary-500)',
            boxShadow: '0 0 0 1px var(--color-primary-500)',
          },
          '&::placeholder': {
            color: 'var(--color-neutral-400)',
          },
          '&:disabled': {
            backgroundColor: 'var(--color-neutral-100)',
            opacity: '0.65',
          },
        },
        '.form-label': {
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          lineHeight: '1.25rem',
          color: 'var(--color-neutral-700)',
        },
        '.form-checkbox': {
          borderRadius: '0.25rem',
          borderWidth: '1px',
          borderColor: 'var(--color-neutral-300)',
          color: 'var(--color-primary-600)',
          '&:focus': {
            outline: 'none',
            boxShadow: '0 0 0 2px var(--color-primary-200)',
          },
        },
        '.form-radio': {
          borderRadius: '9999px',
          borderWidth: '1px',
          borderColor: 'var(--color-neutral-300)',
          color: 'var(--color-primary-600)',
          '&:focus': {
            outline: 'none',
            boxShadow: '0 0 0 2px var(--color-primary-200)',
          },
        },
        '.card': {
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
        },
        '.card-hover': {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
        '.glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px) saturate(180%)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        },
        '.glass-dark': {
          backgroundColor: 'rgba(17, 24, 39, 0.8)',
          backdropFilter: 'blur(12px) saturate(180%)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      })
    },
  ],
}