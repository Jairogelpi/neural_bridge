import { sha256Hex } from "./fingerprints";

/**
 * Standardizes a string for deterministic hashing.
 */
export function canonicalize(text: string): string {
    return text.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Computes a deterministic hash of the crystal content.
 * Recursively canonicalizes keys and values for SCP sealing.
 */
export async function computeCanonicalHash(crystal: unknown): Promise<string> {
    const parts: string[] = [];

    function walk(obj: unknown) {
        if (obj === null || obj === undefined) return;
        if (typeof obj !== "object") {
            parts.push(canonicalize(String(obj)));
            return;
        }
        if (Array.isArray(obj)) {
            // Sort array elements if they are strings to ensure order-independence
            // but for SCP we generally keep array order as meaningful (e.g. turns)
            for (const item of obj) walk(item);
            return;
        }

        // Sort keys for deterministic object representation
        const typedObj = obj as Record<string, unknown>;
        const keys = Object.keys(typedObj).sort();
        for (const k of keys) {
            if (k === "verification") continue; // Result field, skip to avoid recursion
            parts.push(k);
            walk(typedObj[k]);
        }
    }

    walk(crystal);
    return await sha256Hex(parts.join("|"));
}
