import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // used to be '/B2bsupplychaindashboard/',
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    // The Foundry demo's sign-in gate is a Cloudflare Pages Function, which Vite
    // does not run. Forward its routes to `npm run dev:foundry` (wrangler, :8788).
    proxy: {
      '^/foundry(-login)?(/|$)': 'http://localhost:8788',
      '/api/foundry-session': 'http://localhost:8788',
      '^/seed(-login)?(/|$)': 'http://localhost:8788',
      '/api/seed-session': 'http://localhost:8788',
      '/api/contact': 'http://localhost:8788',
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
