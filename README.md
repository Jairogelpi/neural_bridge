# Neural Bridge (MV3)

Semantic Continuity Protocol (SCP) bridge with verifiable context transfer.

## Project Structure
- `core/`: SCP standard implementation (stable, testable).
- `content/hosts/`: Adapters for specific AI hosts (ChatGPT, Gemini, Claude).
- `background/`: MV3 service worker for orchestration and storage.
- `ui/`: Extension popup.
- `scripts/`: Build and manifest generation scripts.

## Dev
1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the extension:
   ```bash
   npm run build
   ```
3. Generate the manifest:
   ```bash
   node scripts/build-manifest.ts
   ```
4. Load the `dist/` directory as an unpacked extension in Chrome.

## CI
Run the full verification suite:
```bash
npm run ci
```
