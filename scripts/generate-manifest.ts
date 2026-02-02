import fs from 'fs';
import path from 'path';
import { buildManifest } from '../src/manifest';

async function generateManifest() {
    const rootDir = process.cwd();
    const distDir = path.join(rootDir, 'dist');
    const manifestFile = path.join(distDir, 'manifest.json');

    console.log('--- GENERATING MANIFEST.JSON ---');

    // 1. Ensure dist exists
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    // 2. Build manifest object
    const manifest = buildManifest();

    // 3. Write to dist/manifest.json
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));

    console.log(`✓ Manifest generated at: ${manifestFile}`);
}

generateManifest().catch(console.error);
