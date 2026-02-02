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

        // Rename _next to nx in HTML
        content = content.replace(/\/_next\//g, '/nx/');

        // --- MV3 FIX: Extract Inline Scripts ---
        // Chrome MV3 does NOT allow inline scripts. We must move them to external files.
        const inlineScripts: string[] = [];
        content = content.replace(/<script(?![^>]*src)([^>]*)>([\s\S]*?)<\/script>/gi, (match, attrs, code) => {
            const fileName = `nx-inline-${inlineScripts.length}.js`;
            fs.writeFileSync(path.join(extDist, fileName), code);
            inlineScripts.push(fileName);
            // Using relative source for common directory
            return `<script ${attrs} src="${fileName}"></script>`;
        });

        fs.writeFileSync(targetPopup, content);
        console.log(`✓ Copied & Patched extension.html (Extracted ${inlineScripts.length} inline scripts)`);
    }

    // 3. Copy _next static assets (renaming to nx)
    const nextStatic = path.join(dashboardOut, '_next');
    if (fs.existsSync(nextStatic)) {
        const targetNext = path.join(extDist, 'nx');
        fs.copySync(nextStatic, targetNext, { overwrite: true });

        // Recursively search and replace in copied assets (CSS/JS files)
        const files = getAllFiles(targetNext);
        for (const fullPath of files) {
            if (fs.statSync(fullPath).isFile() && (fullPath.endsWith('.js') || fullPath.endsWith('.css'))) {
                let content = fs.readFileSync(fullPath, 'utf-8');
                content = content.replace(/\/_next\//g, '/nx/');
                fs.writeFileSync(fullPath, content);
            }
        }
        console.log('✓ Copied & Renamed _next static assets to nx');
    }

    console.log('--- SYNC COMPLETE ---');
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    });
    return arrayOfFiles;
}

buildNextExt().catch(console.error);
