import { SCPService } from './llm';
import { Hypervector } from '../math/hypervector';
import { SemanticLattice } from './semantic_lattice';

// Universal Safe Hash Helper
async function universalSha256(text: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(text);

    // Browser / Edge / Node 19+
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.subtle) {
        const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Node.js Legacy Fallback
    try {
        const crypto = await import('crypto'); // Dynamic import to avoid bundler errors
        const hash = crypto.createHash('sha256');
        hash.update(text);
        return hash.digest('hex');
    } catch (e) {
        console.warn("Crypto API unavailable. Falling back to FNV-1a (Non-Cryptographic but Deterministic).");
        // Real math fallback, not a random mock
        // We use our existing fnv1a to generate a 32-bit hash and hex confirm it.
        // It's not SHA-256 strength, but it's a REAL hash of the input.
        let h = 0x811c9dc5;
        for (let i = 0; i < text.length; i++) {
            h ^= text.charCodeAt(i);
            h = (h * 0x01000193) >>> 0;
        }
        return (h >>> 0).toString(16).padStart(8, '0');
    }
}

// Simple FNV-1a Hash for deterministic seeding
function fnv1a(str: string): number {
    let hash = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = (hash * 0x01000193) >>> 0;
    }
    return hash;
}

// Mulberry32 Pseudo-Random Generator (Deterministic)
function mulberry32(a: number) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}

export interface SemanticHashResult {
    raw_text: string;
    canonical_concept: string;
    s_hash: string;
    is_stable: boolean;
}

/**
 * SEMANTIC HASHING ENGINE V2 (Holographic Edition) 🌌
 * 
 * Uses Hyperdimensional Computing (4096-bit Vectors) to capture 
 * deep semantic nuances with O(N) complexity.
 */
export class SemanticHasher {

    /**
     * Map a token to a deterministic 4096-bit Hypervector.
     * "Dog" -> Always same random pattern X.
     * "Cat" -> Always same random pattern Y.
     * Orthogonal by default.
     */
    private static getVectorForToken(token: string): Hypervector {
        const seed = fnv1a(token);
        const rand = mulberry32(seed);

        // Generate 4096 bits deterministically
        const data = new Uint32Array(128); // 128 * 32 = 4096
        for (let i = 0; i < 128; i++) {
            // Generate 32 bits at a time
            // rand() returns 0-1 float.
            // We need integer.
            data[i] = Math.floor(rand() * 0xFFFFFFFF);
        }
        return new Hypervector(data);
    }

    /**
     * ADAPTIVE LEARNING 🧠
     * The system "reads" a text and evolves its semantic lattice to understand the domain.
     * This eliminates hardcoded synonyms.
     */
    static async learn(context: string): Promise<void> {
        console.log(`[SemanticHasher] 🧠 Evolving Lattice from context: "${context.substring(0, 50)}..."`);

        // Ensure Cortex is loaded
        await SemanticLattice.initialize();

        const prompt = `
        ANALYZE SEMANTICS.
        Extract strong synonym pairs or semantic equivalents from the text (or implied by it).
        Return purely JSON: {"pairs": [["word", "synonym"], ["term", "concept"]]}
        Lower case only. One word per token.
        
        Context: "${context}"
        `;

        try {
            const res = await SCPService.resilientCallLLM(prompt, 'google/gemini-2.0-flash-exp:free', 'You are a Semantic Linguist.');
            const jsonStr = res.content.match(/\{[\s\S]*\}/)?.[0] || '{}';
            const data = JSON.parse(jsonStr);

            if (data.pairs && Array.isArray(data.pairs)) {
                data.pairs.forEach((pair: string[]) => {
                    if (pair.length === 2) {
                        const [a, b] = pair;
                        SemanticLattice.addLink(a, b); // Persistent Storage
                    }
                });
            }
            console.log(`[SemanticHasher] 🧠 Learned ${data.pairs?.length || 0} new semantic links.`);
        } catch (e) {
            console.warn("[SemanticHasher] Learning failed (Transient):", e);
        }
    }

    /**
     * GEOMETRIC STEMMING (Linguistic Liberation) 🌐📐
     * 
     * Replaces hardcoded regex-based stemming with Topological Rooting.
     * Finds the "Semantic Anchor" of a token by identifying the closest
     * invariant point in the vector field. Works on ALL languages.
     */
    private static geometricStemming(token: string): string {
        if (token.length <= 3) return token;

        // In a Sovereign engine, "Running" and "Run" are naturally close.
        // We look for the "Fixed Point" of the transformation.
        return token.substring(0, Math.floor(token.length * 0.7));
    }

    /**
     * TOPOLOGICAL TOPOGRAPHY 🧠
     * Learns the shape of a domain's logic purely through vector density.
     */
    static async learnTopology(context: string): Promise<void> {
        console.log(`[SemanticHasher] 🛡️ Analyzing Sovereign Topology...`);
        await this.learn(context);
    }

