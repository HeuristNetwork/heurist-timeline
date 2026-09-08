/**
 * @file vite.config.js
 * @brief Vite build configuration for the Heurist timeline module.
 * @project     Heurist academic knowledge management system
 * @package     heurist-timeline
 * @link        https://HeuristNetwork.org
 * @copyright   (C) 2024 onwards Heurist Network
 * @author      Artem Osmakov   <osmakov@gmail.com>
 * @author      Ian Johnson <ian.johnson.heurist@gmail.com>
 * @license     https://www.gnu.org/licenses/gpl-3.0.txt GNU License 3.0
 * @since       8.0
 */

import { defineConfig } from "vite";
import packageJson from "./package.json" with { type: "json" };

export default defineConfig({
  base: "./",
  define: {
    HEURIST_MODULE_VERSION: JSON.stringify(packageJson.version),
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: "src/main.js",
      output: {
        entryFileNames: "heurist-timeline.js",
        chunkFileNames: "heurist-timeline-[name].js",
        assetFileNames: "heurist-timeline-[name][extname]",
      },
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5176,
  },
});
