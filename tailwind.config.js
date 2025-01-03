/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                mono: ['Fira Code', 'monospace'],
            },
        },
    },
    plugins: [],
}