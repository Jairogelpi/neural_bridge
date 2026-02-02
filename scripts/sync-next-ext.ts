import fs from 'fs-extra';
import path from 'path';

async function buildNextExt() {
    const rootDir = process.cwd();
    const dashboardOut = path.join(rootDir, 'dashboard', 'out');
    const extDist = path.join(rootDir, 'dist');

    console.log('--- SYNCING NEXT.JS EXTENSION ASSETS ---');

    // 1. Ensure dist exists
    if (!fs.existsSync(extDist)) {
        fs.mkdirSync(extDist, { recursive: true });
    }

    // 2. Copy extension.html
    const popupHtml = path.join(dashboardOut, 'extension.html');
    if (fs.existsSync(popupHtml)) {
        fs.copyFileSync(popupHtml, path.join(extDist, 'extension.html'));
        console.log('✓ Copied extension.html');
    }

    // 3. Copy _next static assets (critical for React/Next functionality)
    const nextStatic = path.join(dashboardOut, '_next');
    if (fs.existsSync(nextStatic)) {
        fs.copySync(nextStatic, path.join(extDist, '_next'), { overwrite: true });
        console.log('✓ Copied _next static assets');
    }

    console.log('--- SYNC COMPLETE ---');
}

buildNextExt().catch(console.error);
