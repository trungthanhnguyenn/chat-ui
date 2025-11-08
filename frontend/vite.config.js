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
    host: '0.0.0.0',
    strictPort: false,
    
    // IMPORTANT: Disable host check for cloudflare tunnel
    allowedHosts: true,
    
    // Disable HMR over cloudflare tunnel to prevent reload loop
    hmr: false,
    
    // Proxy API requests to local backend (for local development only)
    // When using cloudflare tunnels, set VITE_API_URL in .env instead
    proxy: {
      '/api': {
        target: 'http://localhost:8001',  // Local backend
        changeOrigin: true,
        secure: false,
      }
    }
  }
})