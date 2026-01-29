import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
    build: {
        outDir: "dist",
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            input: {
                // MV3 service worker
                service_worker: resolve(__dirname, "src/background/service_worker.ts"),
                // content script entry
                content: resolve(__dirname, "src/content/index.ts"),
                // popup UI
                popup: resolve(__dirname, "src/ui/popup.html"),
                // manifest generation happens via plugin-like hook below
            },
            output: {
                entryFileNames: (chunk) => {
                    if (chunk.name === "service_worker") return "background/service_worker.js";
                    if (chunk.name === "content") return "content/index.js";
                    return "assets/[name].js";
                }
            }
        }
    }
});
