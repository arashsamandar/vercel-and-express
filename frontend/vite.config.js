import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    outDir: 'build', // Change the output directory to 'build'
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js', // or .js
    // you can add more options here
  }
})
