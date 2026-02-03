import { defineConfig, loadEnv } from "vite";
import { resolve } from "node:path";

// Custom plugin to generate manifest.json
function generateManifest() {
    return {
        name: 'generate-manifest',
        async writeBundle() {
            const { buildManifest } = await import('./src/manifest');
            const manifest = buildManifest();
            // Verify path logic: typically dist is flat, but let's check input
            // Update popup path if needed based on Vite output
            // For now assuming Vite keeps structure or we align with it.
            // Actually, let's ensure default_popup matches output.
            // Earlier file view of dist showed 'src/ui/popup.html' structure.

            // @ts-ignore - Rollup plugin context
            this.emitFile({
                type: 'asset',
                fileName: 'manifest.json',
                source: JSON.stringify(manifest, null, 2)
            });
        }
    };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [generateManifest()],
        build: {
            outDir: "dist",
            emptyOutDir: true,
            sourcemap: true,
            rollupOptions: {
                input: {
                    // MV3 service worker
                    service_worker: resolve(__dirname, "src/background.ts"),
                    // popup UI
                    popup: resolve(__dirname, "src/ui/popup.html"),
                },
                output: {
                    entryFileNames: (chunk) => {
                        if (chunk.name === "service_worker") return "background/service_worker.js";
                        return "assets/[name].js";
                    }
                }
            }
        },
        define: {
            "process.env.SUPABASE_URL": JSON.stringify(env.SUPABASE_URL || process.env.SUPABASE_URL),
            "process.env.SUPABASE_ANON_KEY": JSON.stringify(env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY),
            "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV || process.env.NODE_ENV || "production"),
        },
    };
});
