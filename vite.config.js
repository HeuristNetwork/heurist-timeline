import { defineConfig } from "vite";
import packageJson from "./package.json" with { type: "json" };
export default defineConfig({
  base: "./",
  define: { HEURIST_MODULE_VERSION: JSON.stringify(packageJson.version) },
  build: {
    outDir: "dist", emptyOutDir: true, sourcemap: true,
    rollupOptions: {
      input: "src/main.js",
      output: {
        entryFileNames: "heurist-timeline.js",
        chunkFileNames: "heurist-timeline-[name].js",
        assetFileNames: "heurist-timeline-[name][extname]"
      }
    }
  },
  server: { host: "127.0.0.1", port: 5176 }
});
