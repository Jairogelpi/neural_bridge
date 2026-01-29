import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { buildManifest } from "../src/manifest";

const dist = resolve(process.cwd(), "dist");
mkdirSync(dist, { recursive: true });

const manifest = buildManifest();
writeFileSync(resolve(dist, "manifest.json"), JSON.stringify(manifest, null, 2), "utf-8");

console.log("manifest.json generated");
