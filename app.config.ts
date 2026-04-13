import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import checker from "vite-plugin-checker";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  vite: {
    plugins: [tailwindcss(), /*eslint(), checker({ typescript: false })*/],
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
      },
      proxy: {
        '/api/v1': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
  },
});
