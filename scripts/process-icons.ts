import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function processIcons() {
    const rootDir = process.cwd();
    const sourceIcon = path.join(rootDir, 'scripts', 'base-icon-minimal.png');
    const distIconsDir = path.join(rootDir, 'dist', 'icons');

    console.log('--- PROCESSING EXTENSION ICONS ---');

    if (!fs.existsSync(distIconsDir)) {
        fs.mkdirSync(distIconsDir, { recursive: true });
    }

    const sizes = [16, 32, 48, 128];

    for (const size of sizes) {
        const targetPath = path.join(distIconsDir, `icon${size}.png`);
        await sharp(sourceIcon)
            .resize(size, size)
            .toFile(targetPath);
        console.log(`✓ Generated: icon${size}.png`);
    }

    console.log('--- ICON PROCESSING COMPLETE ---');
}

processIcons().catch(console.error);
