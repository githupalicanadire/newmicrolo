import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:6004",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/identity": {
        target: "http://localhost:6006",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/identity/, ""),
      },
    },
  },
});
