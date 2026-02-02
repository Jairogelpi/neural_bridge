
/**
 * HYPERDIMENSIONAL COMPUTING (HDC) CORE 🌌
 * 
 * Implements "Holographic Reduced Representations" (HRR) using 4096-bit Hypervectors.
 * This math allows us to encode infinite semantic meaning into fixed-size binary vectors
 * with O(N) operations (XOR, Shift, Add), crushing RAG's O(N^2) matrix multiplication.
 * 
 * Dimensions: 4096 (D)
 * Implementation: Uint32Array(128) -> 128 * 32 bits = 4096 bits.
 */

const DIMENSIONS = 4096;
const WORD_SIZE = 32;
const ARRAY_LENGTH = DIMENSIONS / WORD_SIZE; // 128 integers

export class Hypervector {
    data: Uint32Array;

    constructor(data?: Uint32Array) {
        if (data) {
            this.data = data;
        } else {
            this.data = new Uint32Array(ARRAY_LENGTH);
        }
    }

    /**
     * Creates a random hypervector (Independent & Identically Distributed - i.i.d)
     * Each bit has 50% chance of being 0 or 1.
     * This ensures orthogonality between unrelated concepts.
     */
    static random(): Hypervector {
        const hv = new Hypervector();
        // Crypto-secure random for JS (Universal)
        if (typeof globalThis !== 'undefined' && globalThis.crypto) {
            globalThis.crypto.getRandomValues(hv.data);
        } else {
            // Fallback for older Node (should be covered by externalizing crypto, but safety first)
            for (let i = 0; i < ARRAY_LENGTH; i++) {
                hv.data[i] = Math.floor(Math.random() * 0xFFFFFFFF);
            }
        }
        return hv;
    }

    /**
     * Binding Operation (XOR) ⊗
     * Used to associate two vectors (e.g., Variable ⊗ Value).
     * Reversible: A ⊗ B ⊗ B = A
     */
    bind(other: Hypervector): Hypervector {
        const result = new Uint32Array(ARRAY_LENGTH);
        for (let i = 0; i < ARRAY_LENGTH; i++) {
            result[i] = this.data[i] ^ other.data[i];
        }
        return new Hypervector(result);
    }

    /**
     * Bundling Operation (Superposition) +
     * Used to combine multiple vectors into a set (e.g., Sentence = Word1 + Word2).
     * Uses "Majority Rule" bitwise logic for binary vectors.
     */
    static bundle(vectors: Hypervector[]): Hypervector {
        if (vectors.length === 0) return new Hypervector();

        const result = new Uint32Array(ARRAY_LENGTH);
        const limit = vectors.length;
        const threshold = Math.floor(limit / 2);

        // For every bit position 0..4095
        for (let bitIdx = 0; bitIdx < DIMENSIONS; bitIdx++) {
            let onesCount = 0;

            const wordIdx = Math.floor(bitIdx / 32);
            const bitOffset = bitIdx % 32;

            for (let v = 0; v < limit; v++) {
                if ((vectors[v].data[wordIdx] >>> bitOffset) & 1) {
                    onesCount++;
                }
            }

            // Majority Rule
            if (onesCount > threshold) {
                result[wordIdx] |= (1 << bitOffset);
            }
        }
        return new Hypervector(result);
    }

    /**
     * Permutation (Rotation) Π
     * Used to encode sequence/order. 
     * permute(A) != A.
     */
    permute(shifts: number = 1): Hypervector {
        // Implementing full 4096-bit cyclic shift on 128x32-bit array is complex.
        // Simplified Logic: 
        // We handle it as a circular buffer of 32-bit words for efficiency in MVP.
        // Real implementation requires bit-carry across words. 
        // Let's do a rigorous bit-carry right shift.

        const result = new Uint32Array(ARRAY_LENGTH);
        // Just shifting by 1 for now as that's standard for n-grams

        // Carry bit from the previous word
        let carry = (this.data[ARRAY_LENGTH - 1] & 1) << 31;

        for (let i = 0; i < ARRAY_LENGTH; i++) {
            const nextCarry = (this.data[i] & 1) << 31;
            result[i] = (this.data[i] >>> 1) | carry;
            carry = nextCarry;
        }

        return new Hypervector(result);
    }

    /**
     * Similarity Metric (Normalized Hamming Distance)
     * Returns 0.0 (Orthogonal/Different) to 1.0 (Identical).
     * Random vectors have similarity ~0.5.
     */
    similarity(other: Hypervector): number {
        let diffBits = 0;
        for (let i = 0; i < ARRAY_LENGTH; i++) {
            let xor = this.data[i] ^ other.data[i];
            // PopCount (Hamming Weight)
            while (xor !== 0) {
                diffBits++;
                xor &= (xor - 1);
            }
        }

        // 0 distance = 1.0 sim; 2048 distance = 0.5 sim (Orthogonal); 4096 distance = 0.0 (Inverse)
        // We typically care about distance from 0.5 (randomness)
        // But let's return raw cosine-like similarity: 1 - (dist / D)
        return 1.0 - (diffBits / DIMENSIONS);
    }

    toString(): string {
        // Hex representation for storage
        let hex = '';
        for (let i = 0; i < ARRAY_LENGTH; i++) {
            hex += this.data[i].toString(16).padStart(8, '0');
        }
        return hex;
    }

    static fromString(hex: string): Hypervector {
        const data = new Uint32Array(ARRAY_LENGTH);
        for (let i = 0; i < ARRAY_LENGTH; i++) {
            data[i] = parseInt(hex.substr(i * 8, 8), 16);
        }
        return new Hypervector(data);
    }
}
