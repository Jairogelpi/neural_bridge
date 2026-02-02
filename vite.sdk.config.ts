import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'NeuralBridge',
            fileName: (format) => `neural-bridge.${format}.js`,
            formats: ['es', 'cjs']
        },
        outDir: 'dist/sdk',
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            // Externalize deps that shouldn't be bundled if any
            // For Zero Friction, we usually BUNDLE everything (Universal)
            // But 'pg' and 'express' are Node-only. 
            // We should externalize them to avoid browser errors, or ensure code paths using them
            // are tree-shaken out or mocked.
            // SemanticHasher is now universal.
            // Supabase-js is universal.
            // However, src/server.ts imports express/pg. src/index.ts imports TruthVault -> Supabase.
            // We should be fine strictly bundling src/index.ts if it doesn't import server.ts.
            external: ['pg', 'express', 'dotenv', 'crypto'],
            output: {
                globals: {
                    pg: 'pg',
                    express: 'express',
                    dotenv: 'dotenv',
                    crypto: 'crypto'
                }
            }
        }
    },
    define: {
        "process.env.SUPABASE_URL": JSON.stringify(process.env.SUPABASE_URL),
        "process.env.SUPABASE_ANON_KEY": JSON.stringify(process.env.SUPABASE_ANON_KEY),
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
    }
});
