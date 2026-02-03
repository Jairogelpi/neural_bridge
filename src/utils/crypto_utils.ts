/**
 * Universal Crypto Utilities
 * Uses Web Crypto API for browser compatibility.
 */

export const cryptoUtils = {
    /**
     * Generate a SHA-256 hash (hex string)
     */
    async sha256(data: string): Promise<string> {
        const msgBuffer = new TextEncoder().encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    },

    /**
     * Generate secure random bytes as hex string
     */
    randomHex(length: number): string {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
    },

    /**
     * Generate HMAC-SHA256 signature
     */
    async hmacSha256(key: string, data: string): Promise<string> {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(key);
        const dataData = encoder.encode(data);

        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );

        const signature = await crypto.subtle.sign(
            'HMAC',
            cryptoKey,
            dataData
        );

        return Array.from(new Uint8Array(signature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
};
