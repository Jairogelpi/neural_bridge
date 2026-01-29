export async function sha256Hex(text: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function computeEvidenceFingerprints(content: string) {
    const sha256 = await sha256Hex(content);
    // Rolling64 stub (deterministic but simple)
    let rolling64 = 0n;
    for (let i = 0; i < content.length; i++) {
        rolling64 = (rolling64 << 5n) - rolling64 + BigInt(content.charCodeAt(i));
    }
    return {
        sha256,
        rolling64_dec: rolling64.toString()
    };
}
