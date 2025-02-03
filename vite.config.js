import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  envPrefix: 'VITE_',
  define: {
    'process.env.VITE_ELEVENLABS_API_KEY': JSON.stringify(process.env.VITE_ELEVENLABS_API_KEY)
  }
})