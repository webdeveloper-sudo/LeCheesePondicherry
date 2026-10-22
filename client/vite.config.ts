import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import seoPrerender from "./vite-plugin-seo";

export default defineConfig({
  plugins: [react(), seoPrerender()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
  },
});