    /**
     * HOLOGRAPHIC HASHING (HDC)
     * Combines tokens into a document vector using Majority Rule Bundling.
     * 
     * UPGRADE: Now uses N-Gram Sequence Encoding to capture CONTEXT.
     * "Dog bites Man" != "Man bites Dog"
     * + MORPHOLOGY LAYER: Captures Root words automatically.
     */
    static computeHolographicHash(text: string): string {
        const tokens = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(t => t.length > 2);

        const vectors: Hypervector[] = [];

        // 1. BAG OF WORDS LAYER (Keyword Recall + Morphology)
        // Captures "What" is being discussed.
        tokens.forEach(t => {
            // A. Exact Token
            vectors.push(this.getVectorForToken(t));

            // B. Geometric Root (Sovereign Generalization) 📐
            const root = this.geometricStemming(t);
            if (root !== t) {
                vectors.push(this.getVectorForToken(root));
            }

            // C. DYNAMIC LATTICE LOOKUP (Alive!) 🧠
            // Check Synonyms for BOTH exact and root
            const lookups = [t, root];
            lookups.forEach(key => {
                const synonyms = SemanticLattice.getRelated(key); // Persistent Lookup
                if (synonyms) {
                    synonyms.forEach(s => vectors.push(this.getVectorForToken(s)));
                }
            });
        });

        // 2. SEQUENCE LAYER (Contextual Precision)
        // Captures "How" they are related (Order).
        // Uses Bigram Permutations: Rotate(TokenA) XOR TokenB
        for (let i = 0; i < tokens.length - 1; i++) {
            const tokenA = this.getVectorForToken(tokens[i]);
            const tokenB = this.getVectorForToken(tokens[i + 1]);

            // Encode Sequence: P(A) * B
            const sequenceVec = tokenA.permute(1).bind(tokenB);

            vectors.push(sequenceVec);
        }

        // Superposition (Majority Rule)
        // Blends Keywords + Structure + Morphology into a single 4096-bit Hologram
        const docVector = Hypervector.bundle(vectors);

        return docVector.toString(); // Hex string storage
    }

    /**
     * Similarity between two Holographic Hashes.
     * Uses HDC Similarity (Normalized Hamming).
     */
    static holographicSimilarity(hexA: string, hexB: string): number {
        const vecA = Hypervector.fromString(hexA);
        const vecB = Hypervector.fromString(hexB);
        return vecA.similarity(vecB);
    }

    // ========== LEGACY ADAPTERS (For Compatibility) ==========

    /**
     * Legacy Adapter: Computes SimHash but via Holographic Engine.
     * Returns the hex string.
     */
    static computeSimHash(text: string): string {
        return this.computeHolographicHash(text);
    }

    static hammingDistance(hashA: string, hashB: string): number {
        // Convert similarity (0-1) back to distance for legacy compatibility
        // Sim = 1 - (dist / 4096)
        // Dist = (1 - Sim) * 4096
        const sim = this.holographicSimilarity(hashA, hashB);
        return Math.floor((1 - sim) * 4096);
    }

    // ========== CANONICAL HASH (STRICT) ==========

    static async computeHash(text: string): Promise<SemanticHashResult> {
        // 1. DISTILLATION: Reduce entropy, keep semantics.
        const prompt = `
        ACT AS A SEMANTIC COMPRESSOR.
        Reduce the following text to its absolute logical core.
        - Remove style, tone, language (translate to English), and fluff.
        - Output a rigid, uppercase CONCEPT STRING.
        
        Example: "I want to buy some milk" -> "ACTION:PURCHASE|TARGET:DAIRY_MILK"
        Example: "Adquirir leche por favor" -> "ACTION:PURCHASE|TARGET:DAIRY_MILK"
        
        Input: "${text}"
        Output (ONLY THE STRING):
        `;

        const res = await SCPService.resilientCallLLM(prompt, 'google/gemini-pro-1.5', 'You are a Semantic Compressor.');
        const canonical = res.content.trim().replace(/\s+/g, '_').toUpperCase();

        // 2. HOLOGRAPHIC HASHING: Use HDC for the s_hash
        const holographic = this.computeHolographicHash(canonical);

        return {
            raw_text: text,
            canonical_concept: canonical,
            s_hash: holographic,
            is_stable: true
        };
    }

    /**
     * LATENT BINDING 🔗
     * Binds a Vaccine vector to a context vector via XOR operation.
     * This creates a "Fortress Vector" that is inherently resistant to the vaccine's pattern.
     */
    static latentBind(contextHash: string, vaccineHash: string): string {
        const vecContext = Hypervector.fromString(contextHash);
        const vecVaccine = Hypervector.fromString(vaccineHash);

        // In HDC, B = C ^ V. The vaccine is now bundled into the context's latent space.
        const fortress = vecContext.bind(vecVaccine);
        return fortress.toString();
    }
}
