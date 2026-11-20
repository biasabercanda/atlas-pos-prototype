/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    // Vitest blanks CSS imports by default; motion.test.ts reads tokens.css as text.
    css: { include: [/tokens\.css/] },
  },
})
