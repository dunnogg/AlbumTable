/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate'

export default {
	darkMode: ['class'],
	content: ['./index.html', './src/**/*.{ts,js,vue,tsx,jsx}'],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				primary: '#1e293b',
				secondary: '#64748b'
			}
		}
	},
	plugins: [tailwindcssAnimate]
}
