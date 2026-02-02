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

    // 2. Copy extension.html & Patch references
    const popupHtml = path.join(dashboardOut, 'extension.html');
    const targetPopup = path.join(extDist, 'extension.html');
    if (fs.existsSync(popupHtml)) {
        let content = fs.readFileSync(popupHtml, 'utf-8');
        // Rename _next to nx in HTML to bypass Chrome reserved prefix error
        content = content.replace(/\/_next\//g, '/nx/');
        fs.writeFileSync(targetPopup, content);
        console.log('✓ Copied & Patched extension.html');
    }

    // 3. Copy _next static assets (renaming to nx)
    const nextStatic = path.join(dashboardOut, '_next');
    if (fs.existsSync(nextStatic)) {
        const targetNext = path.join(extDist, 'nx');
        fs.copySync(nextStatic, targetNext, { overwrite: true });

        // Recursively search and replace in copied assets (CSS/JS files)
        const files = fs.readdirSync(targetNext, { recursive: true }) as string[];
        for (const file of files) {
            const fullPath = path.join(targetNext, file);
            if (fs.statSync(fullPath).isFile() && (file.endsWith('.js') || file.endsWith('.css'))) {
                let content = fs.readFileSync(fullPath, 'utf-8');
                content = content.replace(/\/_next\//g, '/nx/');
                fs.writeFileSync(fullPath, content);
            }
        }
        console.log('✓ Copied & Renamed _next static assets to nx');
    }

    console.log('--- SYNC COMPLETE ---');
}

buildNextExt().catch(console.error);
