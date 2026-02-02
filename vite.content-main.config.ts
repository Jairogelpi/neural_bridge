import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
    build: {
        outDir: "dist",
        emptyOutDir: false,
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, "src/content/index.ts"),
            formats: ["iife"],
            name: "NeuralBridgeContent",
            fileName: () => "content/index.js",
        },
    },
    define: {
        "process.env.SUPABASE_URL": JSON.stringify(process.env.SUPABASE_URL),
        "process.env.SUPABASE_ANON_KEY": JSON.stringify(process.env.SUPABASE_ANON_KEY),
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
    },
});
