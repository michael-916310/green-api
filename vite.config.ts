import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const greenApiHost = env.VITE_GREEN_API_HOST || 'https://api.green-api.com'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, 'src'),
      },
    },
    server: {
      // Windows: Vite may bind only to [::1]; browsers often hit 127.0.0.1
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
      proxy: {
        '/green-api': {
          target: greenApiHost,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/green-api/, ''),
          secure: true,
        },
      },
    },
    preview: {
      proxy: {
        '/green-api': {
          target: greenApiHost,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/green-api/, ''),
          secure: true,
        },
      },
    },
  }
})
