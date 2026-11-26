import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vue from "@vitejs/plugin-vue";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  base: "./",
  plugins: [react(), vue(), svelte()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, "index.html"),
        react: resolve(import.meta.dirname, "apps/react/index.html"),
        vue: resolve(import.meta.dirname, "apps/vue/index.html"),
        svelte: resolve(import.meta.dirname, "apps/svelte/index.html")
      }
    }
  }
});
