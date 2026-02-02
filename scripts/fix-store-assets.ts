import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

async function fixAssets() {
    const rootDir = process.cwd();
    const assetsDir = path.join(rootDir, 'store-assets');

    console.log('--- RE-SCALING STORE ASSETS TO EXACT PIXELS ---');

    const tasks = [
        {
            src: path.join(assetsDir, 'promo-tile-440x280.png'),
            width: 440,
            height: 280,
            name: 'Promotional Tile'
        },
        {
            src: path.join(assetsDir, 'hero-marquee-1400x560.png'),
            width: 1400,
            height: 560,
            name: 'Hero Marquee'
        }
    ];

    for (const task of tasks) {
        if (fs.existsSync(task.src)) {
            const buffer = fs.readFileSync(task.src);
            await sharp(buffer)
                .resize(task.width, task.height, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 1 } // White background for minimalist style
                })
                .toFile(task.src + '.tmp');

            fs.unlinkSync(task.src);
            fs.renameSync(task.src + '.tmp', task.src);
            console.log(`✓ Fixed ${task.name}: ${task.width}x${task.height}`);
        }
    }

    console.log('--- ASSET FIX COMPLETE ---');
}

fixAssets().catch(console.error);
