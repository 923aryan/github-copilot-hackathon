/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
	theme: {
		extend: {
			colors: {
				main: 'var(--main)',
				overlay: 'var(--overlay)',
				bg: 'var(--bg)',
				bw: 'var(--bw)',
				blank: 'var(--blank)',
				text: 'var(--text)',
				mtext: 'var(--mtext)',
				border: 'var(--border)',
				ring: 'var(--ring)',
				ringOffset: 'var(--ring-offset)',
				secondaryBlack: '#212121',
			},
			borderRadius: {
				base: '20px'
			},
			boxShadow: {
				shadow: 'var(--shadow)'
			},
			translate: {
				boxShadowX: '6px',
				boxShadowY: '6px',
				reverseBoxShadowX: '-6px',
				reverseBoxShadowY: '-6px',
			},
			fontWeight: {
				base: '550',
				heading: '600',
			},
			fontFamily: {
				montserrat: ['Montserrat', 'sans-serif'],
			},
		},
		screens: {
			'sm': { 'max': '639px' },
			// => @media (max-width: 639px) { ... }

			'md': { 'max': '767px' },
			// => @media (max-width: 767px) { ... }

			'lg': { 'max': '1023px' },
			// => @media (max-width: 1023px) { ... }

			'xl': { 'max': '1279px' },
			// => @media (max-width: 1279px) { ... }

			'2xl': { 'max': '1535px' },
			// => @media (max-width: 1535px) { ... }

			// Min sizes
			'min-sm': { 'min': '640px' },
			'min-md': { 'min': '768px' },
			'min-lg': { 'min': '1024px' },
			'min-xl': { 'min': '1280px' },
			'min-2xl': { 'min': '1536px' },
		},
	},
	plugins: [require("tailwindcss-animate")],
}

