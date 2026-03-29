import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isMonolith = process.env.MONOLITH_MODE === 'true';
const target = isMonolith ? 'http://localhost:5001' : 'http://localhost:5220';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3200,
    host: true,
    proxy: {
      '/api': {
        target,
        changeOrigin: true,
        rewrite: isMonolith
          ? (path) => {
              const parts = path.split('/');
              if (parts.length >= 4) {
                parts.splice(2, 1);
                parts.splice(1, 1, 'api/legal');
                return parts.join('/');
              }
              return path.replace(/^\/api/, '/api/legal');
            }
          : undefined,
      },
    },
  },
});
