import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  devServer: {
      proxy: {
        '/steamData': 'http://localhost:3001',
        '/user': 'http://localhost:3001',
      }
  }
});