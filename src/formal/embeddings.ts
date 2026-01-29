// Embedding Service for Semantic Distance Calculation
// Foundation for fidelity verification (Theorem 4)

const EMBEDDING_MODEL = "nomic-embed-text";
const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

export interface EmbeddingResult {
    embedding: number[];
    tokens: number;
    model: string;
}

/**
 * Get embedding vector for text using OpenRouter
 */
export async function getEmbedding(
    text: string,
    apiKey: string
): Promise<EmbeddingResult | null> {
    try {
        const response = await fetch(`${OPENROUTER_BASE}/embeddings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: `openrouter/${EMBEDDING_MODEL}`,
                input: text,
            }),
        });

        if (!response.ok) {
            console.error(`Embedding failed: ${response.status}`);
            return null;
        }

        const data = await response.json();
        return {
            embedding: data.data?.[0]?.embedding ?? [],
            tokens: data.usage?.total_tokens ?? 0,
            model: EMBEDDING_MODEL,
        };
    } catch (error) {
        console.error("Embedding error:", error);
        return null;
    }
}

/**
 * Calculate cosine similarity between two embedding vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        const valA = a[i]!;
        const valB = b[i]!;
        dot += valA * valB;
        normA += valA * valA;
        normB += valB * valB;
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Calculate semantic distance (1 - cosine similarity)
 */
export function semanticDistanceFromEmbeddings(a: number[], b: number[]): number {
    return 1 - cosineSimilarity(a, b);
}

/**
 * Compare original conversation with reconstructed context
 * Returns semantic fidelity score (0-1, higher is better)
 */
export async function measureSemanticFidelity(
    originalText: string,
    reconstructedText: string,
    apiKey: string
): Promise<{ fidelity: number; distance: number } | null> {
    const [origEmb, recoEmb] = await Promise.all([
        getEmbedding(originalText, apiKey),
        getEmbedding(reconstructedText, apiKey),
    ]);

    if (!origEmb || !recoEmb) {
        return null;
    }

    const distance = semanticDistanceFromEmbeddings(
        origEmb.embedding,
        recoEmb.embedding
    );

    return {
        fidelity: 1 - distance,
        distance,
    };
}

/**
 * Batch embed multiple texts for efficiency
 */
export async function batchEmbed(
    texts: string[],
    apiKey: string
): Promise<number[][]> {
    const results: number[][] = [];

    // Process in batches of 10
    for (let i = 0; i < texts.length; i += 10) {
        const batch = texts.slice(i, i + 10);
        const embeddings = await Promise.all(
            batch.map(t => getEmbedding(t, apiKey))
        );

        for (const emb of embeddings) {
            results.push(emb?.embedding ?? []);
        }
    }

    return results;
}

/**
 * Calculate average pairwise similarity in a set of texts
 * Useful for measuring invariant coherence
 */
export async function clusterCoherence(
    texts: string[],
    apiKey: string
): Promise<number> {
    const embeddings = await batchEmbed(texts, apiKey);
    const validEmbeddings = embeddings.filter(e => e.length > 0);

    if (validEmbeddings.length < 2) return 1.0;

    let totalSim = 0;
    let count = 0;

    for (let i = 0; i < validEmbeddings.length; i++) {
        const embI = validEmbeddings[i];
        if (!embI) continue;
        for (let j = i + 1; j < validEmbeddings.length; j++) {
            const embJ = validEmbeddings[j];
            if (!embJ) continue;
            totalSim += cosineSimilarity(embI, embJ);
            count++;
        }
    }

    return totalSim / count;
}
