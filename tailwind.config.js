/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'main-light': '#f0f3f2',
        'primary': '#00cc74',
        'dark-primary': '#01854c',
      },
      animation: {
        wiggle: 'wiggle 0.3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(10deg)' },
        },
      },
      container: {
        center: true,
        padding: '16px',
        screens: {
          sm: '576px',
          md: '768px',
          lg: '1024px',
          xl: '1200px',
          '2xl': '1400px',
        },
      },
    },
  },
  plugins: [],
};
