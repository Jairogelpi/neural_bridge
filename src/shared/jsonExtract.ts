// JSON Extraction Utility
// Robust extractor for JSON from mixed LLM responses

/**
 * Extract the first JSON object or array from a string
 * Handles markdown fences, extra text, and nested structures
 */
export function extractFirstJSON(text: string): any {
    // Remove markdown code fences
    let cleaned = text
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

    // Try direct parse first
    try {
        return JSON.parse(cleaned);
    } catch {
        // Continue with extraction
    }

    // Find first { or [
    const objStart = cleaned.indexOf("{");
    const arrStart = cleaned.indexOf("[");

    // Determine which comes first
    let start = -1;
    let isArray = false;

    if (objStart >= 0 && (arrStart < 0 || objStart < arrStart)) {
        start = objStart;
        isArray = false;
    } else if (arrStart >= 0) {
        start = arrStart;
        isArray = true;
    }

    if (start < 0) {
        throw new Error("No JSON found in text");
    }

    const openChar = isArray ? "[" : "{";
    const closeChar = isArray ? "]" : "}";

    // Find matching closing bracket
    let depth = 0;
    let inString = false;
    let escape = false;

    for (let i = start; i < cleaned.length; i++) {
        const ch = cleaned[i];

        if (inString) {
            if (escape) {
                escape = false;
                continue;
            }
            if (ch === "\\") {
                escape = true;
                continue;
            }
            if (ch === '"') {
                inString = false;
            }
            continue;
        }

        if (ch === '"') {
            inString = true;
            continue;
        }

        if (ch === openChar) {
            depth++;
        } else if (ch === closeChar) {
            depth--;
            if (depth === 0) {
                const jsonStr = cleaned.slice(start, i + 1);
                try {
                    return JSON.parse(jsonStr);
                } catch (e) {
                    throw new Error(`Invalid JSON: ${(e as Error).message}`);
                }
            }
        }
    }

    throw new Error("Unbalanced JSON structure");
}
