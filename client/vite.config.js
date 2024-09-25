import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Here, you can include any additional configurations if needed
      output: {
        // Optional: Customize output options
      },
      // No need to externalize imagekitio-react
    }
  }
});
