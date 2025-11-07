// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     host: true,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:8001',  // Fixed: backend runs on 8001
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, '')
//       }
//     }
//   }
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: [
      'spirit-intervention-dover-professionals.trycloudflare.com',
      '.trycloudflare.com' // Allow all cloudflare tunnel subdomains
    ],
    proxy: {
      '/api': {
        target: 'https://bite-oldest-sign-lucky.trycloudflare.com',  // Fixed: backend runs on 8001
        changeOrigin: true,
        // Don't rewrite /api - backend routes already have /api prefix
      }
    }
  }
})
