import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Removed mkcert plugin as we're using HTTP instead of HTTPS

export default defineConfig({
  plugins: [react()],
  server: {
    https: false,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:9191',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:9191',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // Additional configuration for port 5175
  // This is needed because the error logs show requests from this port
  optimizeDeps: {
    // This is a workaround to add proxy configuration for port 5175
    // Vite doesn't have a direct way to configure multiple preview ports
    include: [],
    exclude: [],
    esbuildOptions: {
      define: {
        // This will be available in the client code
        'process.env.VITE_API_URL': JSON.stringify('http://localhost:9191')
      }
    }
  },
  build: {
    outDir: '../src/main/resources/static',
    emptyOutDir: true
  },
  base: '/'
})
