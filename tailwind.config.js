/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        sm: '0 1px 2px 0 hsl(var(--primary) / 0.15)',
        DEFAULT: '0 1px 3px 0 hsl(var(--primary) / 0.15), 0 1px 2px -1px hsl(var(--primary) / 0.15)',
        md: '0 4px 6px -1px hsl(var(--primary) / 0.15), 0 2px 4px -2px hsl(var(--primary) / 0.15)',
        lg: '0 10px 15px -3px hsl(var(--primary) / 0.15), 0 4px 6px -4px hsl(var(--primary) / 0.15)',
        xl: '0 20px 25px -5px hsl(var(--primary) / 0.15), 0 8px 10px -6px hsl(var(--primary) / 0.15)',
        '2xl': '0 25px 50px -12px hsl(var(--primary) / 0.25)',
        inner: 'inset 0 2px 4px 0 hsl(var(--primary) / 0.15)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        scroll: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
        'fade-in-down': {
          'from': { opacity: '0', transform: 'translateY(-20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'u-exit': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '40%': { transform: 'translateY(3rem) scale(0.9)', opacity: '1' },
          '100%': { transform: 'translateY(-100vh) scale(0.5)', opacity: '0' },
        },
        'typing': {
          'from': { width: '0' },
          'to': { width: '100%' }
        },
        're-enter': {
          'from': { opacity: '0', transform: 'translateY(20px) scale(0.8)' },
          'to': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'scroll': 'scroll 60s linear infinite',
        'fade-in-down': 'fade-in-down 0.5s ease-out forwards',
        'u-exit': 'u-exit 1s ease-in forwards',
        'typing': 'typing 1.5s steps(30, end) forwards',
        're-enter': 're-enter 0.5s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
