import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

async function bundleExtension() {
    const rootDir = process.cwd();
    const distDir = path.join(rootDir, 'dist');
    const outDir = path.join(rootDir, 'releases');
    const outFile = path.join(outDir, 'neural-bridge-extension.zip');

    console.log('--- PACKAGING EXTENSION FOR WEB STORE ---');

    // 1. Ensure output directory exists
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    // 2. Create a file to stream archive data to.
    const output = fs.createWriteStream(outFile);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    // Listen for all archive data to be written
    output.on('close', function () {
        console.log(`✓ Bundle complete: ${outFile}`);
        console.log(`✓ Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
    });

    archive.on('error', function (err) {
        throw err;
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // Append files from dist directory
    archive.directory(distDir, false);

    // Finalize the archive
    await archive.finalize();

    console.log('--- PACKAGING COMPLETE ---');
}

bundleExtension().catch(console.error);
