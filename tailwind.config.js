/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Preserve your existing color system
        'bg': '#f8fafc',
        'surface': '#ffffff',
        'surface-soft': '#f8fbff',
        'text': '#0f172a',
        'text-muted': '#52525b',
        'text-subtle': '#6b7280',
        'border': '#d1d5db',
        'border-focus': '#2563eb',
        'border-danger': '#dc2626',
        'primary': '#2563eb',
        'primary-dark': '#1d4ed8',
        // Add navy blue as accent color per your preference
        'navy': '#0f172a',
        'navy-dark': '#020617',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'pill': '999px',
      },
      boxShadow: {
        'soft': '0 16px 36px rgba(15, 23, 42, 0.06)',
        'medium': '0 18px 36px rgba(15, 23, 42, 0.08)',
      },
      fontFamily: {
        'sans': ['system-ui', 'Inter', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}