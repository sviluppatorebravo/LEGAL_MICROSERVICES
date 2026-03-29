import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isMonolith = process.env.MONOLITH_MODE === 'true';
const target = isMonolith ? 'http://localhost:5001' : 'http://localhost:5220';

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_MONOLITH_MODE': JSON.stringify(isMonolith ? 'true' : 'false'),
  },
  server: {
    port: 3200,
    host: true,
    proxy: {
      '/api': {
        target,
        changeOrigin: true,
        rewrite: isMonolith
          ? (path) => {
              // Don't rewrite gateway-level endpoints
              if (path.startsWith('/api/health') || path.startsWith('/api/gateway/')) {
                return path;
              }
              return path.replace(/^\/api/, '/api/legal');
            }
          : undefined,
      },
    },
  },
});
